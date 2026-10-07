"use client";

/**
 * (08) — Заявка: форма «линиями» + прямые контакты + часы Екатеринбурга.
 * Слушает "delo:prefill" от Estimator (CustomEvent с detail.estimate) —
 * показывает бейдж прикидки и отправляет его в POST /api/leads.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Reveal from "@/components/fx/Reveal";
import { SectionHead, GradientButton } from "@/components/sections/shared";
import { CONTACTS, FORM_TASKS, FORM_BUDGETS } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ---------- Стиль «линия» для полей ---------- */
const lineCls = (err?: boolean) =>
  cn(
    "w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-[15px] text-ink outline-none transition",
    "placeholder:text-ink-muted/60 focus:border-violet-acc",
    err ? "border-red-400/70" : "border-white/15"
  );

const labelCls = "mb-2 block font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted";

/* ---------- Прямые контакты ---------- */
const DIRECT = [
  {
    icon: Send,
    label: "Telegram",
    value: CONTACTS.telegramLabel,
    hint: "Отвечаю быстрее всего",
    href: CONTACTS.telegram,
    external: true,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: CONTACTS.email,
    hint: "Для брифов и материалов",
    href: `mailto:${CONTACTS.email}`,
    external: false,
  },
  {
    icon: Phone,
    label: "Телефон",
    value: CONTACTS.phone,
    hint: "Пн–Пт, 10:00–19:00 МСК",
    href: CONTACTS.phoneHref,
    external: false,
  },
] as const;

