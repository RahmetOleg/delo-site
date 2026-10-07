"use client";

import { useSyncExternalStore } from "react";

/**
 * Хуки на media queries через useSyncExternalStore —
 * идиоматичный React-способ подписки на внешнее состояние без cascading renders.
 */

function subscribe(query: string) {
  return (onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
}

function getSnapshot(query: string) {
  return () => window.matchMedia(query).matches;
}

/** Системная настройка prefers-reduced-motion: отключаем «тяжёлые» эффекты */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe("(prefers-reduced-motion: reduce)"),
    getSnapshot("(prefers-reduced-motion: reduce)"),
    () => false // SSR: считаем, что анимации разрешены
  );
}

/** Есть ли точный указатель (мышь/трекпад) — для курсора и магнитных эффектов */
export function useHasFinePointer(): boolean {
  return useSyncExternalStore(
    subscribe("(pointer: fine)"),
    getSnapshot("(pointer: fine)"),
    () => false
  );
}
