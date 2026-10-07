"use client";

/**
 * Секция «03 — Услуги».
 * Аккордеон: шапка-строка с ценой/сроком, раскрытие через grid-rows-[0fr→1fr],
 * внутри — описание, «punch»-строка, фичи и CTA в смету/контакт.
 */
import { useState } from "react";
import { ArrowRight, Check, Plus, Sparkles } from "lucide-react";
import Reveal from "@/components/fx/Reveal";
import { SectionHead } from "@/components/sections/shared";
import { SERVICES } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function Services() {
  // Первая услуга открыта по умолчанию
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="services" className="relative py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <SectionHead
          num="03"
          label="— Услуги"
          title={
            <>
              Что я делаю{" "}
              <em className="font-serif not-italic font-normal text-gradient">
                и что это даёт вам
              </em>
            </>
          }
          lead="Нажмите на строку — покажу, что именно вы получите и когда. Цены честные, без «звёздочек»."
        />

        <div className="mt-12 space-y-4">
          {SERVICES.map((service, i) => {
            const open = openIndex === i;
            const ctaHref = service.cta === "Обсудить формат" ? "#contact" : "#estimator";

            return (
              <Reveal key={service.num} delay={i * 0.05}>
                <div
                  className={cn(
                    "rounded-3xl border transition-all duration-500",
                    open
                      ? "border-violet-acc/40 bg-white/[0.05] shadow-[0_0_40px_rgba(109,106,246,0.1)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  )}
                >
                  {/* Шапка строки-аккордеона */}
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`services-panel-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full cursor-pointer items-center gap-5 p-6 text-left md:p-7"
                  >
                    <span className="shrink-0 font-mono text-sm text-violet-acc">
                      {service.num}
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-bold leading-tight text-ink md:text-2xl">
                        {service.title}
                      </span>
                      <span className="mt-1 block font-mono text-sm text-ink-muted">
                        {service.meta}
                      </span>
                    </span>
                    <Plus
                      size={18}
                      aria-hidden
                      className={cn(
                        "shrink-0 rounded-full border border-white/15 p-2.5 transition-transform duration-500",
                        open ? "rotate-45 text-violet-acc" : "text-ink-soft"
                      )}
                    />
                  </button>

                  {/* Раскрывающийся контент (grid-rows анимация) */}
                  <div
                    id={`services-panel-${i}`}
                    aria-hidden={!open}
                    inert={!open}
                    className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-7 md:px-7">
                        <p className="max-w-3xl leading-relaxed text-ink-soft">{service.desc}</p>

                        <p className="mt-4 flex items-center gap-2 font-medium text-ink">
                          <Sparkles size={16} className="text-violet-acc" aria-hidden />
                          {service.punch}
                        </p>

                        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2.5 text-sm text-ink-soft"
                            >
                              <Check size={15} className="shrink-0 text-mint" aria-hidden />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                          <p className="font-mono text-sm text-ink-muted">{service.footnote}</p>
                          <a
                            href={ctaHref}
                            className="inline-flex items-center gap-2 rounded-full border border-violet-acc/40 bg-violet-acc/10 px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-violet-acc/20 hover:shadow-[0_0_20px_rgba(167,139,250,0.25)]"
                          >
                            {service.cta}
                            <ArrowRight size={15} aria-hidden />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
