"use client";

/**
 * useTrackingEyes — la firma de marca de Pantera.
 *
 * Los ojos ámbar siguen el cursor desde la oscuridad. Cuando el usuario queda
 * quieto > 1.4s, los ojos empiezan a merodear (prowl) en oscilación lenta.
 * Cada 3–7s parpadean. `prefers-reduced-motion` apaga todo y los deja estáticos.
 *
 * Diseño:
 *   - Un solo rAF loop a nivel módulo, recorre TODOS los `.iris` registrados.
 *   - Listeners globales registrados una sola vez (`ensureLoopStarted`).
 *   - El hook devuelve un ref para el `.iris`; se registra al montar.
 *
 * Port fiel del JS en `Pantera - Dirección Visual.html` líneas 630–698.
 */

import { useEffect, useRef } from "react";

type IrisEl = HTMLElement;

const registry = new Set<IrisEl>();
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
      let tx: number;
      let ty: number;

      if (pointerActive) {
        // sigue el cursor — respuesta a una acción del usuario, siempre activa
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const maxX = r.width * 0.05;
        const maxY = r.height * 0.07;
        const amt = Math.min(1, d / 520);
        tx = (dx / d) * maxX * (0.5 + amt * 0.5);
        ty = (dy / d) * maxY * (0.5 + amt * 0.5);
      } else if (!prefersReduced) {
        // merodea (autónomo) — silenciado bajo reduce-motion
        tx = Math.cos(tNow) * r.width * 0.025;
        ty = Math.sin(tNow * 1.3) * r.height * 0.035;
      } else {
        tx = 0;
        ty = 0;
      }

      iris.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
    });
  }
  requestAnimationFrame(frame);
}

function scheduleBlink() {
  const delay = 3200 + Math.random() * 4200;
  blinkTimer = setTimeout(() => {
    document.querySelectorAll<HTMLElement>("[data-eye]").forEach((eye) => {
      eye.style.transform = "scaleY(0.08)";
      setTimeout(() => {
        eye.style.transform = "";
      }, 120);
    });
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

  // El tracking del cursor es respuesta a una acción del usuario —
  // se mantiene activo aun con reduce-motion. Solo se silencian las
  // animaciones autónomas (prowl en frame() y blink acá abajo).
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });

  requestAnimationFrame(frame);

  if (!prefersReduced) {
    setTimeout(scheduleBlink, 2600);
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
      el.style.transform = "";
    };
  }, []);

  return irisRef;
}
