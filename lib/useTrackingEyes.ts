"use client";

/**
 * useTrackingEyes — la firma de marca de Pantera.
 *
 * Los ojos ámbar acechan desde la oscuridad. Tracking con inercia (lag
 * felino), prowl cuando el usuario queda quieto, parpadeo variado
 * (snap, double, slow). En mobile sigue el dedo y deambula entre
 * toques. `prefers-reduced-motion` apaga prowl y blink; el tracking
 * por cursor se mantiene (es respuesta directa del usuario).
 */

import { useEffect, useRef } from "react";

type IrisEl = HTMLElement;

const registry = new Set<IrisEl>();
const irisState = new WeakMap<IrisEl, { x: number; y: number }>();
let started = false;
let blinkTimer: ReturnType<typeof setTimeout> | null = null;

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
    const tNow = Date.now() / 2600;
    const pointerActive = now - pointer.last < 1400;

    registry.forEach((iris) => {
      const eye = iris.parentElement;
      if (!eye) return;
      const r = eye.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let targetX: number;
      let targetY: number;

      if (pointerActive) {
        // sigue el cursor con fijación predadora: cerca = más amplitud,
        // lejos = más sutil. Un acecho, no un robot reactivo.
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const maxX = r.width * 0.06;
        const maxY = r.height * 0.085;
        // 0..1: 1 = cursor pegado, 0 = lejos. Fija más cuando está cerca.
        const focus = 1 - Math.min(1, d / 600);
        const intensity = 0.55 + focus * 0.45;
        targetX = (dx / d) * maxX * intensity;
        targetY = (dy / d) * maxY * intensity;
      } else if (!prefersReduced) {
        // merodea (autónomo) — oscilación lenta entre dos frecuencias
        targetX = Math.cos(tNow) * r.width * 0.025;
        targetY = Math.sin(tNow * 1.3) * r.height * 0.035;
      } else {
        targetX = 0;
        targetY = 0;
      }

      // inercia: el iris persigue el target con lerp. Da el "lag" felino
      // — no salta a la presa, la sigue.
      let state = irisState.get(iris);
      if (!state) {
        state = { x: targetX, y: targetY };
        irisState.set(iris, state);
      }
      const ease = pointerActive ? 0.14 : 0.08;
      state.x += (targetX - state.x) * ease;
      state.y += (targetY - state.y) * ease;

      iris.style.transform = `translate(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px)`;
    });
  }
  requestAnimationFrame(frame);
}

function blinkAllOnce(durationMs: number) {
  document.querySelectorAll<HTMLElement>("[data-eye]").forEach((eye) => {
    eye.style.transform = "scaleY(0.06)";
    setTimeout(() => {
      eye.style.transform = "";
    }, durationMs);
  });
}

function scheduleBlink() {
  const delay = 2800 + Math.random() * 4400;
  blinkTimer = setTimeout(() => {
    const variant = Math.random();
    if (variant < 0.22) {
      // double-blink: dos parpadeos rápidos seguidos (tic felino)
      blinkAllOnce(110);
      setTimeout(() => blinkAllOnce(110), 220);
    } else if (variant < 0.45) {
      // slow-blink: entrecerrar lento — el "cariño felino"
      blinkAllOnce(280);
    } else {
      // snap-blink: el habitual
      blinkAllOnce(120);
    }
    scheduleBlink();
  }, delay);
}

function ensureLoopStarted() {
  if (started || typeof window === "undefined") return;
  started = true;

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
    setTimeout(scheduleBlink, 2200);
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
