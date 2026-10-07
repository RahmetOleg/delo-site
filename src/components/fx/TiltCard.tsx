"use client";

/**
 * TiltCard — карточка с 3D-наклоном за курсором (perspective + preserve-3d)
 * и бликом-«прожектором», который следует за мышью.
 * Наклон мягкий (макс ~7°), чтобы оставаться премиальным, а не игрушечным.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Максимальный угол наклона, град */
  intensity?: number;
}

export default function TiltCard({ children, className, intensity = 7 }: TiltCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const fine = useHasFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!wrap || !card || !glare || !fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * intensity;
      const ry = (px - 0.5) * intensity;

      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        transformOrigin: "center",
        duration: 0.5,
        ease: "power2.out",
      });
      // Блик: позиция прожектора через CSS-переменные
      glare.style.setProperty("--gx", `${px * 100}%`);
      glare.style.setProperty("--gy", `${py * 100}%`);
      gsap.to(glare, { opacity: 1, duration: 0.4, overwrite: "auto" });
    };

    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
      gsap.to(glare, { opacity: 0, duration: 0.5, overwrite: "auto" });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([card, glare]);
    };
  }, [fine, reduced, intensity]);

  return (
    <div ref={wrapRef} className={cn("relative [perspective:900px]", className)}>
      <div ref={cardRef} className="relative h-full w-full [transform-style:preserve-3d]">
        {/* Блик-прожектор следует за курсором */}
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0"
          style={{
            background:
              "radial-gradient(440px circle at var(--gx,50%) var(--gy,50%), rgba(167,139,250,0.13), transparent 65%)",
          }}
        />
        {children}
      </div>
    </div>
  );
}
