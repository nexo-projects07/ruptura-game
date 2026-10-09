import React from 'react';

export const KaelAvatar: React.FC<{ state?: 'idle' | 'attack' | 'defend' | 'hit' }> = ({ state = 'idle' }) => {
  const isAttack = state === 'attack';
  const isDefend = state === 'defend';
  const isHit = state === 'hit';

  return (
    <div className={`relative transition-all duration-300 transform ${isAttack ? 'translate-x-12 scale-105' : ''} ${isHit ? '-translate-x-4 opacity-75 blur-[0.5px]' : ''}`}>
      <svg width="180" height="220" viewBox="0 0 180 220" className="drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
        {isDefend && (
          <path
            d="M 20 20 Q 90 -10 160 20 Q 170 120 90 210 Q 10 120 20 20 Z"
            fill="rgba(6, 182, 212, 0.15)"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeDasharray="6 3"
            className="animate-pulse"
          />
        )}
        <ellipse cx="90" cy="195" rx="60" ry="12" fill="rgba(6, 182, 212, 0.2)" />
        <path d="M 65 130 L 50 190 L 70 195 L 80 140 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <path d="M 115 130 L 130 190 L 110 195 L 100 140 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <path d="M 55 70 L 125 70 L 115 135 L 65 135 Z" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
        <polygon points="90,80 102,95 90,110 78,95" fill="#06b6d4" className="animate-pulse" />
        <path d="M 40 70 L 60 60 L 65 85 L 45 90 Z" fill="#334155" stroke="#06b6d4" strokeWidth="1.5" />
        <path d="M 140 70 L 120 60 L 115 85 L 135 90 Z" fill="#334155" stroke="#06b6d4" strokeWidth="1.5" />
        <path d="M 125 75 L 150 100 L 140 120" stroke="#334155" strokeWidth="10" strokeLinecap="round" fill="none" />
        <g transform={isAttack ? 'rotate(-25 140 100)' : 'rotate(0)'}>
          <line x1="140" y1="110" x2="175" y2="50" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_10px_#06b6d4]" />
          <line x1="140" y1="110" x2="175" y2="50" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>
        <path d="M 70 30 L 110 30 L 115 65 L 65 65 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
        <polygon points="72,45 108,45 104,55 76,55" fill="#06b6d4" className="drop-shadow-[0_0_8px_#06b6d4]" />
      </svg>
    </div>
  );
};