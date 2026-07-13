/**
 * Преобразует абсолютные пути приложения в относительные для открытия через file://
 */

export function normalizeAppPath(path: string): string {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

/** Маршрут приложения из URL file:// (…/out/constructor/index.html → /constructor) */
export function getStaticRouteFromLocation(): string {
  if (typeof document !== "undefined") {
    const route = document.documentElement.getAttribute("data-route");
    if (route !== null) {
      return route || "/";
    }
  }

  if (typeof window === "undefined") return "/";

  const pathname = decodeURIComponent(
    window.location.pathname.replace(/\\/g, "/"),
  );

  const outMarker = "/out/";
  const outIndex = pathname.toLowerCase().lastIndexOf(outMarker);

  if (outIndex >= 0) {
    let relative = pathname.slice(outIndex + outMarker.length);
    if (relative.endsWith("/index.html")) {
      relative = relative.slice(0, -"/index.html".length);
    }
    if (relative.endsWith("/")) {
      relative = relative.slice(0, -1);
    }
    return relative ? `/${relative}` : "/";
  }

  return normalizeAppPath(window.location.pathname);
}

export function resolveStaticHref(href: string): string {
  if (
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("#") ||
    href.startsWith(".")
  ) {
    return href;
  }

  if (typeof window === "undefined" || window.location.protocol !== "file:") {
    return href;
  }

  const normalized = href.startsWith("/") ? href : `/${href}`;
  const segments = normalized.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

  const currentPath = decodeURIComponent(
    window.location.pathname.replace(/\\/g, "/"),
  );
  const outMarker = "/out/";
  const outIndex = currentPath.toLowerCase().lastIndexOf(outMarker);
  if (outIndex === -1) {
    return href;
  }

  const currentRelative = currentPath.slice(outIndex + outMarker.length);
  const currentDir = currentRelative.includes("/")
    ? currentRelative.slice(0, currentRelative.lastIndexOf("/") + 1)
    : "";

  const targetRelative =
    segments.length === 0 ? "index.html" : `${segments.join("/")}/index.html`;

  return relativePathFrom(currentDir, targetRelative);
}

function relativePathFrom(fromDir: string, toFile: string): string {
  const fromParts = fromDir.split("/").filter(Boolean);
  const toParts = toFile.split("/").filter(Boolean);

  let shared = 0;
  while (
    shared < fromParts.length &&
    shared < toParts.length &&
    fromParts[shared] === toParts[shared]
  ) {
    shared += 1;
  }

  const ups = fromParts.length - shared;
  const downs = toParts.slice(shared);
  const parts = [...Array.from({ length: ups }, () => ".."), ...downs];

  if (parts.length === 0) {
    return "./index.html";
  }

  return parts.join("/");
}

export function navigateStatic(href: string): void {
  window.location.href = resolveStaticHref(href);
}
