"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: string;
  delay?: number;
  id?: string;
  onClick?: () => void;
  as?: "div" | "article" | "section";
}

export function BentoCard({
  children,
  className = "",
  span = "",
  delay = 0,
  id,
  onClick,
  as: Tag = "div",
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      onClick={onClick}
      className={`bento-card bento-reveal overflow-hidden ${span} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
