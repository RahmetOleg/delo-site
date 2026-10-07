"use client";

/**
 * Секция «02 — Кто я».
 * Фото-карточка с tilt-эффектом, речь от первого лица,
 * принципы работы и полоса статистики с анимированными счётчиками.
 */
import Reveal, { CountUp } from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { SectionHead } from "@/components/sections/shared";
import { ABOUT_PRINCIPLES, ABOUT_STATS } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-36">
      {/* Декоративное размытое фиолетовое пятно */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-violet-acc/[0.07] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <SectionHead
          num="02"
          label="— Кто я"
          title={
            <>
              Один человек берёт{" "}
              <em className="font-serif not-italic font-normal text-gradient">всё на себя</em>
            </>
          }
          lead="Не агентство с менеджерами и не фрилансер, который пропадает. Один подрядчик от разговора до запуска и поддержки."
        />

        {/* Фото + речь от первого лица */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.25fr]">
          {/* Левая колонка — фото-карточка */}
          <Reveal>
            <TiltCard className="h-full">
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#101017]">
                <img
                  src="/img/portrait.png"
                  alt="Илья — разработчик студии «ДЕЛО»"
                  className="h-full min-h-[420px] w-full object-cover"
                  loading="lazy"
                />
                {/* Градиентная подложка с подписью */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent p-6">
                  <p className="text-lg font-bold text-ink">Илья — студия «ДЕЛО»</p>
                  <p className="mono-label mt-1.5">разработка · дизайн · запуск</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* Правая колонка — заголовок-речь и абзацы */}
          <div>
            <Reveal>
              <h3 className="text-2xl font-bold leading-snug text-ink md:text-3xl">
                Здравствуйте! Я Илья — беру всю{" "}
                <em className="font-serif not-italic text-gradient">технику</em> на себя
              </h3>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 leading-relaxed text-ink-soft">
                Шесть лет я делаю сайты, магазины, программы и приложения для обычного бизнеса:
                клиники, автосервисы, магазины, производства, сети кафе.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 leading-relaxed text-ink-soft">
                Вы рассказываете, чего хотите, своими словами. Я задаю простые вопросы про ваш
                бизнес, предлагаю решение и отвечаю за результат.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-5 leading-relaxed text-ink-soft">
                От вас не требуется понимать, как сайт устроен внутри — так же, как не требуется
                понимать устройство автомобиля, чтобы на нём ездить.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Принципы работы */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.num} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-violet-acc/40 hover:bg-white/[0.05] hover:shadow-[0_0_32px_rgba(109,106,246,0.12)]">
                <p className="font-mono text-sm text-violet-acc">{principle.num}</p>
                <h3 className="mt-4 font-bold text-ink">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{principle.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Полоса статистики */}
        <Reveal>
          <div className="mt-16 grid grid-cols-2 gap-y-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:grid-cols-4 md:p-10">
            {ABOUT_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <CountUp
                  value={stat.value}
                  prefix={"prefix" in stat ? stat.prefix : ""}
                  suffix={stat.suffix}
                  className="text-4xl font-extrabold tracking-tight text-gradient md:text-5xl"
                />
                <p className="mt-2 max-w-[180px] text-center text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
