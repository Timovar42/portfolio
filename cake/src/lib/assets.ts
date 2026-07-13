function getDepthPrefix(): string {
  try {
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
      const depth = relative ? relative.split("/").filter(Boolean).length : 0;
      return depth === 0 ? "./" : "../".repeat(depth);
    }
  } catch {
    /* ignore */
  }

  return "./";
}

/** Префикс к public/ для static export (file:// и вложенные страницы в out/). */
export function getAssetPrefix(): string {
  if (typeof document !== "undefined") {
    const preset = document.documentElement.getAttribute("data-asset-prefix");
    if (preset) return preset;
  }

  if (typeof window === "undefined") {
    return "./";
  }

  if (
    document.documentElement.getAttribute("data-static-export") === "true" &&
    window.location.protocol === "file:"
  ) {
    return getDepthPrefix();
  }

  try {
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
      const depth = relative ? relative.split("/").filter(Boolean).length : 0;
      return depth === 0 ? "./" : "../".repeat(depth);
    }

    if (window.location.protocol === "file:") {
      return "./";
    }
  } catch {
    /* ignore */
  }

  return "/";
}

/** Путь к файлу из public/ с учётом глубины страницы (file:// и static export). */
export function assetUrl(path: string): string {
  if (/^(data:|https?:|blob:)/i.test(path)) {
    return path;
  }

  const clean = path.replace(/^\/+/, "");
  const prefix = getAssetPrefix();

  if (prefix === "/") {
    return `/${clean}`;
  }

  return `${prefix}${clean}`;
}
