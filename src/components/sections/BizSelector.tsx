"use client";

/**
 * BizSelector — «Какой у вас бизнес?»: табы типа бизнеса + панель результата.
 * Слева — цитата-«хотение» и список функций, справа — карточка кейса (TiltCard)
 * с ценой/сроком и кнопкой, которая диспатчит "delo:estimate" для калькулятора.
 */
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  Send,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { SectionHead } from "@/components/sections/shared";
import { BIZ_TABS, CONTACTS, type BizOption } from "@/lib/content";
import { cn } from "@/lib/utils";

const UNKNOWN_CHIPS = ["Бесплатно", "30 минут", "Без обязательств"] as const;

export default function BizSelector() {
  const [activeId, setActiveId] = useState("service");
  const active = BIZ_TABS.find((tab) => tab.id === activeId) ?? BIZ_TABS[0];

  /* Выбор типа проекта → пересчёт калькулятора (слушатель в секции сметы) + скролл к смете */
  const chooseEstimateType = (option: BizOption) => {
    window.dispatchEvent(
      new CustomEvent("delo:estimate", { detail: option.estType, bubbles: true })
    );
    // Lenis перехватывает скролл — используем событие SmoothScroll
    window.dispatchEvent(new CustomEvent("delo:scrollto", { detail: "#estimator", bubbles: true }));
    toast.success("Тип проекта выбран — сумма пересчитана");
  };

  return (
    <section id="biz" className="relative py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10 lg:px-14">
        <SectionHead
          num="01"
          label="— С чего начать"
          title={
            <>
              Какой у вас бизнес?{" "}
              <em className="font-serif not-italic font-normal text-gradient">
                Выберите — покажу
              </em>
              , что получите
            </>
          }
          lead="Разбираться в сайтах не нужно — это моя работа. Выберите, чем занимаетесь, и увидите конкретные функции, цену и срок."
        />

        {/* Табы типа бизнеса */}
        <Reveal delay={0.1} className="mt-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Тип бизнеса">
            {BIZ_TABS.map((tab, i) => {
              const isActive = tab.id === active.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all duration-300",
                    isActive
                      ? "border-violet-acc/60 bg-violet-acc/[0.08] shadow-[0_0_24px_rgba(109,106,246,0.18)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                  )}
                >
                  <span className="font-mono text-xs text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-[15px] font-semibold leading-snug text-ink">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Панель результата — анимированная смена по key={active.id} */}
        <Reveal delay={0.15}>
          <div
            key={active.id}
            className="mt-6 grid animate-in fade-in slide-in-from-bottom-4 gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md duration-500 md:p-8 lg:grid-cols-[1.4fr_1fr]"
          >
            {/* Левая колонка: «хотение» + функции */}
            <div>
              <p className="text-xl font-medium leading-relaxed text-ink md:text-2xl">
                {active.want}
              </p>
              <ul className="mt-8 space-y-5">
                {active.functions.map((fn) => (
                  <li key={fn.title} className="flex gap-4">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-mint" aria-hidden />
                    <div>
                      <b className="font-semibold text-ink">{fn.title}</b>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {fn.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Правая колонка: кейс + смета (или «как связаться» для unknown) */}
            <aside>
              {"unknown" in active ? (
                /* — Вариант «Пока не знаю»: без изображения — приглашение на созвон — */
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#101017] p-6">
                  <p className="font-bold text-ink">Как связаться</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {UNKNOWN_CHIPS.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-ink-soft"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc px-6 py-3.5 font-semibold text-white transition hover:shadow-[0_0_24px_rgba(109,106,246,0.45)]"
                  >
                    Записаться на созвон
                    <ArrowUpRight size={16} aria-hidden />
                  </a>

                  <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                    <a
                      href={CONTACTS.phoneHref}
                      className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
                    >
                      <Phone size={14} aria-hidden />
                      {CONTACTS.phone}
                    </a>
                    <span className="hidden text-ink-muted sm:inline" aria-hidden>
                      ·
                    </span>
                    <a
                      href={CONTACTS.telegram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
                    >
                      <Send size={14} aria-hidden />
                      Telegram
                    </a>
                  </div>
                </div>
              ) : (
                /* — Обычные варианты: карточка кейса с ценой и сроком — */
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#101017] p-6">
                    <img
                      src={active.img}
                      alt={active.caseName}
                      className="h-44 w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                    <p className="mt-5 font-bold text-ink">{active.caseName}</p>
                    <p className="mt-1 text-sm text-ink-muted">{active.caseSub}</p>
                    <p className="mt-3 inline-flex items-center gap-2 self-start rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-sm font-medium text-mint">
                      <TrendingUp size={14} aria-hidden />
                      {active.caseRes}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gradient-to-r from-violet-acc to-indigo-acc px-3.5 py-1.5 text-xs font-semibold text-white">
                        {active.price}
                      </span>
                      <span className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-ink-soft">
                        ≈ {active.time}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => chooseEstimateType(active)}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc px-6 py-3.5 font-semibold text-white transition hover:shadow-[0_0_24px_rgba(109,106,246,0.45)]"
                    >
                      Прикинуть стоимость
                      <ArrowRight size={16} aria-hidden />
                    </button>
                    <a
                      href="#contact"
                      className="mt-4 flex items-center justify-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
                    >
                      Или сразу обсудить задачу
                      <ArrowUpRight size={14} aria-hidden />
                    </a>
                  </div>
                </TiltCard>
              )}
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
