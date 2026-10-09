import React from 'react';

interface FragmentadoAvatarProps {
  state?: 'idle' | 'attack' | 'hit';
  isBoss?: boolean;
  bossPhase?: number;
  bossType?: 'NORMAL' | 'GUARDIAN' | 'AVATAR' | 'ARCHITECT';
}

export const FragmentadoAvatar: React.FC<FragmentadoAvatarProps> = ({
  state = 'idle',
  isBoss = false,
  bossPhase = 1,
  bossType = 'NORMAL',
}) => {
  const isAttack = state === 'attack';
  const isHit = state === 'hit';

  // Palette tuning based on boss status
  const primaryGlow = isBoss ? '#f43f5e' : '#ec4899';
  const secondaryColor = bossPhase >= 2 ? '#a855f7' : '#06b6d4';
  const coreGlow = bossPhase === 3 ? '#fbbf24' : primaryGlow;

  return (
    <div
      className={`relative transition-all duration-300 transform select-none ${
        isAttack ? '-translate-x-14 scale-110' : ''
      } ${isHit ? 'translate-x-8 opacity-70 blur-[1px]' : ''}`}
    >
      {/* Dimensional distortion shadow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none animate-pulse"
        style={{
          background: `radial-gradient(circle, ${primaryGlow} 0%, ${secondaryColor} 50%, transparent 70%)`,
        }}
      />

      <svg
        width="220"
        height="260"
        viewBox="0 0 220 260"
        className="relative z-10 drop-shadow-[0_0_25px_rgba(244,63,94,0.6)]"
      >
        <defs>
          {/* Cosmic gradient for body armor */}
          <linearGradient id="villainArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="45%" stopColor="#1e102d" />
            <stop offset="85%" stopColor="#4c0519" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Core rift gradient */}
          <radialGradient id="riftCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor={coreGlow} />
            <stop offset="65%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Shard gradient */}
          <linearGradient id="shardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="110" cy="245" rx="75" ry="14" fill="rgba(225, 29, 72, 0.25)" className="animate-pulse" />

        {/* Outer Floating Crystalline Shards (Dimensional Debris) */}
        <g className="animate-pulse">
          <polygon points="25,45 40,25 35,55" fill="url(#shardGrad)" opacity="0.8" />
          <polygon points="195,50 210,30 200,60" fill="url(#shardGrad)" opacity="0.8" />
          <polygon points="15,130 30,115 22,145" fill="url(#shardGrad)" opacity="0.7" />
          <polygon points="195,140 215,120 205,155" fill="url(#shardGrad)" opacity="0.7" />
          <polygon points="40,205 55,190 48,220" fill="url(#shardGrad)" opacity="0.6" />
          <polygon points="175,200 190,185 182,215" fill="url(#shardGrad)" opacity="0.6" />
        </g>

        {/* Floating Fractal Energy Wings / Cape Ribs */}
        <path
          d="M 110 95 L 45 40 L 60 90 L 20 85 L 50 120 L 15 150 L 65 155 Z"
          fill="rgba(30, 16, 45, 0.75)"
          stroke={primaryGlow}
          strokeWidth="1.5"
          opacity="0.85"
        />
        <path
          d="M 110 95 L 175 40 L 160 90 L 200 85 L 170 120 L 205 150 L 155 155 Z"
          fill="rgba(30, 16, 45, 0.75)"
          stroke={primaryGlow}
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Upper Floating Pauldrons (Shoulders) */}
        <polygon points="55,90 85,80 75,115 45,110" fill="url(#villainArmor)" stroke={primaryGlow} strokeWidth="2" />
        <polygon points="165,90 135,80 145,115 175,110" fill="url(#villainArmor)" stroke={primaryGlow} strokeWidth="2" />

        {/* Biomechanical Torso & Armor Plating */}
        <path
          d="M 80 85 L 140 85 L 150 140 L 130 195 L 90 195 L 70 140 Z"
          fill="url(#villainArmor)"
          stroke={secondaryColor}
          strokeWidth="2"
        />

        {/* Ribcage Segmented Plates */}
        <line x1="85" y1="125" x2="100" y2="135" stroke="#e11d48" strokeWidth="2" />
        <line x1="135" y1="125" x2="120" y2="135" stroke="#e11d48" strokeWidth="2" />
        <line x1="88" y1="145" x2="102" y2="155" stroke="#e11d48" strokeWidth="2" />
        <line x1="132" y1="145" x2="118" y2="155" stroke="#e11d48" strokeWidth="2" />

        {/* Central Rift Singularity Core (Swirling Dimensional Eye/Tesseract) */}
        <g filter="url(#glow)">
          <circle cx="110" cy="135" r="24" fill="url(#riftCore)" className="animate-pulse" />
          {/* Orbital containment rings */}
          <ellipse
            cx="110"
            cy="135"
            rx="20"
            ry="9"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            transform="rotate(25 110 135)"
            className="animate-spin"
            style={{ transformOrigin: '110px 135px' }}
          />
          <ellipse
            cx="110"
            cy="135"
            rx="20"
            ry="9"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.5"
            transform="rotate(-45 110 135)"
          />
          <circle cx="110" cy="135" r="7" fill="#ffffff" />
        </g>

        {/* Lower Body: Shifting Dimensional Tendrils / Greaves */}
        <path d="M 90 195 L 75 240 L 95 245 L 105 200 Z" fill="#090d16" stroke="#4c0519" strokeWidth="2" />
        <path d="M 130 195 L 145 240 L 125 245 L 115 200 Z" fill="#090d16" stroke="#4c0519" strokeWidth="2" />

        {/* Arms and Void Weaponry */}
        <g transform={isAttack ? 'translate(-15, -10)' : 'translate(0, 0)'}>
          <path d="M 50 105 L 35 155 L 45 180" stroke="#1e102d" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Left Energy Claws */}
          <line x1="45" y1="180" x2="25" y2="205" stroke={primaryGlow} strokeWidth="3" strokeLinecap="round" />
          <line x1="45" y1="180" x2="35" y2="215" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="45" y1="180" x2="50" y2="215" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" />
        </g>

        <g transform={isAttack ? 'translate(-20, -5)' : 'translate(0, 0)'}>
          <path d="M 170 105 L 185 155 L 175 180" stroke="#1e102d" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Right Energy Scythe Blade */}
          <path
            d="M 175 175 Q 215 170 210 230"
            fill="none"
            stroke={primaryGlow}
            strokeWidth="4"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_#f43f5e]"
          />
          <path
            d="M 175 175 Q 215 170 210 230"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Impressing Cosmic Head & Horned Cyber-Crown */}
        <g>
          {/* Neck collar */}
          <polygon points="95,85 125,85 120,70 100,70" fill="#1e102d" stroke="#e11d48" strokeWidth="1.5" />

          {/* Helmet Base */}
          <polygon
            points="110,25 135,45 130,75 110,88 90,75 85,45"
            fill="url(#villainArmor)"
            stroke={primaryGlow}
            strokeWidth="2.5"
          />

          {/* Crown Horns / Dimensional Crystals (The Architect's Fractal Spikes) */}
          <polygon points="110,12 116,28 104,28" fill="#e11d48" stroke="#ffffff" strokeWidth="1" />
          <polygon points="85,38 65,15 90,32" fill="#7e22ce" stroke={primaryGlow} strokeWidth="1.5" />
          <polygon points="135,38 155,15 130,32" fill="#7e22ce" stroke={primaryGlow} strokeWidth="1.5" />
          <polygon points="78,55 55,42 82,50" fill="#090d16" stroke={secondaryColor} strokeWidth="1" />
          <polygon points="142,55 165,42 138,50" fill="#090d16" stroke={secondaryColor} strokeWidth="1" />

          {/* Dual Optical Visor Slots (Not a map pin!) */}
          <polygon points="96,52 106,56 106,62 96,58" fill={primaryGlow} className="animate-pulse" />
          <polygon points="124,52 114,56 114,62 124,58" fill={primaryGlow} className="animate-pulse" />
          <circle cx="101" cy="57" r="1.5" fill="#ffffff" />
          <circle cx="119" cy="57" r="1.5" fill="#ffffff" />

          {/* Vertical Dimensional Crack on Mask */}
          <line x1="110" y1="35" x2="110" y2="52" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="110" y1="65" x2="110" y2="82" stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