export default function Contact() {
  /* ---------- Форма ---------- */
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [task, setTask] = useState<string>(FORM_TASKS[0]);
  const [budget, setBudget] = useState<string>(FORM_BUDGETS[0]);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; contact?: boolean; agree?: boolean }>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ---------- Смета из калькулятора ---------- */
  const [estimate, setEstimate] = useState<string | null>(null);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<{ estimate?: string }>).detail;
      if (d?.estimate) setEstimate(d.estimate);
    };
    window.addEventListener("delo:prefill", onPrefill);
    return () => window.removeEventListener("delo:prefill", onPrefill);
  }, []);

  /* ---------- Часы в Екатеринбурге (Asia/Yekaterinburg) ---------- */
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Yekaterinburg",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const active = useMemo(() => {
    const h = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Yekaterinburg" })).getHours();
    return h >= 10 && h < 19;
  }, [time]);

  /* ---------- Сабмит ---------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = {
      name: !name.trim(),
      contact: contact.trim().length < 3,
      agree: !agree,
    };
    setErrors(errs);
    if (errs.name || errs.contact || errs.agree) {
      toast.warning("Заполните имя и контакт для связи");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          task,
          budget,
          message: message.trim(),
          estimate: estimate || null,
        }),
      });
      const data: { ok?: boolean; error?: string } | null = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setSuccess(true);
        toast.success("Заявка отправлена — отвечу в тот же день");
      } else {
        toast.error(data?.error || "Не удалось отправить — напишите в Telegram @delo_studio");
      }
    } catch {
      toast.error("Не удалось отправить — напишите в Telegram @delo_studio");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-36">
      {/* Декоративное свечение */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 right-0 h-[380px] w-[380px] rounded-full bg-indigo-acc/[0.08] blur-[110px]"
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <SectionHead
          num="08"
          label="— Заявка"
          title={
            <>
              Расскажите, чего хотите, —{" "}
              <em className="font-serif not-italic font-normal text-gradient">отвечу быстро</em>
            </>
          }
        />

        {/* Бейдж прикидки из калькулятора */}
        {estimate ? (
          <div className="mt-6 inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-violet-acc/40 bg-violet-acc/10 px-4 py-2 font-mono text-xs break-words text-ink">
            <span className="min-w-0">{estimate}</span>
            <button
              type="button"
              onClick={() => setEstimate(null)}
              aria-label="Убрать смету"
              className="rounded-full p-0.5 text-ink-muted transition hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* ================= ФОРМА ================= */}
          <Reveal>
            {success ? (
              /* ---------- Успех ---------- */
              <div className="rounded-3xl border border-mint/30 bg-mint/[0.06] p-10 text-center">
                <CheckCircle2 size={48} className="mx-auto text-mint" />
                <h3 className="mt-5 text-2xl font-bold text-ink">Заявка принята</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  Отвечу в тот же день (вечером и в выходные — на следующее утро), по-человечески и без
                  анкет. Если задача горит — напишите сразу в Telegram.
                </p>
                <a
                  href={CONTACTS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-acc via-indigo-acc to-blue-acc px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(109,106,246,0.45)] hover:brightness-110 active:scale-[0.98]"
                >
                  Написать в Telegram <ArrowUpRight size={18} />
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelCls}>
                      Ваше имя
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: false }));
                      }}
                      placeholder="Как к вам обращаться"
                      autoComplete="name"
                      className={lineCls(errors.name)}
                    />
                    {errors.name ? <p className="mt-2 font-mono text-xs text-red-400">Укажите имя</p> : null}
                  </div>

                  <div>
                    <label htmlFor="contact-contact" className={labelCls}>
                      Контакт для связи
                    </label>
                    <input
                      id="contact-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        if (errors.contact) setErrors((p) => ({ ...p, contact: false }));
                      }}
                      placeholder="Телефон, e-mail или @ник в Telegram"
                      autoComplete="email"
                      className={lineCls(errors.contact)}
                    />
                    {errors.contact ? (
                      <p className="mt-2 font-mono text-xs text-red-400">Укажите контакт для связи</p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-task" className={labelCls}>
                    Что нужно сделать
                  </label>
                  <div className="relative">
                    <select
                      id="contact-task"
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      className={cn(lineCls(), "appearance-none pr-8 [&>option]:bg-[#14141d] [&>option]:text-ink")}
                    >
                      {FORM_TASKS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-ink-muted"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-budget" className={labelCls}>
                    Ориентир по бюджету
                  </label>
                  <div className="relative">
                    <select
                      id="contact-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className={cn(lineCls(), "appearance-none pr-8 [&>option]:bg-[#14141d] [&>option]:text-ink")}
                    >
                      {FORM_BUDGETS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-ink-muted"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-message" className={labelCls}>
                    Пара слов о задаче (необязательно)
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Например: у нас автосервис, записываем по телефону, хотим онлайн-запись и напоминания"
                    className={cn(lineCls(), "resize-none")}
                  />
                </div>

                {/* Согласие */}
                <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      if (errors.agree) setErrors((p) => ({ ...p, agree: false }));
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                      agree ? "border-violet-acc bg-gradient-to-br from-violet-acc to-indigo-acc" : "border-white/25"
                    )}
                  >
                    {agree ? <Check size={12} strokeWidth={3.5} className="text-white" /> : null}
                  </span>
                  <span>
                    Согласен на обработку персональных данных. Никаких рассылок — только ответ по вашей
                    заявке.
                    {errors.agree ? (
                      <span className="mt-2 block font-mono text-xs text-red-400">
                        Нужно согласие на обработку данных
                      </span>
                    ) : null}
                  </span>
                </label>

                <GradientButton type="submit" disabled={sending} className="mt-8 w-full sm:w-auto">
                  {sending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Отправляю…
                    </>
                  ) : (
                    <>
                      Отправить заявку <ArrowUpRight size={18} />
                    </>
                  )}
                </GradientButton>
              </form>
            )}
          </Reveal>

          {/* ================= ПРЯМЫЕ КОНТАКТЫ ================= */}
          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-8">
              <p className="mono-label">Прямые контакты</p>

              <div className="mt-2">
                {DIRECT.map((row, i) => (
                  <a
                    key={row.label}
                    href={row.href}
                    {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className={cn(
                      "group flex items-center gap-4 pb-5 transition",
                      i < DIRECT.length - 1 && "mb-5 border-b border-white/5"
                    )}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-violet-acc/50 group-hover:bg-violet-acc/10">
                      <row.icon size={18} className="text-ink-soft transition group-hover:text-violet-acc" />
                    </span>
                    <span className="min-w-0">
                      <span className="mono-label block">{row.label}</span>
                      <span className="mt-1 block truncate text-[15px] font-semibold text-ink">
                        {row.value}
                      </span>
                    </span>
                    <span className="ml-auto hidden shrink-0 text-right text-xs text-ink-muted sm:block">
                      {row.hint}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* ---------- Часы ---------- */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="mono-label">Сейчас в Екатеринбурге</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-mono text-3xl text-ink tabular-nums">{time || "--:--"}</span>
                {active ? (
                  <span className="flex items-center gap-2 text-xs whitespace-nowrap text-ink-soft">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-mint" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                    </span>
                    Сейчас на связи
                  </span>
                ) : (
                  <span className="text-xs whitespace-nowrap text-ink-muted">Напишите — отвечу утром</span>
                )}
              </div>
              <p className="mt-2 text-sm text-ink-soft">В рабочее время отвечаю в тот же день</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
