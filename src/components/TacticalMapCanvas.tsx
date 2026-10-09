import React, { useEffect, useRef } from 'react';

export const TacticalMapCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillStyle = 'rgba(10, 16, 31, 0.5)';
      const blocks = [
        { x: 0.1, y: 0.15, w: 0.2, h: 0.25 },
        { x: 0.35, y: 0.1, w: 0.25, h: 0.2 },
        { x: 0.65, y: 0.12, w: 0.25, h: 0.3 },
        { x: 0.12, y: 0.55, w: 0.22, h: 0.35 },
        { x: 0.4, y: 0.6, w: 0.2, h: 0.3 },
        { x: 0.68, y: 0.58, w: 0.22, h: 0.32 },
      ];

      blocks.forEach(b => {
        const bx = b.x * width;
        const by = b.y * height;
        const bw = b.w * width;
        const bh = b.h * height;
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeRect(bx, by, bw, bh);
      });

      const scanX = width * 0.5;
      const scanY = height * 0.5;
      const scanRadius = (time * 80) % (width * 0.6);
      ctx.strokeStyle = 'rgba(6, 182, 212, ' + Math.max(0, 0.3 - scanRadius / (width * 0.6)) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(scanX, scanY, scanRadius, 0, Math.PI * 2);
      ctx.stroke();

      const riftX = width * 0.82;
      const riftY = height * 0.2;
      const riftGlow = ctx.createRadialGradient(riftX, riftY, 5, riftX, riftY, 140);
      riftGlow.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
      riftGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
      riftGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = riftGlow;
      ctx.beginPath();
      ctx.arc(riftX, riftY, 140, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};