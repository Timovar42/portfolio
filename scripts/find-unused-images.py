#!/usr/bin/env python3
"""Find all image files not referenced by the live site."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico"}
SCAN_EXTS = {".html", ".css", ".js", ".json", ".xml", ".md", ".txt", ".tsx", ".ts", ".jsx"}

# Live site roots (what GitHub Pages serves)
LIVE_DIRS = [
    ROOT,
    ROOT / "lawyer",
    ROOT / "cake" / "out",
]
LIVE_FILES = [ROOT / "index.html", ROOT / "sitemap.xml", ROOT / "favicon.svg"]


def iter_site_text_files():
    seen = set()
    for f in LIVE_FILES:
        if f.is_file():
            seen.add(f.resolve())
            yield f
    for base in LIVE_DIRS:
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if "node_modules" in p.parts or ".git" in p.parts:
                continue
            if p.is_file() and p.suffix.lower() in SCAN_EXTS:
                rp = p.resolve()
                if rp not in seen:
                    seen.add(rp)
                    yield p


def extract_refs(content: str) -> set[str]:
    refs: set[str] = set()
    patterns = [
        r"images/[\w@./\-]+\.(?:png|jpe?g|webp|gif|svg|ico)",
        r"favicon\.svg",
        r"/cakes/[\w@./\-]+\.(?:png|jpe?g|webp|gif|svg)",
        r"cakes/[\w@./\-]+\.(?:png|jpe?g|webp|gif|svg)",
        r"[\w@./\-]+\.(?:png|jpe?g|webp|gif|svg|ico)",
    ]
    for pat in patterns:
        for m in re.finditer(pat, content, re.I):
            ref = m.group(0).split("?")[0].strip("\"'")
            refs.add(ref.replace("\\", "/"))
    return refs


def normalize_ref(ref: str) -> set[str]:
    ref = ref.replace("https://antares.agency/", "")
    if ref.startswith("/"):
        ref = ref[1:]
    out = {ref, Path(ref).name}
    # cake paths: /cakes/foo.jpg -> cake/out/cakes/foo.jpg
    if ref.startswith("cakes/"):
        out.add("cake/out/" + ref)
    return out


def is_image_used(rel: str, used_paths: set[str]) -> bool:
    name = Path(rel).name
    variants = {rel, name, rel.replace("\\", "/")}
    if rel.startswith("cake/out/cakes/"):
        variants.add("cakes/" + name)
        variants.add("/cakes/" + name)
    if rel.startswith("cake/public/cakes/"):
        variants.add("cakes/" + name)
        variants.add("/cakes/" + name)
    if rel.startswith("images/"):
        variants.add(name)
    for v in variants:
        if v in used_paths:
            return True
        for u in used_paths:
            if u.endswith("/" + name) or u == name or name in u:
                return True
    return False


def main() -> None:
    used: set[str] = set()
    for path in iter_site_text_files():
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for ref in extract_refs(content):
            used |= normalize_ref(ref)

    all_images = [
        p
        for p in ROOT.rglob("*")
        if p.is_file()
        and p.suffix.lower() in IMG_EXTS
        and "node_modules" not in p.parts
        and ".git" not in p.parts
    ]

    unused: list[str] = []
    used_list: list[str] = []
    for p in sorted(all_images):
        rel = p.relative_to(ROOT).as_posix()
        # Skip cake/public if duplicate of cake/out - mark public separately
        if is_image_used(rel, used):
            used_list.append(rel)
        else:
            unused.append(rel)

    print("USED:", len(used_list))
    print("UNUSED:", len(unused))
    for r in unused:
        print(" ", r)


if __name__ == "__main__":
    main()
