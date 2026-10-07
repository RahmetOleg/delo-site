/**
 * GLSL-шейдеры для фона «живая аврора».
 * - Aurora: fbm-шум (simplex 2D) + три цветных «сгустка» (violet/indigo/blue),
 *   мягкая виньетка и зерно — даёт глубину без нагрузки на GPU.
 * - Particles: частицы с мягкими краями, дрейф по синусоиде, параллакс от мыши.
 * Параметры подобраны под палитру #A78BFA → #6D6AF6 → #4E7CFF на #0A0A0F.
 */

export const AURORA_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const AURORA_FRAG = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
varying vec2 vUv;

/* ---- Simplex 2D noise (Ashima Arts / Stefan Gustavson, MIT) ---- */
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = uTime * 0.05;

  // Два слоя шума — «дыхание» фона
  float n1 = fbm(p * 1.35 + vec2(t, -t * 0.6) + uMouse * 0.12);
  float n2 = fbm(p * 2.1 - vec2(t * 0.7, t * 0.4) + n1 * 0.55);

  // Три цветных сгустка, плавно дрейфуют + реагируют на мышь
  float d1 = length(p - vec2(-0.55 + n1 * 0.12,  0.34 + n2 * 0.10) + uMouse * 0.06);
  float d2 = length(p - vec2( 0.62 + n2 * 0.10, -0.30 - n1 * 0.08) - uMouse * 0.06);
  float d3 = length(p - vec2( 0.08 - n2 * 0.08,  0.58 - n1 * 0.10));

  vec3 col = vec3(0.039, 0.039, 0.059); // база #0A0A0F
  col += vec3(0.655, 0.545, 0.980) * smoothstep(0.95, 0.0, d1) * 0.15; // violet
  col += vec3(0.427, 0.416, 0.965) * smoothstep(0.90, 0.0, d2) * 0.15; // indigo
  col += vec3(0.306, 0.486, 1.000) * smoothstep(0.80, 0.0, d3) * 0.09; // blue
  col += vec3(0.600, 0.580, 0.800) * max(n2, 0.0) * 0.018;             // дымка

  // Виньетка — центр светлее, края глубже
  float vig = smoothstep(1.30, 0.30, length(uv - 0.5) * 1.55);
  col = mix(col * 0.70, col, vig);

  // Плёночное зерно
  float grain = fract(sin(dot(uv * uRes + uTime * 7.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.014;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const PARTICLE_VERT = /* glsl */ `
attribute float aScale;
attribute float aSpeed;
attribute float aMix;
uniform float uTime;
varying float vAlpha;
varying float vMix;

void main() {
  vec3 pos = position;
  // Лёгкий дрейф по синусоиде — «пыль в невесомости»
  pos.y += sin(uTime * aSpeed + pos.x * 1.7) * 0.16;
  pos.x += cos(uTime * aSpeed * 0.8 + pos.y * 1.3) * 0.12;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * (20.0 / -mv.z);

  // Ближние частицы ярче
  vAlpha = smoothstep(13.0, 3.5, -mv.z);
  vMix = aMix;
}
`;

export const PARTICLE_FRAG = /* glsl */ `
precision mediump float;
varying float vAlpha;
varying float vMix;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.06, d);
  vec3 violet = vec3(0.78, 0.71, 1.00);
  vec3 blue   = vec3(0.44, 0.58, 1.00);
  vec3 col = mix(violet, blue, vMix);
  gl_FragColor = vec4(col, a * 0.5 * vAlpha);
}
`;
