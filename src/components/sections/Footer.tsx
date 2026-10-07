"use client";

/**
 * Футер: логотип, навигация, связь, копирайт.
 * Sticky-footer обеспечивает родитель (min-h-screen flex flex-col) — здесь только mt-auto.
 */
import { ArrowUp, ArrowUpRight, Download } from "lucide-react";
import { CONTACTS } from "@/lib/content";

const NAV = [
  { href: "#biz", label: "Что вы получите" },
  { href: "#services", label: "Услуги" },
  { href: "#estimator", label: "Стоимость" },
  { href: "#contact", label: "Контакты" },
] as const;

const LINKS = [
  { label: `Telegram · ${CONTACTS.telegramLabel}`, href: CONTACTS.telegram, external: true },
  { label: CONTACTS.email, href: `mailto:${CONTACTS.email}`, external: false },
  { label: CONTACTS.phone, href: CONTACTS.phoneHref, external: false },
] as const;

const linkCls =
  "block py-1.5 text-sm text-ink-soft transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-acc";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-[#0B0B11]/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-12 md:px-10">
        {/* ---------- Верх ---------- */}
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Логотип + описание */}
          <div>
            <a href="#top" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-acc via-indigo-acc to-blue-acc text-lg font-extrabold text-white shadow-[0_0_24px_rgba(109,106,246,0.35)]">
                Д
              </span>
              <span>
                <span className="block text-lg font-extrabold tracking-tight text-ink">ДЕЛО</span>
                <span className="mono-label block leading-none">сайты и приложения</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-ink-soft">
              Сайты и приложения, которые приносят клиентов. По-человечески, оплата по частям, в срок.
            </p>
          </div>

          {/* Навигация */}
          <nav aria-label="Навигация по сайту">
            <p className="mono-label">Навигация</p>
            <div className="mt-3">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className={linkCls}>
                  {n.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Связь */}
          <div>
            <p className="mono-label">Связь</p>
            <div className="mt-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className={linkCls}
                >
                  {l.label} <ArrowUpRight size={12} className="inline align-[-1px] text-ink-muted" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Низ ---------- */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-ink-muted">© 2025 Студия «ДЕЛО» · Екатеринбург</p>
          <div className="flex flex-wrap items-center gap-3">
            {/* Кнопка скачивания исходников сайта (архив отдаётся из public/) */}
            <a
              href="/delo-site.zip"
              download="delo-site.zip"
              title="Скачать исходники сайта одним архивом"
              className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-ink-soft transition duration-300 hover:border-violet-acc/40 hover:bg-white/[0.07] hover:text-ink hover:shadow-[0_0_24px_rgba(109,106,246,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-acc"
            >
              <Download size={16} className="text-violet-acc" />
              Скачать сайт
              <span className="mono-label text-[10px]">zip</span>
            </a>
            <a
              href="#top"
              className="inline-flex h-11 items-center gap-2 px-2 text-sm text-ink-soft transition hover:text-ink"
            >
              Наверх <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
