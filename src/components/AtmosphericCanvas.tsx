import React, { useEffect, useRef } from 'react';

interface AtmosphericCanvasProps {
  screenShake?: boolean;
  realm?: string;
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({ screenShake, realm = 'realm-alpha' }) => {
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

    // Realm-specific particle palette and setup
    const isBeta = realm === 'realm-beta';
    const isGamma = realm === 'realm-gamma';
    const isEpsilon = realm === 'realm-epsilon';
    const isOmega = realm === 'realm-omega';

    const particles = Array.from({ length: 48 }, () => {
      let color = 'rgba(6, 182, 212, ';
      if (isBeta) {
        color = Math.random() > 0.4 ? 'rgba(245, 158, 11, ' : 'rgba(239, 68, 68, ';
      } else if (isGamma) {
        color = Math.random() > 0.4 ? 'rgba(168, 85, 247, ' : 'rgba(56, 189, 248, ';
      } else if (isEpsilon) {
        color = Math.random() > 0.4 ? 'rgba(16, 185, 129, ' : 'rgba(234, 179, 8, ';
      } else if (isOmega) {
        color = Math.random() > 0.4 ? 'rgba(225, 29, 72, ' : 'rgba(255, 255, 255, ';
      } else {
        color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(236, 72, 153, ';
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 0.6,
        speedY: isBeta ? -Math.random() * 1.2 - 0.4 : -Math.random() * 0.8 - 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        color,
        alpha: Math.random() * 0.7 + 0.2,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.02;

      // Base background color according to realm
      if (isBeta) {
        ctx.fillStyle = '#0f0905';
      } else if (isGamma) {
        ctx.fillStyle = '#090514';
      } else if (isEpsilon) {
        ctx.fillStyle = '#040d0a';
      } else if (isOmega) {
        ctx.fillStyle = '#0d0208';
      } else {
        ctx.fillStyle = '#060913';
      }
      ctx.fillRect(0, 0, width, height);

      // Central Rift / Singularity
      const tearX = width * 0.65;
      const tearY = height * 0.26;
      const gradientRift = ctx.createRadialGradient(tearX, tearY, 10, tearX, tearY, 210);

      if (isBeta) {
        gradientRift.addColorStop(0, 'rgba(245, 158, 11, 0.85)');
        gradientRift.addColorStop(0.35, 'rgba(220, 38, 38, 0.45)');
        gradientRift.addColorStop(0.7, 'rgba(120, 53, 15, 0.2)');
      } else if (isGamma) {
        gradientRift.addColorStop(0, 'rgba(168, 85, 247, 0.85)');
        gradientRift.addColorStop(0.35, 'rgba(99, 102, 241, 0.45)');
        gradientRift.addColorStop(0.7, 'rgba(56, 189, 248, 0.2)');
      } else if (isEpsilon) {
        gradientRift.addColorStop(0, 'rgba(234, 179, 8, 0.85)');
        gradientRift.addColorStop(0.35, 'rgba(16, 185, 129, 0.45)');
        gradientRift.addColorStop(0.7, 'rgba(6, 95, 70, 0.2)');
      } else if (isOmega) {
        gradientRift.addColorStop(0, 'rgba(225, 29, 72, 0.9)');
        gradientRift.addColorStop(0.35, 'rgba(147, 51, 234, 0.5)');
        gradientRift.addColorStop(0.7, 'rgba(244, 63, 94, 0.25)');
      } else {
        gradientRift.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
        gradientRift.addColorStop(0.35, 'rgba(168, 85, 247, 0.4)');
        gradientRift.addColorStop(0.7, 'rgba(6, 182, 212, 0.15)');
      }
      gradientRift.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradientRift;
      ctx.beginPath();
      ctx.arc(tearX, tearY, 220, 0, Math.PI * 2);
      ctx.fill();

      // Rift lightning tendrils
      ctx.save();
      ctx.strokeStyle = isBeta
        ? 'rgba(245, 158, 11, 0.8)'
        : isGamma
        ? 'rgba(192, 132, 252, 0.85)'
        : isEpsilon
        ? 'rgba(250, 204, 21, 0.85)'
        : isOmega
        ? 'rgba(251, 113, 133, 0.9)'
        : 'rgba(244, 114, 182, 0.8)';
      ctx.lineWidth = 2;
      ctx.shadowColor = isBeta ? '#f59e0b' : isGamma ? '#a855f7' : isEpsilon ? '#eab308' : isOmega ? '#e11d48' : '#ec4899';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.moveTo(tearX - 60, tearY + 40);
      ctx.lineTo(tearX - 20 + Math.sin(time * 3) * 6, tearY - 10);
      ctx.lineTo(tearX + 40 + Math.cos(time * 2) * 6, tearY - 50);
      ctx.lineTo(tearX + 90, tearY - 30);
      ctx.stroke();

      ctx.strokeStyle = isBeta
        ? 'rgba(239, 68, 68, 0.7)'
        : isGamma
        ? 'rgba(56, 189, 248, 0.7)'
        : isEpsilon
        ? 'rgba(52, 211, 153, 0.7)'
        : isOmega
        ? 'rgba(255, 255, 255, 0.8)'
        : 'rgba(34, 211, 238, 0.7)';
      ctx.beginPath();
      ctx.moveTo(tearX - 40, tearY + 20);
      ctx.lineTo(tearX + 10, tearY + 50 + Math.sin(time * 4) * 5);
      ctx.lineTo(tearX + 70, tearY + 10);
      ctx.stroke();
      ctx.restore();

      // Distant Silhouettes / Horizon Structures
      ctx.fillStyle = isBeta ? '#1a0e07' : isGamma ? '#130924' : isEpsilon ? '#061a14' : isOmega ? '#1a0510' : '#0a0f1d';
      const buildingWidth = width / 12;
      for (let i = 0; i < 14; i++) {
        const h = 110 + Math.sin(i * 999) * 80 + (i % 3) * 40;
        const x = i * (buildingWidth - 5);
        ctx.fillRect(x, height - h - 60, buildingWidth + 10, h + 60);

        if (i % 2 === 0) {
          ctx.fillStyle = isBeta
            ? 'rgba(245, 158, 11, 0.35)'
            : isGamma
            ? 'rgba(168, 85, 247, 0.35)'
            : isEpsilon
            ? 'rgba(16, 185, 129, 0.35)'
            : isOmega
            ? 'rgba(225, 29, 72, 0.4)'
            : 'rgba(6, 182, 212, 0.35)';

          for (let wy = 0; wy < h - 20; wy += 25) {
            if (Math.sin(i + wy + time) > -0.2) {
              ctx.fillRect(x + 10, height - h - 50 + wy, 6, 12);
            }
          }
          ctx.fillStyle = isBeta ? '#1a0e07' : isGamma ? '#130924' : isEpsilon ? '#061a14' : isOmega ? '#1a0510' : '#0a0f1d';
        }
      }

      // Ground Horizon
      const groundY = height - 70;
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
      groundGradient.addColorStop(0, isBeta ? '#1c100a' : isGamma ? '#140826' : isEpsilon ? '#09211a' : isOmega ? '#200715' : '#0d1527');
      groundGradient.addColorStop(1, '#020306');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Ambient Ground Glows
      ctx.fillStyle = isBeta ? 'rgba(245, 158, 11, 0.15)' : isGamma ? 'rgba(168, 85, 247, 0.15)' : isEpsilon ? 'rgba(16, 185, 129, 0.15)' : isOmega ? 'rgba(225, 29, 72, 0.2)' : 'rgba(6, 182, 212, 0.18)';
      ctx.beginPath();
      ctx.ellipse(width * 0.3, height - 35, 90, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Particles render and float
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
  }, [realm]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none transition-transform duration-100 ${screenShake ? 'translate-x-2 -translate-y-2 scale-105' : ''}`}
    />
  );
};
