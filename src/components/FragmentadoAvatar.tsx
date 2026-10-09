import React from 'react';

export type EnemyAnimState = 'idle' | 'telegraph' | 'attack' | 'hit' | 'stagger' | 'phaseTransition';

interface FragmentadoAvatarProps {
  state?: EnemyAnimState;
  isBoss?: boolean;
  bossPhase?: number;
  bossType?: 'NORMAL' | 'GUARDIAN' | 'AVATAR' | 'ARCHITECT';
  enemyName?: string;
  avatarType?: 'rasgador' | 'eco' | 'sentinela' | 'guardiao' | 'avatar' | 'arquiteto' | 'cartografo' | 'vigia' | 'predador' | 'prototipo';
}

export const FragmentadoAvatar: React.FC<FragmentadoAvatarProps> = ({
  state = 'idle',
  isBoss = false,
  bossPhase = 1,
  bossType = 'NORMAL',
  enemyName = '',
  avatarType,
}) => {
  const norm = (enemyName || '').toUpperCase();

  // Distinct Villain Architectures
  const isArquiteto = avatarType === 'arquiteto' || bossType === 'ARCHITECT' || norm.includes('ARQUITETO');
  const isAvatarRuptura = avatarType === 'avatar' || norm.includes('AVATAR DA RUPTURA');
  const isCartografo = avatarType === 'cartografo' || norm.includes('CARTÓGRAFO') || norm.includes('CARTOGRAFO');
  const isSentinelaEpsilon = norm.includes('ÉPSILON') || norm.includes('EPSILON') || norm.includes('BALUARTE DE ÉPSILON');
  const isGuardiaoIndustrial = avatarType === 'guardiao' || norm.includes('GUARDIÃO INDUSTRIAL') || norm.includes('GUARDAO');
  const isVigia = avatarType === 'vigia' || norm.includes('VIGIA INDUSTRIAL') || norm.includes('VIGIA');
  const isPredadorEstacao = avatarType === 'predador' || norm.includes('PREDADOR DA ESTAÇÃO') || norm.includes('PREDADOR');
  const isPrototipo = avatarType === 'prototipo' || norm.includes('PROTÓTIPO') || norm.includes('PROTOTIPO');
  const isEco = avatarType === 'eco' || norm.includes('ECO PRIMORDIAL') || norm.includes('ECO DE ARCÁDIA') || norm.includes('ESPELHO QUÂNTICO');
  const isRasgadorAlfa = norm.includes('RASGADOR ALFA');
  const isRasgador = avatarType === 'rasgador' || norm.includes('RASGADOR');

  // Animation offsets
  let animClass = '';
  if (state === 'attack') {
    animClass = '-translate-x-12 scale-110 rotate-1';
  } else if (state === 'hit') {
    animClass = 'translate-x-7 scale-95 opacity-75 blur-[0.5px]';
  } else if (state === 'telegraph') {
    animClass = 'scale-105 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.85)] animate-pulse';
  } else if (state === 'stagger') {
    animClass = 'translate-y-4 opacity-70 rotate-3';
  } else if (state === 'phaseTransition') {
    animClass = 'scale-125 filter drop-shadow-[0_0_35px_rgba(168,85,247,0.9)] animate-bounce';
  }

  // ==========================================
  // 1. O ARQUITETO (MULTIVERSAL ENTITY)
  // Crown of tesseracts, imperial geometry, golden-crimson wings
  // ==========================================
  if (isArquiteto) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #e11d48 0%, #a855f7 40%, #fbbf24 70%, transparent 90%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_30px_rgba(225,29,72,0.8)]">
          <defs>
            <linearGradient id="arqArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e102d" />
              <stop offset="50%" stopColor="#4c0519" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id="arqSing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fbbf24" />
              <stop offset="65%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Imperial Geometric Tesseract Wings */}
          <polygon points="110,60 15,30 35,90 10,130 55,140" fill="rgba(76,5,25,0.75)" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="110,60 205,30 185,90 210,130 165,140" fill="rgba(76,5,25,0.75)" stroke="#fbbf24" strokeWidth="2" />

          {/* Floating Spatial Crown */}
          <polygon points="90,30 110,8 130,30 142,18 125,45 95,45 78,18" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />

          {/* Architect Grand Torso */}
          <path d="M 80 65 L 140 65 L 155 155 L 125 225 L 95 225 L 65 155 Z" fill="url(#arqArmor)" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="85" y1="90" x2="135" y2="90" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="90" y1="170" x2="130" y2="170" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Imperial Visor (Pure Starlight) */}
          <polygon points="95,45 125,45 120,62 100,62" fill="#030712" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="110" cy="54" r="4" fill="#ffffff" className="animate-pulse" />

          {/* Ultimate Multiversal Singularity Core */}
          <circle cx="110" cy="125" r="26" fill="url(#arqSing)" className="animate-pulse" />
          <ellipse cx="110" cy="125" rx="30" ry="10" fill="none" stroke="#ffffff" strokeWidth="2" transform="rotate(30 110 125)" className="animate-spin" style={{ transformOrigin: '110px 125px', animationDuration: '8s' }} />
          <ellipse cx="110" cy="125" rx="30" ry="10" fill="none" stroke="#fbbf24" strokeWidth="2" transform="rotate(-30 110 125)" className="animate-spin" style={{ transformOrigin: '110px 125px', animationDuration: '8s' }} />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 2. AVATAR DA RUPTURA (MARCO ZERO APOTHEOSIS)
  // Crimson void silhouette with four floating crystal shards and energy vortex
  // ==========================================
  if (isAvatarRuptura) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #f43f5e 0%, #8b5cf6 50%, #06b6d4 80%, transparent 95%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_28px_rgba(244,63,94,0.7)]">
          <defs>
            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#4c0519" />
              <stop offset="100%" stopColor="#1e102d" />
            </linearGradient>
            <radialGradient id="vortexCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#f43f5e" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Floating Tachyon Shards */}
          <polygon points="30,40 45,20 40,55" fill="#f43f5e" className="animate-bounce" />
          <polygon points="190,40 205,20 200,55" fill="#8b5cf6" className="animate-bounce" />
          <polygon points="20,150 40,135 30,170" fill="#06b6d4" className="animate-pulse" />
          <polygon points="195,150 215,135 205,170" fill="#f43f5e" className="animate-pulse" />

          {/* Spiked Horned Mantle */}
          <path d="M 110 30 L 60 70 L 40 120 L 70 140 L 60 220 L 110 240 L 160 220 L 150 140 L 180 120 L 160 70 Z" fill="url(#avatarGrad)" stroke="#f43f5e" strokeWidth="2.5" />
          
          {/* Dual Horns of Singularity */}
          <path d="M 85 45 L 65 15 L 85 30 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
          <path d="M 135 45 L 155 15 L 135 30 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />

          {/* Mask with 3 Glowing Optical slits */}
          <polygon points="110,50 90,80 110,95 130,80" fill="#020617" stroke="#8b5cf6" strokeWidth="2" />
          <line x1="98" y1="68" x2="122" y2="68" stroke="#ffffff" strokeWidth="2" />
          <circle cx="110" cy="80" r="3" fill="#f43f5e" className="animate-pulse" />

          {/* Central Vortex Eye */}
          <circle cx="110" cy="145" r="22" fill="url(#vortexCore)" className="animate-pulse" />
          <ellipse cx="110" cy="145" rx="30" ry="12" fill="none" stroke="#ffffff" strokeWidth="2" className="animate-spin" style={{ transformOrigin: '110px 145px', animationDuration: '6s' }} />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 3. O CARTÓGRAFO DO VAZIO (ASTRAL COMPASS NAVIGATOR)
  // Rotating astrolabe, celestial compass needles, twin void sabers
  // ==========================================
  if (isCartografo) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
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

          {/* Astrolabe Rings */}
          <ellipse cx="110" cy="130" rx="90" ry="90" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" className="animate-spin" style={{ transformOrigin: '110px 130px', animationDuration: '18s' }} />
          <ellipse cx="110" cy="130" rx="75" ry="32" fill="none" stroke="#c084fc" strokeWidth="1.5" transform="rotate(35 110 130)" opacity="0.75" />
          <ellipse cx="110" cy="130" rx="75" ry="32" fill="none" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(-35 110 130)" opacity="0.75" />

          {/* Astrolabe Needles */}
          <polygon points="110,25 118,130 110,140 102,130" fill="#38bdf8" opacity="0.9" />
          <polygon points="110,235 118,130 110,120 102,130" fill="#8b5cf6" opacity="0.9" />
          <polygon points="25,130 130,122 140,130 130,138" fill="#38bdf8" opacity="0.8" />
          <polygon points="195,130 130,122 120,130 130,138" fill="#c084fc" opacity="0.8" />

          {/* Shroud Robes */}
          <path d="M 110 70 L 60 110 L 75 220 L 110 240 L 145 220 L 160 110 Z" fill="url(#cartoMetal)" stroke="#8b5cf6" strokeWidth="2" />
          
          {/* Dual Void Blades */}
          <path d="M 45 100 Q 20 150 40 210 Q 55 160 52 100 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />
          <path d="M 175 100 Q 200 150 180 210 Q 165 160 168 100 Z" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" opacity="0.9" />

          {/* Void Mask */}
          <polygon points="110,65 85,95 110,115 135,95" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="110" cy="92" r="6" fill="#ffffff" className="animate-pulse" />

          {/* Star Core Singularity */}
          <circle cx="110" cy="150" r="16" fill="url(#starCore)" className="animate-pulse" />
          <circle cx="110" cy="150" r="10" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 4. GUARDIÃO INDUSTRIAL / COLOSSO DE ÉPSILON (HEAVY MECH BASTION)
  // Massive pauldrons, rail cannon arm, heavy shield barrier, exhaust pipes
  // ==========================================
  if (isGuardiaoIndustrial || isSentinelaEpsilon) {
    const isGold = isSentinelaEpsilon;
    const accentCol = isGold ? '#eab308' : '#f59e0b';
    const subCol = isGold ? '#10b981' : '#ef4444';

    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-45 pointer-events-none animate-pulse"
          style={{ background: `radial-gradient(circle, ${accentCol} 0%, #3b82f6 50%, transparent 75%)` }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10" style={{ filter: `drop-shadow(0 0 25px ${accentCol})` }}>
          <defs>
            <linearGradient id="sentinelArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="40%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <radialGradient id="antimatterReactor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor={accentCol} />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Monolithic Pauldrons */}
          <polygon points="30,80 80,60 70,140 20,130" fill="url(#sentinelArmor)" stroke={accentCol} strokeWidth="2.5" />
          <polygon points="190,80 140,60 150,140 200,130" fill="url(#sentinelArmor)" stroke={accentCol} strokeWidth="2.5" />

          {/* Colossal Chassis */}
          <polygon points="75,70 145,70 160,180 110,230 60,180" fill="url(#sentinelArmor)" stroke={accentCol} strokeWidth="2.5" />

          {/* Heavy Monolithic Kinetic Shield Barrier (Left Arm) */}
          <polygon points="12,95 45,75 50,185 8,165" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
          <line x1="28" y1="90" x2="28" y2="170" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

          {/* Antimatter Rail Cannon (Right Arm) */}
          <rect x="170" y="85" width="24" height="95" rx="4" fill="#0f172a" stroke={accentCol} strokeWidth="2" />
          <circle cx="182" cy="185" r="7" fill={accentCol} className="animate-pulse" />

          {/* Helmet with Optical Monocular Sensor */}
          <polygon points="90,50 130,50 125,75 95,75" fill="#020617" stroke={accentCol} strokeWidth="2" />
          <rect x="98" y="58" width="24" height="6" rx="2" fill={subCol} className="animate-pulse" />

          {/* Glowing Reactor Core */}
          <circle cx="110" cy="135" r="22" fill="url(#antimatterReactor)" className="animate-pulse" />
          <circle cx="110" cy="135" r="8" fill="#ffffff" />

          {/* Exhaust Vents */}
          <line x1="85" y1="180" x2="85" y2="205" stroke={accentCol} strokeWidth="3" />
          <line x1="110" y1="185" x2="110" y2="215" stroke={accentCol} strokeWidth="3" />
          <line x1="135" y1="180" x2="135" y2="205" stroke={accentCol} strokeWidth="3" />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 5. O ECO PRIMORDIAL (DARK CHROMATIC KAEL REFLECTION)
  // Fractured halo, dual chromatic tachyon blades, reversed armor
  // ==========================================
  if (isEco) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
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

          {/* Fractured Temporal Halo Ring */}
          <polygon points="110,20 145,35 155,70 130,95 90,95 65,70 75,35" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4 3" className="animate-spin" style={{ transformOrigin: '110px 55px', animationDuration: '10s' }} />

          {/* Ghostly Offsets */}
          <path d="M 85 85 L 135 85 L 145 160 L 125 210 L 95 210 L 75 160 Z" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.3" transform="translate(-4, 0)" />
          <path d="M 85 85 L 135 85 L 145 160 L 125 210 L 95 210 L 75 160 Z" fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.3" transform="translate(4, 0)" />

          {/* Dark Exosuit Torso */}
          <path d="M 85 85 L 135 85 L 145 160 L 125 210 L 95 210 L 75 160 Z" fill="url(#ecoShadow)" stroke="#ec4899" strokeWidth="2" />

          {/* Dual Tachyon Blades */}
          <path d="M 60 110 L 25 180 L 35 185 L 68 120 Z" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
          <path d="M 160 110 L 195 180 L 185 185 L 152 120 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />

          {/* Visor */}
          <polygon points="95,50 125,50 130,75 90,75" fill="#030712" stroke="#ec4899" strokeWidth="2" />
          <line x1="95" y1="62" x2="125" y2="62" stroke="#ffffff" strokeWidth="2" />

          {/* Core Singularity */}
          <circle cx="110" cy="135" r="18" fill="url(#ecoTachyon)" className="animate-pulse" />
          <circle cx="110" cy="135" r="6" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 6. O VIGIA INDUSTRIAL (SURVEILLANCE BEAM SENTRY)
  // Hovering scout drone tripod, massive searchlight ocular lens, high-frequency antenna
  // ==========================================
  if (isVigia) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-45 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, #0284c7 50%, transparent 75%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_20px_rgba(56,189,248,0.7)]">
          {/* Sentry Floating Dome Head */}
          <circle cx="110" cy="90" r="45" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
          
          {/* Main Giant Searchlight Ocular Eye */}
          <circle cx="110" cy="90" r="28" fill="#0284c7" className="animate-pulse" />
          <circle cx="110" cy="90" r="18" fill="#38bdf8" />
          <circle cx="110" cy="90" r="8" fill="#ffffff" />

          {/* High frequency radar dish antenna on top */}
          <line x1="110" y1="45" x2="110" y2="15" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="110" cy="15" r="5" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '2s' }} />

          {/* Heavy tripod stabilization legs */}
          <path d="M 75 115 L 40 195 L 30 230" stroke="#334155" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M 145 115 L 180 195 L 190 230" stroke="#334155" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M 110 135 L 110 210 L 105 235" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" fill="none" />

          {/* Beam projector emitter under lens */}
          <polygon points="95,130 125,130 118,155 102,155" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 7. PREDADOR DA ESTAÇÃO / PROTÓTIPO INSTÁVEL (BEAST/PARASITE ANOMALY)
  // Quadruped insectoid raptor silhouette with glowing mandibles
  // ==========================================
  if (isPredadorEstacao || isPrototipo) {
    const isProto = isPrototipo;
    const bodyColor = isProto ? '#052e16' : '#2e1065';
    const glowColor = isProto ? '#10b981' : '#c084fc';

    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-45 pointer-events-none animate-pulse"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10" style={{ filter: `drop-shadow(0 0 20px ${glowColor})` }}>
          {/* Insectoid Arched Body */}
          <path d="M 50 160 Q 70 80 140 100 Q 180 115 195 90 Q 185 140 120 170 Z" fill={bodyColor} stroke={glowColor} strokeWidth="2.5" />

          {/* Multiple Glowing Compound Eyes */}
          <circle cx="180" cy="98" r="4" fill="#ffffff" className="animate-pulse" />
          <circle cx="172" cy="92" r="3" fill="#ffffff" className="animate-pulse" />
          <circle cx="186" cy="106" r="3" fill="#ffffff" className="animate-pulse" />

          {/* Curved Razor Claws (Forelegs) */}
          <path d="M 130 130 L 160 180 L 190 220" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 90 145 L 80 190 L 60 225" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 60 155 L 40 195 L 20 215" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Bio-energy Spine Spikes */}
          <polygon points="90,85 100,60 110,85" fill={glowColor} />
          <polygon points="120,95 130,70 140,95" fill={glowColor} />
          <polygon points="150,105 160,80 170,105" fill={glowColor} />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 8. O RASGADOR ALFA / RASGADOR (BIPEDAL BLADE STALKER)
  // Sharp scythe arms, fractured ribcage, jagged jaw visor
  // ==========================================
  const isAlfa = isRasgadorAlfa || isBoss;
  const primGlow = isAlfa ? '#f43f5e' : '#ec4899';
  const secCol = isAlfa ? '#fbbf24' : '#06b6d4';

  return (
    <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none animate-pulse"
        style={{
          background: `radial-gradient(circle, ${primGlow} 0%, ${secCol} 50%, transparent 70%)`,
        }}
      />

      <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10" style={{ filter: `drop-shadow(0 0 25px ${primGlow})` }}>
        <defs>
          <linearGradient id="rasgArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="45%" stopColor="#1e102d" />
            <stop offset="85%" stopColor="#4c0519" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          <radialGradient id="rasgCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor={primGlow} />
            <stop offset="75%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <ellipse cx="110" cy="245" rx="75" ry="14" fill="rgba(225, 29, 72, 0.25)" className="animate-pulse" />

        {/* Energy Scythe Ribs */}
        <path d="M 110 95 L 45 40 L 60 90 L 20 85 L 50 120 L 15 150 L 65 155 Z" fill="rgba(30, 16, 45, 0.75)" stroke={primGlow} strokeWidth="2" />
        <path d="M 110 95 L 175 40 L 160 90 L 200 85 L 170 120 L 205 150 L 155 155 Z" fill="rgba(30, 16, 45, 0.75)" stroke={primGlow} strokeWidth="2" />

        {/* Armor Torso */}
        <path d="M 80 85 L 140 85 L 150 140 L 130 195 L 90 195 L 70 140 Z" fill="url(#rasgArmor)" stroke={secCol} strokeWidth="2" />

        {/* Jagged Jaw Head */}
        <polygon points="95,45 125,45 135,78 110,95 85,78" fill="#0f172a" stroke={primGlow} strokeWidth="2" />
        <polygon points="100,65 120,65 110,75" fill={secCol} className="animate-pulse" />

        {/* Ribcage Plates */}
        <line x1="85" y1="125" x2="100" y2="135" stroke="#e11d48" strokeWidth="2" />
        <line x1="135" y1="125" x2="120" y2="135" stroke="#e11d48" strokeWidth="2" />

        {/* Central Rift Singularity */}
        <circle cx="110" cy="135" r="22" fill="url(#rasgCore)" className="animate-pulse" />
        <ellipse cx="110" cy="135" rx="22" ry="9" fill="none" stroke="#ffffff" strokeWidth="1.5" transform="rotate(25 110 135)" className="animate-spin" style={{ transformOrigin: '110px 135px', animationDuration: '6s' }} />
      </svg>
    </div>
  );
};
