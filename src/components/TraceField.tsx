"use client";

import { useEffect, useRef } from "react";

export function TraceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let tick = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (let lane = 0; lane < 7; lane++) {
        const y = (height / 8) * (lane + 1);
        const offset = (tick * (0.5 + lane * 0.08)) % (width + 140);
        const start = offset - 140;
        const gradient = ctx.createLinearGradient(start, y, start + 140, y);
        gradient.addColorStop(0, "rgba(84, 211, 194, 0)");
        gradient.addColorStop(0.45, "rgba(84, 211, 194, 0.24)");
        gradient.addColorStop(1, "rgba(255, 184, 107, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lane % 2 === 0 ? 1.2 : 0.7;
        ctx.beginPath();
        ctx.moveTo(start, y);
        ctx.bezierCurveTo(
          start + 40,
          y - 18,
          start + 80,
          y + 18,
          start + 140,
          y,
        );
        ctx.stroke();
      }
      tick += 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (!reduced) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="trace-field" aria-hidden />;
}
