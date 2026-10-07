"use client";

/**
 * Cursor — кастомный курсор с инерцией.
 * Точка следует мгновенно, кольцо «догоняет» с lerp — создаётся ощущение живой инерции.
 * Только для устройств с точным указателем; при reduced-motion не включается.
 */
import { useEffect, useRef } from "react";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/motion";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const fine = useHasFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("has-cursor"); // скрывает системный курсор через CSS

    let mx = -100, my = -100; // позиция мыши
    let rx = -100, ry = -100; // позиция кольца (с инерцией)
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Кольцо увеличивается над интерактивными элементами
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, label, input, textarea, select, [data-cursor='hover']");
      const pressed = t.closest("input, textarea");
      ring.classList.toggle("cursor-grow", !!interactive);
      ring.classList.toggle("cursor-press", !!pressed);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <>
      {/* Точка — следует мгновенно */}
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      {/* Кольцо — движется с инерцией */}
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[200] flex h-9 w-9 items-center justify-center rounded-full border border-white/70 mix-blend-difference transition-[width,height,border-color,background-color] duration-300"
      />
    </>
  );
}
