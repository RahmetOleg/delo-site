"use client";

/**
 * SmoothScroll — плавный скролл на Lenis, синхронизированный с GSAP ScrollTrigger.
 * Также перехватывает клики по якорным ссылкам (#services и т.п.) и прокручивает с easing.
 */
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // при reduced-motion оставляем нативный скролл

    const lenis = new Lenis({
      lerp: 0.11, // инерция: чем меньше — тем «тягучее»
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    // Lenis двигает скролл каждый кадр GSAP — единый тикер, никакого рассинхрона
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Якорные ссылки прокручиваем через Lenis (с учётом шапки)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.4 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    // Программный скролл для секций (Lenis не дружит с нативным scrollIntoView):
    // window.dispatchEvent(new CustomEvent("delo:scrollto", { detail: "#estimator" }))
    const onScrollTo = (e: Event) => {
      const sel = (e as CustomEvent<string>).detail;
      if (!sel) return;
      const el = document.querySelector(sel);
      if (!el) return;
      lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.4 });
    };
    window.addEventListener("delo:scrollto", onScrollTo);

    // Пересчёт триггеров после загрузки шрифтов/изображений
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("delo:scrollto", onScrollTo);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
