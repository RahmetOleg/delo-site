"use client";

/**
 * Общие элементы секций — чтобы весь сайт выглядел единообразно.
 * SectionHead: моно-нумерация + крупный заголовок с serif-акцентами.
 * GradientButton / GhostButton: фирменные кнопки (магнитность добавляет <Magnetic>).
 */
import type { ReactNode } from "react";
import Reveal from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

export function SectionHead({
  num,
  label,
  title,
  lead,
  className,
}: {
  num: string;
  label: string;
  /** ReactNode — можно вставлять <em> для serif-акцентов */
  title: ReactNode;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Reveal>
        <p className="mono-label flex items-center gap-3">
          <span className="text-violet-acc">({num})</span>
          <span className="hairline w-10" aria-hidden />
          {label}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Основная кнопка — градиентная пилюля со свечением */
export function GradientButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-300",
        "hover:shadow-[0_0_28px_rgba(109,106,246,0.45)] hover:brightness-110 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-acc",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Второстепенная кнопка — стеклянная пилюля */
export function GhostButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-[15px] font-medium text-ink backdrop-blur-md transition-all duration-300",
        "hover:border-violet-acc/50 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-acc",
        className
      )}
    >
      {children}
    </button>
  );
}
