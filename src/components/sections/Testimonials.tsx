"use client";

/**
 * (06) — Отзывы: карусель цитат на TiltCard (3D-наклон + блик).
 * Переключение циклическое, смена карточки — fade+slide (tw-animate-css).
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { SectionHead } from "@/components/sections/shared";
import { TESTIMONIALS } from "@/lib/content";
import { cn } from "@/lib/utils";

const navBtn =
  "flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-ink transition duration-300 " +
  "hover:border-violet-acc/60 hover:bg-violet-acc/10 hover:shadow-[0_0_20px_rgba(167,139,250,0.25)] active:scale-95 " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-acc";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const len = TESTIMONIALS.length;
  const t = TESTIMONIALS[idx];

  const prev = () => setIdx((i) => (i - 1 + len) % len);
  const next = () => setIdx((i) => (i + 1) % len);

  return (
    <section id="testimonials" className="relative py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <SectionHead
          num="06"
          label="— Отзывы"
          title={
            <>
              Не верьте мне — <em className="font-serif not-italic font-normal text-gradient">верьте им</em>
            </>
          }
        />

        <Reveal className="mt-14">
          <TiltCard>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md md:p-12">
              {/* Большая декоративная кавычка */}
              <span
                aria-hidden
                className="absolute top-4 right-8 font-serif text-[120px] leading-none text-violet-acc/15 select-none"
              >
                »
              </span>

              {/* Цитата + автор (пересоздаются при смене — даёт анимацию входа) */}
              <div key={idx} className="relative animate-in fade-in slide-in-from-bottom-2 duration-500">
                <blockquote className="text-xl leading-relaxed font-medium text-ink md:text-2xl">
                  «{t.q}»
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-acc/30 to-indigo-acc/30 font-bold text-ink">
                    {t.a.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-ink">{t.a}</div>
                    <div className="text-sm text-ink-muted">{t.r}</div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 flex items-center justify-between">
            <span className="font-mono text-sm text-ink-muted">
              {idx + 1} / {len}
            </span>
            <div className="flex gap-3">
              <button type="button" aria-label="Предыдущий отзыв" onClick={prev} className={navBtn}>
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Следующий отзыв"
                onClick={next}
                className={cn(navBtn, "ml-0")}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
