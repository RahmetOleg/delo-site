"use client";

/**
 * Preloader — загрузочный экран: логотип, счётчик 0→100%, линия прогресса.
 * По завершении — «curtain reveal»: 5 вертикальных панелей уезжают вверх с каскадом,
 * открывая сайт. Уважает reduced-motion (мгновенный пропуск).
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Reduced-motion: мгновенный пропуск (отложенно — setState не синхронный в теле эффекта)
      const t = setTimeout(() => {
        setHidden(true);
        onDone();
      }, 0);
      return () => clearTimeout(t);
    }

    const root = rootRef.current;
    const num = numRef.current;
    const bar = barRef.current;
    if (!root || !num || !bar) return;

    const counter = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setHidden(true);
        onDone();
      },
    });

    // Ждём шрифты (максимум 1.2 c), затем играем прогресс
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise((r) => setTimeout(r, 1200));
    Promise.race([fontsReady, timeout]).then(() => {
      tl.to(counter, {
        n: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          num.textContent = String(Math.round(counter.n)).padStart(3, "0");
          bar.style.transform = `scaleX(${counter.n / 100})`;
        },
      })
        // Логотип и подпись слегка уезжают вверх
        .to("[data-preload-fade]", { y: -26, opacity: 0, duration: 0.5, ease: "power2.in" }, "-=0.15")
        // Панели-«занавес» уезжают вверх каскадом
        .to("[data-preload-panel]", {
          yPercent: -100,
          duration: 0.85,
          stagger: 0.07,
          ease: "power4.inOut",
        }, "-=0.1");
    });

    return () => {
      tl.kill();
    };
  }, [reduced, onDone]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[300]" aria-hidden>
      {/* 5 панелей-занавес */}
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} data-preload-panel className="h-full flex-1 bg-[#0A0A0F]" style={{ borderRight: i < 4 ? "1px solid rgba(244,243,250,0.03)" : undefined }} />
        ))}
      </div>

      {/* Содержимое прелоадера */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div data-preload-fade className="flex flex-col items-center gap-6">
          {/* Знак студии */}
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-acc via-indigo-acc to-blue-acc glow" />
            <div className="absolute inset-0 flex items-center justify-center font-semibold text-white text-xl">Д</div>
          </div>
          <p className="mono-label tracking-[0.3em]">студия «дело»</p>
        </div>

        {/* Счётчик и линия прогресса */}
        <div data-preload-fade className="absolute bottom-10 left-0 right-0 px-8 md:px-14">
          <div className="mx-auto flex max-w-[1400px] items-end justify-between">
            <div className="h-px flex-1 self-center overflow-hidden bg-white/10">
              <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc" />
            </div>
            <span ref={numRef} className="ml-6 font-mono text-4xl tabular-nums text-ink md:text-5xl">000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
