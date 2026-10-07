"use client";

/**
 * Hero — первый экран:
 * - intro-каскад [data-hero] через GSAP (после прелоадера, prop loaded);
 * - крупная типографика с serif-градиентным акцентом;
 * - статистика с CountUp, магнитные кнопки, статус «свободен для проектов».
 */
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, BadgeCheck } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import Magnetic from "@/components/fx/Magnetic";
import { CountUp } from "@/components/fx/Reveal";
import { HERO_STATS } from "@/lib/content";

export default function Hero({ loaded }: { loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  /* Intro-каскад: запускается один раз после прелоадера */
  useEffect(() => {
    const scope = ref.current;
    if (!scope || !loaded) return;

    const els = Array.from(scope.querySelectorAll<HTMLElement>("[data-hero]"));

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        els,
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: "power3.out", delay: 0.15 }
      );
    }, scope);

    return () => ctx.revert();
  }, [loaded, reduced]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        {/* Верхняя строка: лейбл студии + статус */}
        <div data-hero className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="mono-label">Студия «ДЕЛО» — сайты и приложения</p>
          <p className="mono-label flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
            </span>
            Работаю со всей Россией · Свободен для новых проектов
          </p>
        </div>

        {/* Главный заголовок */}
        <h1
          data-hero
          className="mt-8 max-w-5xl text-[clamp(2.6rem,7.2vw,5.9rem)] font-extrabold leading-[1.02] tracking-[-0.03em]"
        >
          Сайт или приложение, которое{" "}
          <em className="font-serif not-italic font-normal text-gradient">приносит клиентов</em>, а
          не просто «красиво».
        </h1>

        {/* Подзаголовок */}
        <p data-hero className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
          Вы рассказываете по-человечески — «хочу, чтобы клиенты записывались сами», «хочу продавать
          через интернет». Я делаю, запускаю и учу ваших сотрудников пользоваться.
        </p>

        {/* Бейдж-гарантия */}
        <div
          data-hero
          className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-ink-soft backdrop-blur-md"
        >
          <BadgeCheck size={18} className="shrink-0 text-mint" aria-hidden />
          Смету согласуем заранее, платите по частям за готовые этапы
        </div>

        {/* Кнопки */}
        <div data-hero className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.3}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc px-8 py-4 text-base font-semibold text-white transition hover:shadow-[0_0_32px_rgba(109,106,246,0.5)] hover:brightness-110"
            >
              Обсудить задачу
              <ArrowUpRight size={18} aria-hidden />
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href="#estimator"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-medium text-ink backdrop-blur-md transition hover:border-violet-acc/50 hover:bg-white/[0.08]"
            >
              Сколько это стоит
            </a>
          </Magnetic>
        </div>

        {/* Статистика */}
        <div
          data-hero
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 md:grid-cols-4"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <CountUp
                value={stat.value}
                prefix={"prefix" in stat ? stat.prefix : ""}
                suffix={stat.suffix}
                className="text-4xl font-bold tracking-tight text-ink md:text-5xl"
              />
              <p className="mt-2 text-sm text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Подсказка «листайте» */}
      <div className="absolute bottom-8 right-8 hidden items-center gap-3 md:flex" aria-hidden>
        <span className="mono-label">Листайте</span>
        <ArrowDown size={16} className="animate-bounce text-violet-acc" />
      </div>
    </section>
  );
}
