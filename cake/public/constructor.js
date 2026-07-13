(function () {
  "use strict";

  var DATA = null;
  var state = null;
  var root = null;

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  function assetPrefix() {
    try {
      if (location.protocol !== "file:") return "/";
      var p = decodeURIComponent(location.pathname.replace(/\\/g, "/"));
      var i = p.toLowerCase().lastIndexOf("/out/");
      if (i < 0) {
        return document.documentElement.getAttribute("data-asset-prefix") || "./";
      }
      var r = p.slice(i + 5);
      if (r.endsWith("/index.html")) r = r.slice(0, -11);
      if (r.endsWith("/")) r = r.slice(0, -1);
      var d = r ? r.split("/").length : 0;
      return d === 0 ? "./" : new Array(d + 1).join("../");
    } catch (e) {
      return "./";
    }
  }

  function assetUrl(p) {
    var clean = String(p).replace(/^\/+/, "");
    return assetPrefix() + clean;
  }

  function formatPrice(n) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function loadData() {
    var el = document.getElementById("constructor-data");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent || "");
    } catch (e) {
      return null;
    }
  }

  function resolveWeightKg() {
    if (state.weightKg && state.weightKg > 0) return state.weightKg;
    if (state.guests && state.guests > 0) {
      return Math.max(1, Math.ceil(state.guests / 8) * 0.5);
    }
    return 1;
  }

  function calculatePrice() {
    var rules = DATA.priceRules;
    var weightKg = resolveWeightKg();
    var sponge = DATA.sponges.find(function (s) {
      return s.id === state.spongeId;
    });
    var filling = DATA.fillings.find(function (f) {
      return f.id === state.fillingId;
    });
    var cream = DATA.creams.find(function (c) {
      return c.id === state.creamId;
    });
    var decor = DATA.decors.find(function (d) {
      return d.id === state.decorId;
    });

    var baseBeforeOccasion =
      weightKg * rules.basePricePerKg + (state.guests || 0) * rules.pricePerGuest;
    var shapeMultiplier = rules.shapeMultipliers[state.shape];
    var shapeAdd = rules.shapeFixedAdd[state.shape];
    var tiers = Math.max(1, state.tiers || 1);
    var tierAdd = (tiers - 1) * DATA.pricePerExtraTier;
    var spongeAdd = sponge ? sponge.priceAdd : 0;
    var fillingAdd = filling ? filling.priceAdd : 0;
    var creamAdd = cream ? cream.priceAdd : 0;

    var extrasAdd = (state.extraIds || []).reduce(function (sum, id) {
      var extra = DATA.extras.find(function (e) {
        return e.id === id;
      });
      return sum + (extra ? extra.priceAdd : 0);
    }, 0);

    var decorAdd = decor
      ? decor.priceAdd
      : state.customDecorNote
        ? DATA.customDecorPrice
        : 0;

    var topperAdd = (state.topperIds || []).reduce(function (sum, id) {
      var topper = DATA.toppers.find(function (t) {
        return t.id === id;
      });
      return sum + (topper ? topper.priceAdd : 0);
    }, 0);

    if (state.inscription && state.inscription.trim()) {
      topperAdd += DATA.inscriptionPrice;
    }

    var subtotal =
      baseBeforeOccasion * shapeMultiplier +
      shapeAdd +
      tierAdd +
      spongeAdd +
      fillingAdd +
      creamAdd +
      extrasAdd +
      decorAdd +
      topperAdd;

    var occasionMultiplier = rules.occasionMultipliers[state.occasion];
    var total = Math.round(subtotal * occasionMultiplier);

    return { total: total, weightKg: weightKg, tiers: tiers };
  }

  function setCardActive(selector, value) {
    $$(selector).forEach(function (btn) {
      var id = btn.getAttribute("data-value");
      var kind = btn.getAttribute("data-select");
      var selected;
      if (kind === "extra") {
        selected = (state.extraIds || []).indexOf(id) >= 0;
      } else if (kind === "topper") {
        selected = (state.topperIds || []).indexOf(id) >= 0;
      } else {
        selected = id === value;
      }

      btn.classList.remove("border-rose", "bg-rose/5", "border-cream-dark");
      if (selected) {
        btn.classList.add("border-rose", "bg-rose/5");
      } else {
        btn.classList.add("border-cream-dark");
      }

      var mark = btn.querySelector("[data-check]");
      if (mark) {
        mark.classList.remove("border-rose", "bg-rose", "border-cream-dark", "bg-transparent");
        if (selected) {
          mark.classList.add("border-rose", "bg-rose");
        } else {
          mark.classList.add("border-cream-dark", "bg-transparent");
        }
      }
    });
  }

  function setChipActive(container, value) {
    $$(container + " [data-chip]").forEach(function (chip) {
      var on = chip.getAttribute("data-value") === String(value);
      chip.classList.remove("bg-rose", "text-white", "bg-cream-dark", "text-chocolate");
      if (on) {
        chip.classList.add("bg-rose", "text-white");
      } else {
        chip.classList.add("bg-cream-dark", "text-chocolate");
      }
    });
  }

  function showStep(step) {
    state.step = step;
    $$("[data-step-panel]").forEach(function (panel) {
      var n = Number(panel.getAttribute("data-step-panel"));
      panel.hidden = n !== step;
    });
    $$("[data-step-pill]").forEach(function (pill) {
      var n = Number(pill.getAttribute("data-step-pill"));
      pill.className =
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition " +
        (n === step
          ? "bg-rose text-white shadow-soft"
          : n < step
            ? "bg-rose/15 text-rose-dark hover:bg-rose/25"
            : "bg-cream-dark/70 text-chocolate-light hover:bg-cream-dark");
    });
    var progress = $("[data-progress-bar]");
    if (progress) {
      progress.style.width =
        ((step + 1) / DATA.steps.length) * 100 + "%";
    }
    var stepNum = $("[data-step-num]");
    if (stepNum) stepNum.textContent = String(step + 1);
    var stepHint = $("[data-step-hint]");
    if (stepHint && DATA.steps[step]) stepHint.textContent = DATA.steps[step].hint;

    var nav = $("[data-step-nav]");
    if (nav) nav.hidden = step === DATA.steps.length - 1;

    var backBtn = $('[data-action="back"]');
    if (backBtn) backBtn.disabled = step === 0;

    var nextBtn = $('[data-action="next"]');
    if (nextBtn) nextBtn.disabled = !canGoNext();

    var orderBtn = $('[data-action="goto-order"]');
    if (orderBtn) orderBtn.hidden = step === DATA.steps.length - 1;

    renderSummary();
  }

  function canGoNext() {
    if (state.step === 1) {
      return state.sizeMode === "guests"
        ? (state.guests || 0) > 0
        : (state.weightKg || 0) > 0;
    }
    if (state.step === 3) return Boolean(state.spongeId);
    if (state.step === 4) return Boolean(state.fillingId);
    if (state.step === 5) return Boolean(state.creamId);
    if (state.step === 8) {
      return Boolean(state.decorId || (state.customDecorNote || "").trim());
    }
    return true;
  }

  function renderPreview() {
    var color = DATA.colors.find(function (c) {
      return c.id === state.colorId;
    });
    var hex = color ? color.hex : "#f2e2c9";
    var tiers =
      state.shape === "tiered" ? Math.min(Math.max(state.tiers || 2, 2), 4) : 1;
    var box = $("[data-cake-preview]");
    if (!box) return;
    var layers = "";
    for (var i = 0; i < tiers; i++) {
      var w = 80 + (tiers - 1 - i) * 34;
      layers +=
        '<div class="rounded-t-md border border-black/5 shadow-sm" style="width:' +
        w +
        "px;height:28px;background-color:" +
        hex +
        ';margin-top:' +
        (i === 0 ? 0 : -1) +
        'px"></div>';
    }
    box.innerHTML =
      '<div class="flex flex-col items-center justify-end rounded-xl bg-gradient-to-b from-cream to-rose/20 p-5">' +
      '<div class="flex flex-col items-center"><span class="mb-1 h-3 w-1 rounded-full bg-terracotta"></span>' +
      layers +
      '<div class="h-2.5 rounded-b-lg bg-chocolate/15" style="width:' +
      (80 + (tiers - 1) * 34 + 12) +
      'px"></div></div>' +
      '<p class="mt-3 text-xs text-chocolate-light">' +
      (tiers > 1 ? tiers + "-ярусный торт" : "Одноярусный торт") +
      "</p></div>";
  }

  function renderSummary() {
    var price = calculatePrice();
    var sponge = DATA.sponges.find(function (s) {
      return s.id === state.spongeId;
    });
    var filling = DATA.fillings.find(function (f) {
      return f.id === state.fillingId;
    });
    var cream = DATA.creams.find(function (c) {
      return c.id === state.creamId;
    });
    var color = DATA.colors.find(function (c) {
      return c.id === state.colorId;
    });
    var decor = DATA.decors.find(function (d) {
      return d.id === state.decorId;
    });
    var extras = DATA.extras.filter(function (e) {
      return (state.extraIds || []).indexOf(e.id) >= 0;
    });
    var toppers = DATA.toppers.filter(function (t) {
      return (state.topperIds || []).indexOf(t.id) >= 0;
    });

    function setSummary(key, val) {
      var el = $('[data-summary="' + key + '"]');
      if (el) el.textContent = val || "—";
    }

    setSummary("occasion", DATA.labels.occasion[state.occasion]);
    setSummary(
      "size",
      state.guests
        ? state.guests + " гостей"
        : state.weightKg
          ? state.weightKg + " кг"
          : "—",
    );
    setSummary(
      "shape",
      state.shape === "tiered"
        ? DATA.labels.shape[state.shape] + " (" + (state.tiers || 2) + ")"
        : DATA.labels.shape[state.shape],
    );
    setSummary("sponge", sponge ? sponge.name : "—");
    setSummary("filling", filling ? filling.name : "—");
    setSummary("cream", cream ? cream.name : "—");
    setSummary(
      "extras",
      extras.length ? extras.map(function (e) { return e.name; }).join(", ") : "—",
    );
    setSummary("color", color ? color.name : "—");
    setSummary(
      "decor",
      state.customDecorNote ? "Свой пример" : decor ? decor.name : "—",
    );
    setSummary(
      "inscription",
      state.inscription && state.inscription.trim()
        ? "«" + state.inscription.trim() + "»"
        : "—",
    );
    setSummary(
      "toppers",
      toppers.length ? toppers.map(function (t) { return t.name; }).join(", ") : "—",
    );

    $$("[data-price-total]").forEach(function (el) {
      el.textContent = formatPrice(price.total);
    });
    var weightEl = $("[data-price-weight]");
    if (weightEl) weightEl.textContent = "~" + price.weightKg + " кг";

    var priceFinal = $("[data-price-final]");
    if (priceFinal) priceFinal.textContent = formatPrice(price.total);

    renderPreview();

    var tierPanel = $("[data-tier-panel]");
    if (tierPanel) tierPanel.hidden = state.shape !== "tiered";
  }

  function toggleArray(key, id) {
    var arr = state[key].slice();
    var idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(id);
    state[key] = arr;
  }

  function onClick(e) {
    var btn = e.target.closest(
      "[data-action],[data-select],[data-chip],[data-step-pill]",
    );
    if (!btn || !btn.closest("#constructor-app")) return;
    e.preventDefault();

    if (btn.hasAttribute("data-step-pill")) {
      showStep(Number(btn.getAttribute("data-step-pill")));
      return;
    }

    var action = btn.getAttribute("data-action");
    if (action === "next" && canGoNext()) {
      showStep(Math.min(state.step + 1, DATA.steps.length - 1));
      return;
    }
    if (action === "back") {
      showStep(Math.max(state.step - 1, 0));
      return;
    }
    if (action === "goto-order") {
      showStep(DATA.steps.length - 1);
      return;
    }

    var select = btn.getAttribute("data-select");
    var value = btn.getAttribute("data-value");

    if (select === "occasion") {
      state.occasion = value;
      setCardActive('[data-select="occasion"]', value);
    } else if (select === "size-mode") {
      state.sizeMode = value;
      if (value === "guests") {
        state.guests = state.guests || 10;
        state.weightKg = null;
      } else {
        state.weightKg = state.weightKg || 2;
        state.guests = null;
      }
      setChipActive("[data-size-mode]", value);
      var guestsBlock = $("[data-guests-block]");
      var weightBlock = $("[data-weight-block]");
      if (guestsBlock) guestsBlock.hidden = value !== "guests";
      if (weightBlock) weightBlock.hidden = value !== "weight";
    } else if (select === "guests-preset") {
      state.guests = Number(value);
      state.weightKg = null;
      var guestsInput = $("[data-guests-input]");
      if (guestsInput) guestsInput.value = value;
      setChipActive("[data-guests-presets]", value);
    } else if (select === "weight-preset") {
      state.weightKg = Number(value);
      state.guests = null;
      var weightInput = $("[data-weight-input]");
      if (weightInput) weightInput.value = value;
      setChipActive("[data-weight-presets]", value);
    } else if (select === "shape") {
      state.shape = value;
      if (value === "tiered" && (!state.tiers || state.tiers < 2)) state.tiers = 2;
      setCardActive('[data-select="shape"]', value);
      var tierPanel = $("[data-tier-panel]");
      if (tierPanel) tierPanel.hidden = value !== "tiered";
    } else if (select === "tiers") {
      state.tiers = Number(value);
      setChipActive("[data-tiers]", value);
    } else if (select === "sponge") {
      state.spongeId = value;
      setCardActive('[data-select="sponge"]', value);
    } else if (select === "filling") {
      state.fillingId = value;
      setCardActive('[data-select="filling"]', value);
    } else if (select === "cream") {
      state.creamId = value;
      setCardActive('[data-select="cream"]', value);
    } else if (select === "extra") {
      toggleArray("extraIds", value);
      setCardActive('[data-select="extra"]', value);
    } else if (select === "color") {
      state.colorId = value;
      setCardActive('[data-select="color"]', value);
    } else if (select === "decor") {
      state.decorId = value;
      state.customDecorNote = "";
      var note = $("[data-custom-decor-note]");
      if (note) note.value = "";
      setCardActive('[data-select="decor"]', value);
    } else if (select === "topper") {
      toggleArray("topperIds", value);
      setCardActive('[data-select="topper"]', value);
    }

    renderSummary();
    var nextBtn = $('[data-action="next"]');
    if (nextBtn) nextBtn.disabled = !canGoNext();
  }

  function onInput(e) {
    var t = e.target;
    if (!t || !t.closest || !t.closest("#constructor-app")) return;
    if (t.matches("[data-guests-input]")) {
      state.guests = Number(t.value) || 0;
      state.weightKg = null;
    }
    if (t.matches("[data-weight-input]")) {
      state.weightKg = Number(t.value) || 0;
      state.guests = null;
    }
    if (t.matches("[data-inscription]")) {
      state.inscription = t.value;
    }
    if (t.matches("[data-custom-decor-note]")) {
      state.customDecorNote = t.value;
      if (t.value.trim()) state.decorId = null;
    }
    renderSummary();
    var nextBtn = $('[data-action="next"]');
    if (nextBtn) nextBtn.disabled = !canGoNext();
  }

  function onSubmit(e) {
    var form = e.target;
    if (!form || !form.matches || !form.matches("[data-demo-form]")) return;
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var ok = $("[data-demo-success]");
    if (ok) ok.hidden = false;
    form.hidden = true;
  }

  var applying = false;

  function applyAll() {
    root = document.getElementById("constructor-app");
    if (!root) return;
    applying = true;

    showStep(state.step);

    setCardActive('[data-select="occasion"]', state.occasion);
    setChipActive("[data-size-mode]", state.sizeMode);
    setCardActive('[data-select="shape"]', state.shape);
    setCardActive('[data-select="sponge"]', state.spongeId);
    setCardActive('[data-select="filling"]', state.fillingId);
    setCardActive('[data-select="cream"]', state.creamId);
    setCardActive('[data-select="color"]', state.colorId);
    setCardActive('[data-select="extra"]', null);
    setCardActive('[data-select="topper"]', null);
    if (state.decorId) setCardActive('[data-select="decor"]', state.decorId);
    if (state.shape === "tiered") setChipActive("[data-tiers]", state.tiers);
    setChipActive(
      "[data-guests-presets]",
      state.guests != null ? state.guests : -1,
    );
    setChipActive(
      "[data-weight-presets]",
      state.weightKg != null ? state.weightKg : -1,
    );

    var guestsBlock = $("[data-guests-block]");
    var weightBlock = $("[data-weight-block]");
    if (guestsBlock) guestsBlock.hidden = state.sizeMode !== "guests";
    if (weightBlock) weightBlock.hidden = state.sizeMode !== "weight";

    var gi = $("[data-guests-input]");
    if (gi && state.guests != null) gi.value = state.guests;
    var wi = $("[data-weight-input]");
    if (wi && state.weightKg != null) wi.value = state.weightKg;
    var ins = $("[data-inscription]");
    if (ins) ins.value = state.inscription || "";
    var cdn = $("[data-custom-decor-note]");
    if (cdn) cdn.value = state.customDecorNote || "";

    $$("[data-decor-img]").forEach(function (img) {
      var src = img.getAttribute("data-decor-img");
      if (src) img.src = assetUrl(src);
    });

    root.setAttribute("data-capplied", "1");
    applying = false;
  }

  function init() {
    DATA = loadData();
    root = document.getElementById("constructor-app");
    if (!DATA || !root) return;

    if (!state) {
      state = Object.assign(
        {
          step: 0,
          sizeMode: "guests",
          customDecorNote: "",
          inscription: "",
          decorId: null,
        },
        JSON.parse(JSON.stringify(DATA.initial)),
      );
    }

    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    document.addEventListener("submit", onSubmit);

    applyAll();

    // React (при открытии через file://) может пересобрать DOM после гидрации.
    // Следим и переприменяем текущее состояние к новым узлам.
    var observer = new MutationObserver(function () {
      if (applying) return;
      var el = document.getElementById("constructor-app");
      if (el && el.getAttribute("data-capplied") !== "1") {
        applyAll();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
