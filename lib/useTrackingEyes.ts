"use client";

/**
 * useTrackingEyes — la firma de marca de Pantera.
 *
 * Coreografía de entrada (el animal se presenta):
 *   0–1000 ms : ojos fijos al centro, calma absoluta.
 *   1000 ms   : blink corto — la primera mirada.
 *   1330 ms   : entrecerrar mantenido (~720 ms con hold).
 *   2060 ms   : segundo blink.
 *   2400 ms   : ciclo normal de blinks variados.
 *
 * Durante 1000–3500 ms los ojos merodean ignorando el cursor (intro window).
 * Después: tracking del cursor + prowl idle + blink variado.
 *
 * Los blinks viajan por keyframes CSS asimétricos (cierre rápido, apertura
 * lenta) disparados con class-toggle. El cleanup se hace en `animationend`.
 *
 * `prefers-reduced-motion` apaga blinks y prowl. El tracking por cursor
 * se mantiene (es respuesta directa del usuario).
 */

import { useEffect, useRef } from "react";

type IrisEl = HTMLElement;

const registry = new Set<IrisEl>();
const irisState = new WeakMap<IrisEl, { x: number; y: number }>();
let started = false;
let mountTime = 0;

// Direcciones de merodeo — bias hacia los lados y abajo, propio del cazador
// que escanea el suelo. Los valores son multiplicadores de la amplitud
// máxima (rango -1..1).
const PROWL_DIRECTIONS: ReadonlyArray<{ x: number; y: number }> = [
  { x:  0.00, y:  0.60 },  // abajo
  { x: -0.55, y:  0.45 },  // abajo-izquierda
  { x:  0.55, y:  0.45 },  // abajo-derecha
  { x: -0.85, y:  0.05 },  // izquierda
  { x:  0.85, y:  0.05 },  // derecha
  { x: -0.40, y: -0.25 },  // arriba-izquierda (sutil)
  { x:  0.40, y: -0.25 },  // arriba-derecha (sutil)
];

const prowlTarget = {
  x: 0,
  y: 0,
  nextChangeAt: 0,
};

function pickProwlDirection(now: number) {
  const dir = PROWL_DIRECTIONS[Math.floor(Math.random() * PROWL_DIRECTIONS.length)];
  prowlTarget.x = dir.x;
  prowlTarget.y = dir.y;
  // Mantiene la mirada 1.6–4.0 s antes de elegir otra dirección.
  prowlTarget.nextChangeAt = now + 1600 + Math.random() * 2400;
}

const INTRO_CALM_MS = 1000;
const INTRO_PROWL_END_MS = 3500;

const BLINK_CLASSES = ["blinkSnap", "blinkSlow", "halfClose", "doubleBlink"] as const;
type BlinkClass = (typeof BLINK_CLASSES)[number];

const pointer = {
  x: 0,
  y: 0,
  last: -9999,
};

let prefersReduced = false;

function track(x: number, y: number) {
  pointer.x = x;
  pointer.y = y;
  pointer.last = performance.now();
}

function onPointerMove(e: PointerEvent) { track(e.clientX, e.clientY); }
function onPointerDown(e: PointerEvent) { track(e.clientX, e.clientY); }
function onTouchStart(e: TouchEvent) {
  const t = e.touches?.[0];
  if (t) track(t.clientX, t.clientY);
}
function onTouchMove(e: TouchEvent) {
  const t = e.touches?.[0];
  if (t) track(t.clientX, t.clientY);
}

function frame() {
  if (registry.size > 0) {
    const now = performance.now();
    const sinceMount = now - mountTime;

    const inCalm = sinceMount < INTRO_CALM_MS;
    const inIntroProwl = !inCalm && sinceMount < INTRO_PROWL_END_MS;
    const pointerActive =
      !inCalm && !inIntroProwl && now - pointer.last < 1400;
    const prowling = !inCalm && !pointerActive && !prefersReduced;

    if (prowling && now > prowlTarget.nextChangeAt) {
      pickProwlDirection(now);
    }

    registry.forEach((iris) => {
      const eye = iris.parentElement;
      if (!eye) return;
      const r = eye.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let targetX = 0;
      let targetY = 0;

      if (inCalm) {
        targetX = 0;
        targetY = 0;
      } else if (pointerActive) {
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const maxX = r.width * 0.06;
        const maxY = r.height * 0.085;
        const focus = 1 - Math.min(1, d / 600);
        const intensity = 0.55 + focus * 0.45;
        targetX = (dx / d) * maxX * intensity;
        targetY = (dy / d) * maxY * intensity;
      } else if (prowling) {
        // Merodeo deliberado: mantiene una dirección 1.6–4 s antes de
        // saccadear a otra. Mientras tanto un micro-jitter mantiene la
        // mirada viva — como un gato que escanea pequeños detalles
        // dentro del cuadrante donde quedó fijada la atención.
        const maxX = r.width * 0.075;
        const maxY = r.height * 0.105;
        const microX = Math.sin(now / 870) * 0.09 + Math.sin(now / 430) * 0.04;
        const microY = Math.sin(now / 1190) * 0.07 + Math.cos(now / 510) * 0.03;
        targetX = (prowlTarget.x + microX) * maxX;
        targetY = (prowlTarget.y + microY) * maxY;
      }

      let state = irisState.get(iris);
      if (!state) {
        state = { x: targetX, y: targetY };
        irisState.set(iris, state);
      }
      const ease = pointerActive ? 0.19 : 0.13;
      state.x += (targetX - state.x) * ease;
      state.y += (targetY - state.y) * ease;

      iris.style.transform = `translate(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px)`;
    });
  }
  requestAnimationFrame(frame);
}

function applyBlink(name: BlinkClass) {
  document.querySelectorAll<HTMLElement>("[data-eye]").forEach((eye) => {
    BLINK_CLASSES.forEach((c) => eye.classList.remove(c));
    // reflow para reiniciar la animación si el ojo viene de otro estado
    void eye.offsetWidth;
    eye.classList.add(name);
    const onEnd = () => {
      eye.classList.remove(name);
      eye.removeEventListener("animationend", onEnd);
    };
    eye.addEventListener("animationend", onEnd);
  });
}

function scheduleBlink() {
  const delay = 2800 + Math.random() * 4400;
  setTimeout(() => {
    const variant = Math.random();
    if (variant < 0.22)      applyBlink("doubleBlink");
    else if (variant < 0.45) applyBlink("blinkSlow");
    else                     applyBlink("blinkSnap");
    scheduleBlink();
  }, delay);
}

function runIntro() {
  setTimeout(() => applyBlink("blinkSnap"), INTRO_CALM_MS);          // 1000ms
  setTimeout(() => applyBlink("halfClose"), INTRO_CALM_MS + 330);    // 1330ms
  setTimeout(() => applyBlink("blinkSnap"), INTRO_CALM_MS + 1060);   // 2060ms
  setTimeout(scheduleBlink, INTRO_CALM_MS + 1400);                   // 2400ms
}

function ensureLoopStarted() {
  if (started || typeof window === "undefined") return;
  started = true;
  mountTime = performance.now();

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReduced = mq.matches;
  mq.addEventListener?.("change", (e) => { prefersReduced = e.matches; });

  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });

  requestAnimationFrame(frame);

  if (!prefersReduced) {
    runIntro();
  }
}

export function useTrackingEyes() {
  const irisRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureLoopStarted();
    const el = irisRef.current;
    if (!el) return;
    registry.add(el);
    return () => {
      registry.delete(el);
      irisState.delete(el);
      el.style.transform = "";
    };
  }, []);

  return irisRef;
}
