import React from 'react';

export const FragmentadoAvatar: React.FC<{ state?: 'idle' | 'attack' | 'hit' }> = ({ state = 'idle' }) => {
  const isAttack = state === 'attack';
  const isHit = state === 'hit';

  return (
    <div className={`relative transition-all duration-300 transform ${isAttack ? '-translate-x-12 scale-110' : ''} ${isHit ? 'translate-x-6 opacity-60 blur-[1px]' : ''}`}>
      <svg width="200" height="230" viewBox="0 0 200 230" className="drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
        <ellipse cx="100" cy="200" rx="70" ry="14" fill="rgba(236, 72, 153, 0.25)" />
        <polygon points="30,40 50,20 45,60" fill="rgba(236, 72, 153, 0.6)" className="animate-bounce" />
        <polygon points="160,50 180,30 170,70" fill="rgba(168, 85, 247, 0.6)" className="animate-pulse" />
        <polygon points="20,140 40,120 30,160" fill="rgba(236, 72, 153, 0.5)" />
        <polygon points="170,130 190,110 175,150" fill="rgba(6, 182, 212, 0.5)" />
        <path
          d="M 60 70 Q 100 40 140 70 Q 160 130 100 190 Q 40 130 60 70 Z"
          fill="url(#fragmentadoGrad)"
          stroke="#ec4899"
          strokeWidth="2"
        />
        <circle cx="100" cy="110" r="22" fill="#ec4899" className="animate-ping opacity-75" />
        <circle cx="100" cy="110" r="14" fill="#ffffff" />
        <line x1="80" y1="75" x2="95" y2="75" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
        <line x1="105" y1="75" x2="120" y2="75" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
        <defs>
          <linearGradient id="fragmentadoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#831843" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};