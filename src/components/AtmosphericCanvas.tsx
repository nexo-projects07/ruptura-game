import React, { useEffect, useRef } from 'react';

export const AtmosphericCanvas: React.FC<{ screenShake?: boolean }> = ({ screenShake }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedY: -Math.random() * 0.8 - 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(236, 72, 153, ',
      alpha: Math.random() * 0.7 + 0.2
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, width, height);

      const tearX = width * 0.65;
      const tearY = height * 0.25;
      const gradientRift = ctx.createRadialGradient(tearX, tearY, 10, tearX, tearY, 180);
      gradientRift.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
      gradientRift.addColorStop(0.3, 'rgba(168, 85, 247, 0.4)');
      gradientRift.addColorStop(0.7, 'rgba(6, 182, 212, 0.15)');
      gradientRift.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradientRift;
      ctx.beginPath();
      ctx.arc(tearX, tearY, 200, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.8)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(tearX - 60, tearY + 40);
      ctx.lineTo(tearX - 20 + Math.sin(time * 3) * 5, tearY - 10);
      ctx.lineTo(tearX + 40 + Math.cos(time * 2) * 5, tearY - 50);
      ctx.lineTo(tearX + 90, tearY - 30);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
      ctx.beginPath();
      ctx.moveTo(tearX - 40, tearY + 20);
      ctx.lineTo(tearX + 10, tearY + 50 + Math.sin(time * 4) * 4);
      ctx.lineTo(tearX + 70, tearY + 10);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#0a0f1d';
      const buildingWidth = width / 12;
      for (let i = 0; i < 14; i++) {
        const h = 120 + Math.sin(i * 999) * 80 + (i % 3) * 40;
        const x = i * (buildingWidth - 5);
        ctx.fillRect(x, height - h - 60, buildingWidth + 10, h + 60);

        if (i % 2 === 0) {
          ctx.fillStyle = (i % 4 === 0) ? 'rgba(6, 182, 212, 0.4)' : 'rgba(236, 72, 153, 0.3)';
          for (let wy = 0; wy < h - 20; wy += 25) {
            if (Math.sin(i + wy + time) > -0.2) {
              ctx.fillRect(x + 10, height - h - 50 + wy, 6, 12);
            }
          }
          ctx.fillStyle = '#0a0f1d';
        }
      }

      const groundY = height - 70;
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
      groundGradient.addColorStop(0, '#0d1527');
      groundGradient.addColorStop(1, '#030509');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, groundY, width, height - groundY);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.beginPath();
      ctx.ellipse(width * 0.3, height - 35, 80, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(236, 72, 153, 0.18)';
      ctx.beginPath();
      ctx.ellipse(width * 0.7, height - 25, 110, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none transition-transform duration-100 ${screenShake ? 'translate-x-2 -translate-y-2 scale-105' : ''}`}
    />
  );
};