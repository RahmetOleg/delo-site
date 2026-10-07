"use client";

/**
 * (07) — Вопросы: аккордеон FAQ.
 * Раскрытие через grid-rows-[0fr → 1fr] (как в Services) — плавно и без JS-измерений.
 */
import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "@/components/fx/Reveal";
import { SectionHead } from "@/components/sections/shared";
import { FAQ } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="relative py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="mx-auto max-w-3xl">
          <SectionHead
            num="07"
            label="— Вопросы"
            className="mx-auto text-center"
            title={
              <>
                Спрашивают{" "}
                <em className="font-serif not-italic font-normal text-gradient">перед стартом</em>
              </>
            }
          />

          <Reveal className="mt-12">
            <div>
              {FAQ.map((item, i) => {
                const open = openIdx === i;
                return (
                  <div
                    key={item.q}
                    className={cn("border-t border-white/10", i === FAQ.length - 1 && "border-b border-white/10")}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-acc"
                    >
                      <span className="text-lg font-bold text-ink md:text-xl">{item.q}</span>
                      <Plus
                        size={20}
                        className={cn(
                          "shrink-0 transition-transform duration-500",
                          open ? "rotate-45 text-violet-acc" : "text-ink-muted"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
