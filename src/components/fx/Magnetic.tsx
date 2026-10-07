"use client";

/**
 * Magnetic — «магнитная» обёртка: элемент мягко тянется к курсору,
 * при уходе — упруго возвращается (elastic). Работает только с мышью.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Сила притяжения 0..1 (0.35 — заметная, но элегантная) */
  strength?: number;
}

export default function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useHasFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [fine, reduced, strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
