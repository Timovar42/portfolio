"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { getStaticRouteFromLocation } from "@/lib/navigation/staticPaths";

function readRouteFromDocument(): string | null {
  if (typeof document === "undefined") return null;
  const route = document.documentElement.getAttribute("data-route");
  if (route === null) return null;
  return route || "/";
}

export function useStaticPathname(): string {
  const nextPathname = usePathname();
  const [pathname] = useState(() => readRouteFromDocument() ?? nextPathname);

  if (typeof window !== "undefined" && window.location.protocol === "file:") {
    return readRouteFromDocument() ?? getStaticRouteFromLocation();
  }

  return pathname;
}
