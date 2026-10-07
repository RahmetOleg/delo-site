"use client";

/**
 * Reveal — появление контента при скролле (GSAP ScrollTrigger).
 *
 * <Reveal>текст</Reveal>                       — плавный fade+slide
 * <Reveal y={40} delay={0.15}>…</Reveal>       — больше сдвиг, задержка
 * <Reveal stagger={0.08}>…дочерние элементы…</Reveal> — каскад детей
 *
 * При reduced-motion контент показывается сразу.
 */
import { useEffect, useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Задержка начала, сек */
  delay?: number;
  /** Сдвиг по Y, px */
  y?: number;
  /** Сдвиг по X, px */
  x?: number;
  /** Начальный масштаб */
  scale?: number;
  /** Если задан — анимируются непосредственные дети с каскадом */
  stagger?: number;
  /** Тег-обёртка */
  as?: ElementType;
  /** Порог срабатывания: 'top 85%' по умолчанию */
  start?: string;
}

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  x = 0,
  scale = 1,
  stagger = 0,
  as = "div",
  start = "top 86%",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
      if (stagger) gsap.set(el.children, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (stagger) {
        const kids = Array.from(el.children) as HTMLElement[];
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          kids,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            stagger,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y, x, scale },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 1.1,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, delay, y, x, scale, stagger, start]);

  // Приводим к FC с нужными пропсами — строгий TS любит конкретику
  const Tag = as as unknown as FC<{
    ref?: Ref<HTMLElement | null>;
    className?: string;
    children?: ReactNode;
  }>;


  return (
    <Tag ref={ref} className={cn("will-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Счётчик с анимацией цифры при появлении (для статистики) */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.n)}${suffix}`;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, value, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
