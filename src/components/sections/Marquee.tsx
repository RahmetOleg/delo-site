"use client";

/**
 * Marquee — бесшовная бегущая строка преимуществ.
 * РОВНО два одинаковых набора элементов → анимация translateX(-50%) закольцована без шва.
 * Пауза на hover; при prefers-reduced-motion глобальный CSS глушит анимацию.
 */
import { Fragment } from "react";
import { MARQUEE_ITEMS } from "@/lib/content";

export default function Marquee() {
  return (
    <div
      className="relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-5"
      role="marquee"
      aria-label="Что вы получаете"
    >
      {/* Маскирующие градиенты по краям */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0A0A0F] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0A0A0F] to-transparent"
      />

      {/* Лента: 2 × MARQUEE_ITEMS для бесшовности */}
      <div className="flex w-max animate-marquee gap-0 [animation-play-state:running] hover:[animation-play-state:paused]">
        {[0, 1].map((set) => (
          <Fragment key={set}>
            {MARQUEE_ITEMS.map((item, i) => (
              <Fragment key={item}>
                <span
                  aria-hidden={set === 1}
                  className={
                    (i % 2 ? "text-ink-muted" : "text-ink") +
                    " whitespace-nowrap px-8 text-lg font-medium md:text-xl"
                  }
                >
                  {item}
                </span>
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-violet-acc/70"
                />
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
