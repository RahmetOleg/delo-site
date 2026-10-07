"use client";

/**
 * Header — фиксированная шапка студии «ДЕЛО»:
 * - после 30px скролла внутренний блок получает «стекло»: рамка, blur, тень;
 * - тонкая градиентная линия внизу — прогресс прокрутки (обновляется через ref, без ре-рендеров);
 * - полноэкранное мобильное меню (opacity + translate-y), блокирует скролл body.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Magnetic from "@/components/fx/Magnetic";
import { CONTACTS } from "@/lib/content";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#biz", label: "Что вы получите" },
  { href: "#services", label: "Услуги" },
  { href: "#estimator", label: "Стоимость" },
  { href: "#contact", label: "Контакты" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  /* Скролл: состояние «стекла» + ширина прогресс-линии (ref, без state) */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      const bar = progressRef.current;
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      }
    };

    onScroll(); // начальное состояние (открытие страницы уже прокрученной)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Открытое меню блокирует скролл страницы */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Esc закрывает меню */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100]">
        <div
          className={cn(
            "mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-3.5 transition-all duration-500 md:px-8",
            scrolled &&
              "mt-3 rounded-2xl border border-white/10 bg-[#0A0A0F]/70 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          )}
        >
          {/* Логотип */}
          <a href="#top" className="flex items-center gap-3" aria-label="ДЕЛО — на главную">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-acc via-indigo-acc to-blue-acc font-semibold text-white shadow-[0_0_18px_rgba(109,106,246,0.35)]">
              Д
            </span>
            <span className="leading-tight">
              <span className="block font-bold tracking-wide text-ink">ДЕЛО</span>
              <span className="mono-label hidden sm:block">сайты и приложения</span>
            </span>
          </a>

          {/* Навигация + действия */}
          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm text-ink-soft transition hover:bg-white/[0.06] hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Magnetic strength={0.3}>
              <a
                href="#contact"
                className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-[0_0_24px_rgba(109,106,246,0.45)] sm:inline-flex"
              >
                Обсудить задачу
                <ArrowUpRight size={16} aria-hidden />
              </a>
            </Magnetic>

            {/* Бургер (мобильный) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-ink backdrop-blur-md transition hover:bg-white/[0.08] lg:hidden"
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Прогресс прокрутки — линия 2px внизу шапки */}
        <div
          ref={progressRef}
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] w-0 origin-left bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc"
        />
      </header>

      {/* Полноэкранное мобильное меню */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[99] flex flex-col bg-[#0A0A0F]/95 backdrop-blur-2xl transition-[opacity,transform,visibility] duration-500 lg:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-6 opacity-0"
        )}
      >
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between overflow-y-auto px-5 pb-10 pt-24 md:px-8">
          <nav className="flex flex-col gap-1" aria-label="Мобильная навигация">
            {NAV_LINKS.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-baseline gap-4 rounded-2xl px-3 py-3 transition hover:bg-white/[0.05]"
              >
                <span className="mono-label text-violet-acc">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-4xl font-bold tracking-tight text-ink transition group-hover:text-white">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-10 space-y-5">
            <div className="flex flex-col gap-2 text-sm text-ink-soft">
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-fit transition hover:text-ink"
              >
                Telegram — {CONTACTS.telegramLabel}
              </a>
              <a href={`mailto:${CONTACTS.email}`} className="w-fit transition hover:text-ink">
                {CONTACTS.email}
              </a>
              <a href={CONTACTS.phoneHref} className="w-fit transition hover:text-ink">
                {CONTACTS.phone}
              </a>
            </div>

            <a
              href="#contact"
              onClick={closeMenu}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc px-6 py-4 font-semibold text-white transition hover:shadow-[0_0_24px_rgba(109,106,246,0.45)] sm:w-auto"
            >
              Обсудить задачу
              <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
