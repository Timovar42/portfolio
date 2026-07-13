"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { resolveStaticHref } from "@/lib/navigation/staticPaths";

interface StaticLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export function StaticLink({
  href,
  children,
  onClick,
  ...props
}: StaticLinkProps) {
  const resolved = resolveStaticHref(href);

  return (
    <a
      href={resolved}
      onClick={(event) => {
        if (
          typeof window !== "undefined" &&
          window.location.protocol === "file:" &&
          !event.defaultPrevented
        ) {
          event.preventDefault();
          window.location.href = resolved;
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
