"use client";

/**
 * Единая точка доступа к GSAP + ScrollTrigger.
 * Все компоненты импортируют отсюда — плагин регистрируется один раз.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
