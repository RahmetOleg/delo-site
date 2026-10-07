"use client";

/**
 * HomeClient — оркестратор всей страницы.
 * Здесь живёт состояние прелоадера, монтируются FX-слои и все секции.
 * Three.js-фон подключён лениво (dynamic, ssr:false) — отдельный чанк, не блокирует первый рендер.
 */
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import Preloader from "@/components/fx/Preloader";

import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import BizSelector from "@/components/sections/BizSelector";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Estimator from "@/components/sections/Estimator";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

/* Three.js сцена — код-splitting: грузится после первого рендера, SSR отключён */
const SceneBackground = dynamic(() => import("@/components/three/SceneBackground"), { ssr: false });

export default function HomeClient() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  // Помечаем html: JS подключён (для CSS-стратегии will-reveal) + reduced-motion
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("js-ready");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => html.classList.toggle("no-motion", mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      html.classList.remove("js-ready");
      mq.removeEventListener("change", sync);
    };
  }, []);

  // Пока прелоадер активен — блокируем скролл страницы
  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded]);

  return (
    <>
      {/* FX-слои */}
      <SmoothScroll />
      <Cursor />
      <SceneBackground />

      {/* Контент страницы */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Preloader onDone={handleDone} />
        <Header />
        <main className="flex-1">
          <Hero loaded={loaded} />
          <Marquee />
          <BizSelector />
          <About />
          <Services />
          <Process />
          <Estimator />
          <Testimonials />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
