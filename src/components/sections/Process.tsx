"use client";

/**
 * Секция «04 — Как проходит работа».
 * Вертикальный таймлайн: базовая hairline-линия + градиентный заполнитель,
 * который «рисуется» скроллом (GSAP ScrollTrigger scrub).
 * Точки-маркеры выровнены по центру линии: линия left 14.5px (md 18.5px),
 * точка 14px с левым краем 8px (md 12px) → центр точно на линии.
 */
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import Reveal from "@/components/fx/Reveal";
import { SectionHead } from "@/components/sections/shared";
import { PROCESS_STEPS } from "@/lib/content";

export default function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;

    // Reduced motion — линия отрисована сразу, без анимации
    if (reduced) {
      gsap.set(fill, { height: "100%" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="process" className="relative bg-[#0D0D14]/80">
      {/* Hairline сверху и снизу — поверхность-полоса */}
      <div className="hairline absolute inset-x-0 top-0" aria-hidden />
      <div className="hairline absolute inset-x-0 bottom-0" aria-hidden />

      <div className="mx-auto w-full max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <SectionHead
          num="04"
          label="— Как проходит работа"
          title={
            <>
              От звонка до запуска —{" "}
              <em className="font-serif not-italic font-normal text-gradient">без сюрпризов</em>
            </>
          }
          lead="Каждый этап заканчивается вашим «да»: сначала вы принимаете работу, потом платите за этап."
        />

        {/* Таймлайн */}
        <div ref={wrapRef} className="relative mt-16">
          {/* Базовая вертикальная линия */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-2 left-[14.5px] w-px bg-white/10 md:left-[18.5px]"
          />
          {/* Градиентный заполнитель — рисуется скроллом (scrub) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-2 left-[14.5px] w-px md:left-[18.5px]"
          >
            <div
              ref={fillRef}
              className="h-0 w-full bg-gradient-to-b from-violet-acc via-indigo-acc to-blue-acc"
            />
          </div>

          <ol className="relative list-none space-y-12 pl-10 md:pl-14">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal as="li" key={step.num} delay={i * 0.05} className="relative">
                {/* Маркер-точка на линии */}
                <span
                  aria-hidden
                  className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-violet-acc bg-[#0A0A0F] shadow-[0_0_12px_rgba(167,139,250,0.6)] md:-left-11"
                />

                <p className="inline-flex rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-ink-muted">
                  {step.num} · {step.when}
                </p>
                <h3 className="mt-3 text-xl font-bold text-ink md:text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
