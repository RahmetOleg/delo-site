"use client";

/**
 * SceneBackground — WebGL-фон: шейдерная «аврора» + облако частиц с параллаксом.
 * Оптимизации: DPR ограничен [1,2], пауза рендера на скрытой вкладке,
 * AdaptiveDpr из drei понижает разрешение при просадке FPS,
 * CSS-градиент под канвасом — fallback при отсутствии WebGL.
 * Подключается лениво (dynamic import, ssr:false) — Three.js попадает в отдельный чанк.
 */
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { AURORA_FRAG, AURORA_VERT, PARTICLE_FRAG, PARTICLE_VERT } from "./shaders";

/* ---------- Error boundary: если WebGL недоступен — остаётся CSS-фон ---------- */
class GLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* WebGL не поддерживается — молча используем CSS-fallback */
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ---------- Мышь: нормализованные координаты в ref (без ре-рендеров) ---------- */
function useMouse() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return mouse;
}

/* ---------- Полноэкранный шейдер-градиент ---------- */
function AuroraPlane() {
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const mouse = useMouse();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((_, delta) => {
    /* eslint-disable react-hooks/immutability -- three.js-униформы мутируются каждый кадр: штатный паттерн R3F, объект стабилен */
    uniforms.uTime.value += delta;
    uniforms.uRes.value.set(size.width, size.height);
    // Мышь сглаживается — фон «плывёт» за курсором мягко
    uniforms.uMouse.value.x += (mouse.current.x - uniforms.uMouse.value.x) * 0.04;
    uniforms.uMouse.value.y += (mouse.current.y - uniforms.uMouse.value.y) * 0.04;
    /* eslint-enable react-hooks/immutability */
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ---------- Облако частиц с параллаксом ---------- */
function Particles({ count = 1300 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useMouse();

  const { positions, scales, speeds, mixes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const mixes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = 0.4 + Math.random() * 1.4;
      speeds[i] = 0.15 + Math.random() * 0.5;
      mixes[i] = Math.random();
    }
    return { positions, scales, speeds, mixes };
  }, [count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    /* eslint-disable-next-line react-hooks/immutability -- см. AuroraPlane */
    uniforms.uTime.value += delta;
    const g = group.current;
    if (!g) return;
    // Параллакс: группа чуть поворачивается за мышью (сглаженно)
    const targetY = mouse.current.x * 0.12;
    const targetX = -mouse.current.y * 0.09;
    g.rotation.y += (targetY - g.rotation.y) * 0.03;
    g.rotation.x += (targetX - g.rotation.x) * 0.03;
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aMix" args={[mixes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={PARTICLE_VERT}
          fragmentShader={PARTICLE_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ---------- Публичный компонент ---------- */
export default function SceneBackground() {
  // Пауза рендера, когда вкладка не видна — экономия батареи
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      {/* CSS-fallback: виден всегда (под канвасом), остаётся если WebGL нет */}
      <div className="aurora-fallback absolute inset-0" />
      <GLBoundary>
        <Canvas
          frameloop={frameloop}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor("#0a0a0f", 1)}
        >
          <AuroraPlane />
          <Particles />
          <AdaptiveDpr />
        </Canvas>
      </GLBoundary>
    </div>
  );
}
