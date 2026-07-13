"use client";

import { useStaticPathname } from "@/lib/navigation/useStaticPathname";
import { normalizeAppPath } from "@/lib/navigation/staticPaths";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = useStaticPathname();
  const normalized = normalizeAppPath(pathname);
  const isBentoLayout = normalized === "/" || normalized === "/catalog";

  return (
    <main
      className={
        isBentoLayout
          ? "mx-auto min-h-[calc(100vh-5rem)] max-w-7xl px-3 py-4 pb-28 sm:px-6 sm:py-8 sm:pb-8"
          : "mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-3 py-6 sm:px-6 sm:py-8"
      }
    >
      {children}
    </main>
  );
}
