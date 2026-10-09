import React from 'react';

export type EnemyAnimState = 'idle' | 'telegraph' | 'attack' | 'hit' | 'stagger' | 'phaseTransition';

interface FragmentadoAvatarProps {
  state?: EnemyAnimState;
  isBoss?: boolean;
  bossPhase?: number;
  bossType?: 'NORMAL' | 'GUARDIAN' | 'AVATAR' | 'ARCHITECT';
  enemyName?: string;
  avatarType?: 'rasgador' | 'eco' | 'sentinela' | 'guardiao' | 'avatar' | 'arquiteto' | 'cartografo';
}

export const FragmentadoAvatar: React.FC<FragmentadoAvatarProps> = ({
  state = 'idle',
  isBoss = false,
  bossPhase = 1,
  bossType = 'NORMAL',
  enemyName = '',
  avatarType,
}) => {
  // Infer enemy archetype from name or prop
  const normalizedName = enemyName.toUpperCase();
  const isCartografo = avatarType === 'cartografo' || normalizedName.includes('CARTÓGRAFO') || normalizedName.includes('CARTOGRAFO');
  const isSentinela = avatarType === 'sentinela' || normalizedName.includes('SENTINELA') || normalizedName.includes('GUARDIÃO INDUSTRIAL') || normalizedName.includes('GUARDAO');
  const isEco = avatarType === 'eco' || normalizedName.includes('ECO PRIMORDIAL') || normalizedName.includes('ESPELHO QUÂNTICO');
  const isArquiteto = avatarType === 'arquiteto' || bossType === 'ARCHITECT' || normalizedName.includes('ARQUITETO');

  // Animation classes
  let animClass = '';
  if (state === 'attack') {
    animClass = '-translate-x-12 scale-110 rotate-1';
  } else if (state === 'hit') {
    animClass = 'translate-x-7 scale-95 opacity-75 blur-[0.5px]';
  } else if (state === 'telegraph') {
    animClass = 'scale-105 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse';
  } else if (state === 'stagger') {
    animClass = 'translate-y-4 opacity-70 rotate-3';
  } else if (state === 'phaseTransition') {
    animClass = 'scale-125 filter drop-shadow-[0_0_35px_rgba(168,85,247,0.9)] animate-bounce';
  }

  // --- 1. O CARTÓGRAFO DO VAZIO ---
  if (isCartografo) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        {/* Stellar nebula backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, #38bdf8 50%, transparent 75%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
          <defs>
            <linearGradient id="cartoMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b0f19" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Celestial Grid / Astrolabe Rings */}
          <ellipse cx="110" cy="130" rx="90" ry="90" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" className="animate-spin" style={{ transformOrigin: '110px 130px', animationDuration: '18s' }} />
          <ellipse cx="110" cy="130" rx="75" ry="32" fill="none" stroke="#c084fc" strokeWidth="1.5" transform="rotate(35 110 130)" opacity="0.75" />
          <ellipse cx="110" cy="130" rx="75" ry="32" fill="none" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(-35 110 130)" opacity="0.75" />

          {/* Void Astrolabe Compass Needles */}
          <polygon points="110,25 118,130 110,140 102,130" fill="#38bdf8" opacity="0.9" />
          <polygon points="110,235 118,130 110,120 102,130" fill="#8b5cf6" opacity="0.9" />
          <polygon points="25,130 130,122 140,130 130,138" fill="#38bdf8" opacity="0.8" />
          <polygon points="195,130 130,122 120,130 130,138" fill="#c084fc" opacity="0.8" />

          {/* Shroud / Robes of the Void Navigator */}
          <path d="M 110 70 L 60 110 L 75 220 L 110 240 L 145 220 L 160 110 Z" fill="url(#cartoMetal)" stroke="#8b5cf6" strokeWidth="2" />
          
          {/* Dual Astral Void Blades */}
          <path d="M 45 100 Q 20 150 40 210 Q 55 160 52 100 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />
          <path d="M 175 100 Q 200 150 180 210 Q 165 160 168 100 Z" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" opacity="0.9" />

          {/* Faceless Visage / Void Mask */}
          <polygon points="110,65 85,95 110,115 135,95" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="110" cy="92" r="6" fill="#ffffff" className="animate-pulse" />

          {/* Central Cosmic Singularity */}
          <circle cx="110" cy="150" r="16" fill="url(#starCore)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="110" cy="150" r="12" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // --- 2. A SENTINELA DE ÉPSILON ---
  if (isSentinela) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        {/* Heavy amber/reactor glow backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-45 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, #3b82f6 50%, transparent 75%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]">
          <defs>
            <linearGradient id="sentinelArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="40%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <radialGradient id="antimatterReactor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Heavy Monolithic Pauldrons & Bastion Plating */}
          <polygon points="30,80 80,60 70,140 20,130" fill="url(#sentinelArmor)" stroke="#f59e0b" strokeWidth="2.5" />
          <polygon points="190,80 140,60 150,140 200,130" fill="url(#sentinelArmor)" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Colossal Chassis */}
          <polygon points="75,70 145,70 160,180 110,230 60,180" fill="url(#sentinelArmor)" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Heavy Monolithic Kinetic Shield Barrier (Left Arm) */}
          <polygon points="15,95 45,75 50,185 10,165" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
          <line x1="30" y1="90" x2="30" y2="170" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

          {/* Antimatter Rail Cannon (Right Arm) */}
          <rect x="170" y="85" width="22" height="95" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="181" cy="185" r="7" fill="#f59e0b" className="animate-pulse" />

          {/* Helmet with Optical Monocular Sensor */}
          <polygon points="90,50 130,50 125,75 95,75" fill="#020617" stroke="#f59e0b" strokeWidth="2" />
          <rect x="98" y="58" width="24" height="6" rx="2" fill="#ef4444" className="animate-pulse" />

          {/* Glowing Antimatter Core */}
          <circle cx="110" cy="135" r="22" fill="url(#antimatterReactor)" className="animate-pulse" />
          <circle cx="110" cy="135" r="8" fill="#ffffff" />

          {/* Heavy exhaust vents */}
          <line x1="85" y1="180" x2="85" y2="205" stroke="#f59e0b" strokeWidth="3" />
          <line x1="110" y1="185" x2="110" y2="215" stroke="#f59e0b" strokeWidth="3" />
          <line x1="135" y1="180" x2="135" y2="205" stroke="#f59e0b" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  // --- 3. O ECO PRIMORDIAL (DARK CHROMATIC KAEL REFLECTION) ---
  if (isEco) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        {/* Chromatic distortion backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #e11d48 0%, #06b6d4 50%, #8b5cf6 75%, transparent 90%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_25px_rgba(225,29,72,0.7)]">
          <defs>
            <linearGradient id="ecoShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#050505" />
              <stop offset="50%" stopColor="#1e102d" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
            <radialGradient id="ecoTachyon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#ec4899" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Fractured Temporal Halo Ring (Pre-Collapse Tesseract) */}
          <polygon points="110,20 145,35 155,70 130,95 90,95 65,70 75,35" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4 3" className="animate-spin" style={{ transformOrigin: '110px 55px', animationDuration: '10s' }} />

          {/* Ghostly Chromatic Echo Offsets */}
          <g opacity="0.4" transform="translate(-4, 0)">
            <path d="M 85 85 L 135 85 L 145 160 L 125 210 L 95 210 L 75 160 Z" fill="none" stroke="#06b6d4" strokeWidth="2" />
          </g>
          <g opacity="0.4" transform="translate(4, 0)">
            <path d="M 85 85 L 135 85 L 145 160 L 125 210 L 95 210 L 75 160 Z" fill="none" stroke="#f43f5e" strokeWidth="2" />
          </g>

          {/* Dark Exosuit Torso (Mirrors Kael's armor) */}
          <path d="M 85 85 L 135 85 L 145 160 L 125 210 L 95 210 L 75 160 Z" fill="url(#ecoShadow)" stroke="#ec4899" strokeWidth="2" />

          {/* Dark Tachyon Dual Kael Blades */}
          <path d="M 60 110 L 25 180 L 35 185 L 68 120 Z" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
          <path d="M 160 110 L 195 180 L 185 185 L 152 120 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />

          {/* Fractured Visor */}
          <polygon points="95,50 125,50 130,75 90,75" fill="#030712" stroke="#ec4899" strokeWidth="2" />
          <line x1="95" y1="62" x2="125" y2="62" stroke="#ffffff" strokeWidth="2" />
          <line x1="110" y1="52" x2="108" y2="72" stroke="#06b6d4" strokeWidth="1.5" />

          {/* Tachyon Core Singularity */}
          <circle cx="110" cy="135" r="18" fill="url(#ecoTachyon)" className="animate-pulse" />
          <circle cx="110" cy="135" r="6" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // --- 4. O ARQUITETO (MULTIVERSAL CONVERGENCE ENTITY) ---
  if (isArquiteto) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        {/* Cosmic convergence backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #e11d48 0%, #a855f7 40%, #fbbf24 70%, transparent 90%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_30px_rgba(225,29,72,0.8)]">
          <defs>
            <linearGradient id="architectGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e102d" />
              <stop offset="50%" stopColor="#4c0519" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id="architectSingularity" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fbbf24" />
              <stop offset="65%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Imperial Geometric Tesseract Wings */}
          <polygon points="110,60 15,30 35,90 10,130 55,140" fill="rgba(76,5,25,0.7)" stroke="#fbbf24" strokeWidth="1.5" />
          <polygon points="110,60 205,30 185,90 210,130 165,140" fill="rgba(76,5,25,0.7)" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Floating Spatial Crown */}
          <polygon points="90,30 110,10 130,30 140,20 125,45 95,45 80,20" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />

          {/* Architect Grand Armor */}
          <path d="M 80 65 L 140 65 L 155 155 L 125 225 L 95 225 L 65 155 Z" fill="url(#architectGold)" stroke="#fbbf24" strokeWidth="2.5" />

          {/* Ornate Gold Filigree Lines */}
          <line x1="85" y1="90" x2="135" y2="90" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="90" y1="170" x2="130" y2="170" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Imperial Visor (Pure Starlight) */}
          <polygon points="95,45 125,45 120,62 100,62" fill="#030712" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="110" cy="54" r="4" fill="#ffffff" className="animate-pulse" />

          {/* Ultimate Multiversal Singularity Core */}
          <circle cx="110" cy="125" r="26" fill="url(#architectSingularity)" className="animate-pulse" />
          <ellipse cx="110" cy="125" rx="28" ry="10" fill="none" stroke="#ffffff" strokeWidth="2" transform="rotate(30 110 125)" className="animate-spin" style={{ transformOrigin: '110px 125px' }} />
          <ellipse cx="110" cy="125" rx="28" ry="10" fill="none" stroke="#fbbf24" strokeWidth="2" transform="rotate(-30 110 125)" className="animate-spin" style={{ transformOrigin: '110px 125px' }} />
        </svg>
      </div>
    );
  }

  // --- 5. O FRAGMENTADO STANDARD / ANOMALIA BIOMECÂNICA ---
  const primaryGlow = isBoss ? '#f43f5e' : '#ec4899';
  const secondaryColor = bossPhase >= 2 ? '#a855f7' : '#06b6d4';
  const coreGlow = bossPhase === 3 ? '#fbbf24' : primaryGlow;

  return (
    <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
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
          <linearGradient id="villainArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="45%" stopColor="#1e102d" />
            <stop offset="85%" stopColor="#4c0519" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          <radialGradient id="riftCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor={coreGlow} />
            <stop offset="65%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <linearGradient id="shardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>

        <ellipse cx="110" cy="245" rx="75" ry="14" fill="rgba(225, 29, 72, 0.25)" className="animate-pulse" />

        {/* Floating Crystalline Shards */}
        <g className="animate-pulse">
          <polygon points="25,45 40,25 35,55" fill="url(#shardGrad)" opacity="0.8" />
          <polygon points="195,50 210,30 200,60" fill="url(#shardGrad)" opacity="0.8" />
          <polygon points="15,130 30,115 22,145" fill="url(#shardGrad)" opacity="0.7" />
          <polygon points="195,140 215,120 205,155" fill="url(#shardGrad)" opacity="0.7" />
        </g>

        {/* Energy Ribs */}
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

        {/* Armor Torso */}
        <path
          d="M 80 85 L 140 85 L 150 140 L 130 195 L 90 195 L 70 140 Z"
          fill="url(#villainArmor)"
          stroke={secondaryColor}
          strokeWidth="2"
        />

        {/* Ribcage Plates */}
        <line x1="85" y1="125" x2="100" y2="135" stroke="#e11d48" strokeWidth="2" />
        <line x1="135" y1="125" x2="120" y2="135" stroke="#e11d48" strokeWidth="2" />
        <line x1="88" y1="145" x2="102" y2="155" stroke="#e11d48" strokeWidth="2" />
        <line x1="132" y1="145" x2="118" y2="155" stroke="#e11d48" strokeWidth="2" />

        {/* Central Rift Singularity */}
        <circle cx="110" cy="135" r="24" fill="url(#riftCore)" className="animate-pulse" />
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
      </svg>
    </div>
  );
};
