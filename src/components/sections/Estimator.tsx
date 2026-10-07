"use client";

/**
 * (05) — Стоимость: интерактивный калькулятор-смета.
 * Слева — четыре блока опций, справа — «чек» со «живой» суммой (GSAP-твин цифры).
 * Слушает "delo:estimate" от BizSelector (подставляет тип проекта),
 * шлёт "delo:prefill" в Contact и скроллит к форме заявки.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import Reveal from "@/components/fx/Reveal";
import { SectionHead, GradientButton, GhostButton } from "@/components/sections/shared";
import { EST_TYPES, EST_DESIGNS, EST_EXTRAS, EST_SPEED, fmtRub } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ---------- Блок опций ---------- */
function OptionBlock({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <p className="mono-label">
        <span className="text-violet-acc">{num}</span> · {title}
      </p>
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
}

/* ---------- Строка опции (радио или чекбокс) ---------- */
function OptionRow({
  name,
  hint,
  price,
  selected,
  multi = false,
  groupName,
  onSelect,
}: {
  name: string;
  hint: string;
  price: string;
  selected: boolean;
  multi?: boolean;
  groupName: string;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all duration-300",
        "has-[:focus-visible]:border-violet-acc/60",
        selected ? "border-violet-acc/60 bg-violet-acc/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/25"
      )}
    >
      <input
        type={multi ? "checkbox" : "radio"}
        name={groupName}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
        aria-label={name}
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-violet-acc bg-gradient-to-br from-violet-acc to-indigo-acc" : "border-white/25"
        )}
      >
        {selected ? <Check size={12} strokeWidth={3.5} className="text-white" /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-ink">{name}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">{hint}</span>
      </span>
      <span
        className={cn(
          "ml-auto font-mono text-sm font-semibold whitespace-nowrap",
          selected ? "text-violet-acc" : "text-ink-soft"
        )}
      >
        {price}
      </span>
    </label>
  );
}

