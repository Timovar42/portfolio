"use client";

import { useStaticPathname } from "@/lib/navigation/useStaticPathname";
import { normalizeAppPath } from "@/lib/navigation/staticPaths";
import { LocationMap } from "@/components/LocationMap";
import type { SiteSettings } from "@/lib/types";

interface ConditionalLocationMapProps {
  settings: Pick<SiteSettings, "address" | "lat" | "lng">;
}

export function ConditionalLocationMap({ settings }: ConditionalLocationMapProps) {
  const pathname = useStaticPathname();

  if (normalizeAppPath(pathname) === "/") {
    return null;
  }

  return <LocationMap settings={settings} />;
}