/* ---------- Строка «чека» ---------- */
function CheckRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-ink-soft">{label}</span>
      <span
        className={cn(
          "font-mono whitespace-nowrap",
          strong ? "font-semibold text-ink" : value === "включено" ? "text-ink-muted" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function Estimator() {
  /* ---------- Состояние ---------- */
  const [typeId, setTypeId] = useState("corp");
  const [designId, setDesignId] = useState("template");
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [speedId, setSpeedId] = useState("calm");
  const [meta, setMeta] = useState<{ num: string; date: string }>({ num: "", date: "" });

  const type = EST_TYPES.find((t) => t.id === typeId) ?? EST_TYPES[1];
  const design = EST_DESIGNS.find((d) => d.id === designId) ?? EST_DESIGNS[0];
  const selectedExtras = EST_EXTRAS.filter((x) => extraIds.includes(x.id));
  const isRush = speedId === "rush";

  /* ---------- Логика сметы ---------- */
  const extrasSum = selectedExtras.reduce((s, x) => s + x.price, 0);
  const baseTotal = type.price + design.price + extrasSum;
  const surge = isRush ? Math.round(baseTotal * 0.25) : 0;
  const total = baseTotal + surge;
  const weeks = isRush ? Math.max(1, Math.round(type.weeks * 0.7)) : type.weeks;
  const pre = Math.round((total * 0.3) / 100) * 100;
  const rest = total - pre;

  const toggleExtra = (id: string) =>
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  /* ---------- Номер и дата сметы — только на клиенте (без hydration mismatch) ---------- */
  useEffect(() => {
    // Синхронный setState в теле эффекта запрещён линтом — откладываем на микротаск
    const t = setTimeout(() => {
      setMeta({
        num: `${Math.floor(Math.random() * 900) + 100}-Д`,
        date: `от ${new Date().toLocaleDateString("ru-RU")}`,
      });
    }, 0);
    return () => clearTimeout(t);
  }, []);

  /* ---------- BizSelector может выбрать тип проекта (CustomEvent "delo:estimate") ---------- */
  useEffect(() => {
    const onEstimate = (e: Event) => {
      const t = (e as CustomEvent<string>).detail;
      if (t && EST_TYPES.some((x) => x.id === t)) setTypeId(t);
    };
    window.addEventListener("delo:estimate", onEstimate);
    return () => window.removeEventListener("delo:estimate", onEstimate);
  }, []);

  /* ---------- GSAP-твин итоговой суммы ---------- */
  const totalRef = useRef<HTMLSpanElement>(null);
  const prevTotal = useRef(total);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = totalRef.current;
    if (!el) return;
    if (reduced) {
      el.textContent = fmtRub(total);
      prevTotal.current = total;
      return;
    }
    const obj = { n: prevTotal.current };
    const tween = gsap.to(obj, {
      n: total,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = fmtRub(Math.round(obj.n));
      },
    });
    prevTotal.current = total;
    return () => {
      tween.kill();
    };
  }, [total, reduced]);

  /* ---------- Действия ---------- */
  const estimateSummary = `Смета № ${meta.num || "—"} · Итого ${fmtRub(total)} · Тип: ${type.name} · Срок ≈ ${weeks} нед.`;

  const discuss = () => {
    window.dispatchEvent(
      new CustomEvent("delo:prefill", { detail: { estimate: estimateSummary }, bubbles: true })
    );
    // Lenis перехватывает скролл — используем событие SmoothScroll
    window.dispatchEvent(new CustomEvent("delo:scrollto", { detail: "#contact", bubbles: true }));
  };

  const copyEstimate = () => {
    const lines = [
      `Смета № ${meta.num || "—"} ${meta.date}`,
      `${type.name} — ${fmtRub(type.price)}`,
      `Внешний вид — ${design.name.toLowerCase()} — ${design.price === 0 ? "включено" : fmtRub(design.price)}`,
      ...selectedExtras.map((x) => `${x.name} — ${fmtRub(x.price)}`),
      ...(isRush ? [`Срочно — работа в приоритете — ${fmtRub(surge)}`] : []),
      `Когда заработает: ≈ ${weeks} нед.`,
      `Предоплата сейчас (30%): ${fmtRub(pre)}`,
      `Остаток — по готовности: ${fmtRub(rest)}`,
      `Итого: ${fmtRub(total)}`,
    ].join("\n");
    try {
      navigator.clipboard
        .writeText(lines)
        .then(() => toast.success("Смета скопирована — вставьте в чат или письмо"))
        .catch(() => toast.error("Не удалось скопировать — попробуйте ещё раз"));
    } catch {
      toast.error("Не удалось скопировать — попробуйте ещё раз");
    }
  };

  return (
    <section id="estimator" className="relative py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <SectionHead
          num="05"
          label="— Стоимость"
          title={
            <>
              Сколько это стоит?{" "}
              <em className="font-serif not-italic font-normal text-gradient">Прикиньте за 30 секунд</em>
            </>
          }
          lead="Выберите, что подходит, — сумма посчитается сама. Это прикидка: после короткого разговора пришлю точную сумму без сюрпризов."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* ---------- Опции ---------- */}
          <div className="space-y-6">
            <Reveal>
              <OptionBlock num="01" title="Что делаем">
                {EST_TYPES.map((t) => (
                  <OptionRow
                    key={t.id}
                    groupName="est-type"
                    name={t.name}
                    hint={t.hint}
                    price={fmtRub(t.price)}
                    selected={typeId === t.id}
                    onSelect={() => setTypeId(t.id)}
                  />
                ))}
              </OptionBlock>
            </Reveal>

            <Reveal delay={0.06}>
              <OptionBlock num="02" title="Внешний вид">
                {EST_DESIGNS.map((d) => (
                  <OptionRow
                    key={d.id}
                    groupName="est-design"
                    name={d.name}
                    hint={d.hint}
                    price={d.price === 0 ? "0 ₽" : `+ ${fmtRub(d.price)}`}
                    selected={designId === d.id}
                    onSelect={() => setDesignId(d.id)}
                  />
                ))}
              </OptionBlock>
            </Reveal>

            <Reveal delay={0.12}>
              <OptionBlock num="03" title="Дополнительно">
                {EST_EXTRAS.map((x) => (
                  <OptionRow
                    key={x.id}
                    groupName="est-extra"
                    multi
                    name={x.name}
                    hint={x.hint}
                    price={`+ ${fmtRub(x.price)}`}
                    selected={extraIds.includes(x.id)}
                    onSelect={() => toggleExtra(x.id)}
                  />
                ))}
              </OptionBlock>
            </Reveal>

            <Reveal delay={0.18}>
              <OptionBlock num="04" title="Когда нужен">
                {EST_SPEED.map((s) => (
                  <OptionRow
                    key={s.id}
                    groupName="est-speed"
                    name={s.name}
                    hint={s.hint}
                    price={s.id === "rush" ? "×1,25" : "×1,0"}
                    selected={speedId === s.id}
                    onSelect={() => setSpeedId(s.id)}
                  />
                ))}
              </OptionBlock>
            </Reveal>
          </div>

          {/* ---------- Чек ---------- */}
          <Reveal delay={0.15}>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 right-0 h-44 w-44 rounded-full bg-indigo-acc/10 blur-[80px]"
              />
              <div className="relative rounded-3xl border border-white/10 bg-[#101017]/90 p-6 backdrop-blur-xl md:p-8 lg:sticky lg:top-24">
                {/* Шапка */}
                <div className="flex items-start justify-between gap-4">
                  <p className="mono-label">Без умных слов</p>
                  {meta.num ? (
                    <div className="text-right font-mono text-xs leading-relaxed text-ink-muted">
                      <div>Смета № {meta.num}</div>
                      <div>{meta.date}</div>
                    </div>
                  ) : null}
                </div>

                {/* Позиции */}
                <div className="mt-6 space-y-3">
                  <CheckRow label={type.name} value={fmtRub(type.price)} />
                  <CheckRow
                    label={`Внешний вид — ${design.name.toLowerCase()}`}
                    value={design.price === 0 ? "включено" : fmtRub(design.price)}
                  />
                  {selectedExtras.map((x) => (
                    <CheckRow key={x.id} label={x.name} value={fmtRub(x.price)} />
                  ))}
                  {isRush ? <CheckRow label="Срочно — работа в приоритете" value={fmtRub(surge)} /> : null}
                </div>

                <div className="hairline my-5" aria-hidden />

                {/* Срок и оплата */}
                <div className="space-y-3">
                  <CheckRow label="Когда заработает" value={`≈ ${weeks} нед.`} strong />
                  <CheckRow label="Предоплата сейчас (30%)" value={fmtRub(pre)} />
                  <CheckRow label="Остаток — по готовности" value={fmtRub(rest)} />
                </div>

                {/* Итого */}
                <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
                  <span className="mono-label">Итого</span>
                  <span
                    ref={totalRef}
                    className="text-gradient text-4xl font-extrabold tracking-tight tabular-nums"
                  >
                    {fmtRub(total)}
                  </span>
                </div>

                {/* Действия */}
                <GradientButton onClick={discuss} className="mt-7 w-full">
                  Обсудить эту сумму
                </GradientButton>
                <GhostButton onClick={copyEstimate} className="mt-3 w-full text-sm sm:text-[15px]">
                  Скопировать текстом — отправить себе
                </GhostButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
