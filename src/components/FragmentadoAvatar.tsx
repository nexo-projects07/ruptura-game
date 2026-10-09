import React from 'react';
import type { EnemyVisualId } from '../types/game';

export type EnemyAnimState = 'idle' | 'telegraph' | 'attack' | 'hit' | 'stagger' | 'phaseTransition';

interface FragmentadoAvatarProps {
  state?: EnemyAnimState;
  isBoss?: boolean;
  bossPhase?: number;
  bossType?: 'NORMAL' | 'GUARDIAN' | 'AVATAR' | 'ARCHITECT';
  enemyName?: string;
  avatarType?: EnemyVisualId;
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
  const isSovereign = avatarType === 'convergence_sovereign' || norm.includes('SOBERANO DA CONVERGÊNCIA');
  const isArquiteto = !isSovereign && (avatarType === 'arquiteto' || bossType === 'ARCHITECT' || norm.includes('ARQUITETO'));
  const isAvatarRuptura = avatarType === 'avatar' || norm.includes('AVATAR DA RUPTURA');
  const isCartografo = avatarType === 'cartografo' || norm.includes('CARTÓGRAFO') || norm.includes('CARTOGRAFO');
  const isSentinelaIndustrial = norm.includes('SENTINELA INDUSTRIAL');
  const isSentinelaEpsilon = norm.includes('ÉPSILON') || norm.includes('EPSILON') || norm.includes('BALUARTE DE ÉPSILON');
  const isGuardiaoIndustrial = avatarType === 'guardiao' || norm.includes('GUARDIÃO INDUSTRIAL') || norm.includes('GUARDAO');
  const isVigia = avatarType === 'vigia' || norm.includes('VIGIA INDUSTRIAL') || norm.includes('VIGIA');
  const isPredadorEstacao = avatarType === 'predador' || norm.includes('PREDADOR DA ESTAÇÃO') || norm.includes('PREDADOR');
  const isPrototipo = avatarType === 'prototipo' || norm.includes('PROTÓTIPO') || norm.includes('PROTOTIPO');
  const isEcoPrimordial = norm.includes('ECO PRIMORDIAL');
  const isEco = !isEcoPrimordial && (avatarType === 'eco' || norm.includes('ECO DE ARCÁDIA') || norm.includes('ESPELHO QUÂNTICO'));
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

  if (isSovereign) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div className="absolute inset-0 rounded-full blur-2xl opacity-55 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle, #67e8f9 0%, #e2e8f0 45%, #0f766e 78%, transparent 92%)' }} />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_28px_rgba(103,232,249,0.75)]">
          <defs>
            <linearGradient id="sovereignShell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ecfeff" />
              <stop offset="45%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
          </defs>
          <ellipse cx="110" cy="128" rx="92" ry="48" fill="none" stroke="#67e8f9" strokeWidth="2" transform="rotate(-34 110 128)" className="animate-spin" style={{ transformOrigin: '110px 128px', animationDuration: '12s' }} />
          <ellipse cx="110" cy="128" rx="82" ry="34" fill="none" stroke="#f8fafc" strokeWidth="2" transform="rotate(38 110 128)" className="animate-spin" style={{ transformOrigin: '110px 128px', animationDuration: '9s' }} />
          <path d="M 110 25 L 145 68 L 165 120 L 145 190 L 110 228 L 75 190 L 55 120 L 75 68 Z" fill="url(#sovereignShell)" stroke="#cffafe" strokeWidth="3" />
          <path d="M 82 76 L 110 56 L 138 76 L 128 100 L 92 100 Z" fill="#082f49" stroke="#67e8f9" strokeWidth="2" />
          <path d="M 110 103 L 138 132 L 110 165 L 82 132 Z" fill="#164e63" stroke="#f8fafc" strokeWidth="2" />
          <circle cx="110" cy="132" r="12" fill="#ffffff" className="animate-pulse" />
          <circle cx="110" cy="132" r="30" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="5 6" className="animate-spin" style={{ transformOrigin: '110px 132px', animationDuration: '5s' }} />
          <path d="M 75 158 L 34 190 M 145 158 L 186 190 M 84 184 L 64 233 M 136 184 L 156 233" stroke="#a5f3fc" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
    );
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

  // SENTINELA INDUSTRIAL (CONTAINMENT WALKER)
  if (isSentinelaIndustrial) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-45 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #f97316 0%, #7c2d12 50%, transparent 75%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_24px_rgba(249,115,22,0.7)]">
          <defs>
            <linearGradient id="industrialSentinelArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="55%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>
          </defs>
          <path d="M 75 95 L 55 175 L 30 215 M 145 95 L 165 175 L 190 215" stroke="#64748b" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M 82 75 L 138 75 L 155 155 L 135 190 L 85 190 L 65 155 Z" fill="url(#industrialSentinelArmor)" stroke="#f97316" strokeWidth="3" />
          <polygon points="55,82 82,70 78,125 45,140" fill="#1e293b" stroke="#fb923c" strokeWidth="2" />
          <polygon points="165,82 138,70 142,125 175,140" fill="#1e293b" stroke="#fb923c" strokeWidth="2" />
          <rect x="92" y="38" width="36" height="36" rx="5" fill="#0f172a" stroke="#f97316" strokeWidth="2.5" />
          <path d="M 99 55 L 121 55" stroke="#fde68a" strokeWidth="5" className="animate-pulse" />
          <circle cx="110" cy="125" r="17" fill="#c2410c" className="animate-pulse" />
          <circle cx="110" cy="125" r="7" fill="#fff7ed" />
          <path d="M 110 142 L 110 165 M 93 150 L 127 150" stroke="#fdba74" strokeWidth="2" />
          <rect x="172" y="115" width="18" height="58" rx="4" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="181" cy="165" r="5" fill="#7dd3fc" className="animate-ping" />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 2. AVATAR DA RUPTURA (MARCO ZERO APOTHEOSIS)
  // Crimson void silhouette with four floating crystal shards and energy vortex
  // ==========================================
  if (avatarType === 'containment_core') {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div className="absolute inset-0 rounded-full blur-2xl opacity-55 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle, #fb923c 0%, #7c2d12 52%, transparent 80%)' }} />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_24px_rgba(251,146,60,0.7)]">
          <polygon points="110,20 184,70 184,170 110,220 36,170 36,70" fill="#172033" fillOpacity="0.7" stroke="#fb923c" strokeWidth="4" className="animate-spin" style={{ transformOrigin: '110px 120px', animationDuration: '18s' }} />
          <polygon points="110,44 164,80 164,156 110,192 56,156 56,80" fill="#292524" stroke="#fbbf24" strokeWidth="3" />
          <rect x="83" y="73" width="54" height="94" rx="8" fill="#0f172a" stroke="#fdba74" strokeWidth="3" />
          <circle cx="110" cy="120" r="28" fill="#c2410c" className="animate-pulse" />
          <circle cx="110" cy="120" r="12" fill="#fff7ed" />
          <path d="M 83 91 L 58 62 M 137 91 L 162 62 M 83 149 L 58 178 M 137 149 L 162 178" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
          <path d="M 110 74 L 110 38 M 110 166 L 110 203" stroke="#fed7aa" strokeWidth="4" />
          <circle cx="110" cy="38" r="7" fill="#fef3c7" className="animate-ping" />
        </svg>
      </div>
    );
  }

  if (avatarType === 'commander_vertex') {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div className="absolute inset-0 rounded-full blur-2xl opacity-50 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle, #ef4444 0%, #1e3a8a 55%, transparent 80%)' }} />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_24px_rgba(239,68,68,0.7)]">
          <path d="M 84 76 L 35 42 L 50 110 L 20 160 L 75 142 M 136 76 L 185 42 L 170 110 L 200 160 L 145 142" fill="#172554" stroke="#ef4444" strokeWidth="3" />
          <path d="M 79 68 L 141 68 L 154 150 L 130 218 L 90 218 L 66 150 Z" fill="#1e293b" stroke="#fca5a5" strokeWidth="3" />
          <path d="M 90 54 L 110 25 L 130 54 L 124 79 L 96 79 Z" fill="#0f172a" stroke="#f87171" strokeWidth="3" />
          <path d="M 96 60 L 124 60" stroke="#fff1f2" strokeWidth="5" />
          <rect x="23" y="125" width="28" height="66" rx="5" fill="#334155" stroke="#fb7185" strokeWidth="3" />
          <rect x="169" y="125" width="28" height="66" rx="5" fill="#334155" stroke="#fb7185" strokeWidth="3" />
          <circle cx="110" cy="130" r="20" fill="#b91c1c" className="animate-pulse" />
          <polygon points="110,110 120,130 110,150 100,130" fill="#fee2e2" />
          <path d="M 91 159 L 110 176 L 129 159" fill="none" stroke="#fca5a5" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  if (avatarType === 'rift_admiral') {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div className="absolute inset-0 rounded-full blur-2xl opacity-50 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle, #c084fc 0%, #0f766e 50%, transparent 80%)' }} />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_24px_rgba(192,132,252,0.7)]">
          <ellipse cx="110" cy="58" rx="70" ry="28" fill="none" stroke="#c4b5fd" strokeWidth="2" transform="rotate(-20 110 58)" className="animate-spin" style={{ transformOrigin: '110px 58px', animationDuration: '10s' }} />
          <path d="M 110 30 L 130 70 L 110 92 L 90 70 Z" fill="#f0abfc" stroke="#fff" strokeWidth="2" />
          <path d="M 82 84 L 138 84 L 152 156 L 130 220 L 90 220 L 68 156 Z" fill="#134e4a" stroke="#5eead4" strokeWidth="3" />
          <path d="M 82 95 L 42 135 L 58 205 L 86 174 Z" fill="#312e81" stroke="#a78bfa" strokeWidth="2" />
          <path d="M 138 95 L 178 135 L 162 205 L 134 174 Z" fill="#312e81" stroke="#a78bfa" strokeWidth="2" />
          <polygon points="110,105 132,132 110,158 88,132" fill="#0f172a" stroke="#99f6e4" strokeWidth="2" />
          <circle cx="110" cy="132" r="8" fill="#fff" className="animate-pulse" />
          <path d="M 55 204 L 38 240 M 165 204 L 182 240" stroke="#5eead4" strokeWidth="6" strokeLinecap="round" />
          <circle cx="34" cy="82" r="9" fill="#c084fc" className="animate-ping" />
          <circle cx="186" cy="82" r="9" fill="#5eead4" className="animate-ping" />
        </svg>
      </div>
    );
  }

  if (avatarType === 'collapse_herald') {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div className="absolute inset-0 rounded-full blur-2xl opacity-55 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle, #a78bfa 0%, #581c87 54%, transparent 80%)' }} />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_25px_rgba(167,139,250,0.7)]">
          <path d="M 110 18 L 145 70 L 132 96 L 88 96 L 75 70 Z" fill="#1e1b4b" stroke="#c4b5fd" strokeWidth="3" />
          <path d="M 90 95 L 130 95 L 145 178 L 110 228 L 75 178 Z" fill="#09090b" stroke="#8b5cf6" strokeWidth="3" />
          <ellipse cx="110" cy="144" rx="52" ry="18" fill="none" stroke="#e9d5ff" strokeWidth="3" transform="rotate(62 110 144)" className="animate-spin" style={{ transformOrigin: '110px 144px', animationDuration: '7s' }} />
          <circle cx="110" cy="144" r="20" fill="#6b21a8" className="animate-pulse" />
          <circle cx="110" cy="144" r="7" fill="#fff" />
          <path d="M 84 112 L 38 148 L 71 157 M 136 112 L 182 148 L 149 157" fill="none" stroke="#c4b5fd" strokeWidth="7" strokeLinecap="round" />
          <path d="M 91 202 L 71 242 M 129 202 L 149 242" stroke="#a78bfa" strokeWidth="7" strokeLinecap="round" />
          <path d="M 88 64 L 110 42 L 132 64" fill="none" stroke="#f5d0fe" strokeWidth="3" />
        </svg>
      </div>
    );
  }

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

  // SENTINELA DE ÉPSILON (PRISMATIC FORTRESS)
  if (isSentinelaEpsilon) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-55 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #facc15 0%, #10b981 48%, transparent 78%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_26px_rgba(250,204,21,0.7)]">
          <defs>
            <linearGradient id="epsilonPrism" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ecfccb" />
              <stop offset="45%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
          </defs>
          <polygon points="110,18 126,48 110,70 94,48" fill="#facc15" stroke="#fef3c7" strokeWidth="2" className="animate-bounce" />
          <polygon points="35,72 60,82 68,110 48,125 25,105" fill="#065f46" stroke="#34d399" strokeWidth="2" />
          <polygon points="185,72 160,82 152,110 172,125 195,105" fill="#065f46" stroke="#34d399" strokeWidth="2" />
          <path d="M 110 62 L 148 95 L 140 175 L 110 220 L 80 175 L 72 95 Z" fill="url(#epsilonPrism)" stroke="#fef08a" strokeWidth="3" />
          <polygon points="110,86 132,115 110,150 88,115" fill="#022c22" stroke="#a7f3d0" strokeWidth="2" />
          <path d="M 98 112 L 110 102 L 122 112 L 110 127 Z" fill="#fef08a" className="animate-pulse" />
          <path d="M 86 160 L 110 176 L 134 160" fill="none" stroke="#ecfccb" strokeWidth="3" />
          <polygon points="55,165 73,150 70,187" fill="#facc15" className="animate-pulse" />
          <polygon points="165,165 147,150 150,187" fill="#34d399" className="animate-pulse" />
          <ellipse cx="110" cy="226" rx="58" ry="8" fill="none" stroke="#a3e635" strokeWidth="2" strokeDasharray="5 5" className="animate-spin" style={{ transformOrigin: '110px 226px', animationDuration: '8s' }} />
        </svg>
      </div>
    );
  }

  // ==========================================
  // 4. GUARDIÃO INDUSTRIAL / COLOSSO DE ÉPSILON (HEAVY MECH BASTION)
  // Massive pauldrons, rail cannon arm, heavy shield barrier, exhaust pipes
  // ==========================================
  if (isGuardiaoIndustrial) {
    const accentCol = '#f59e0b';
    const subCol = '#ef4444';

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
  if (isEcoPrimordial) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-55 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #22d3ee 0%, #c026d3 48%, #09090b 80%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_28px_rgba(34,211,238,0.65)]">
          <defs>
            <radialGradient id="primordialMirror" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#f0fdfa" />
              <stop offset="35%" stopColor="#22d3ee" />
              <stop offset="75%" stopColor="#a21caf" />
              <stop offset="100%" stopColor="#09090b" />
            </radialGradient>
          </defs>
          <ellipse cx="110" cy="130" rx="80" ry="104" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="9 7" className="animate-spin" style={{ transformOrigin: '110px 130px', animationDuration: '14s' }} />
          <polygon points="110,24 151,65 142,125 110,151 78,125 69,65" fill="#09090b" stroke="#c026d3" strokeWidth="3" />
          <path d="M 82 60 L 110 78 L 138 60 M 84 92 L 110 108 L 136 92" fill="none" stroke="#67e8f9" strokeWidth="3" />
          <path d="M 88 128 L 64 183 L 88 224 L 110 199 L 132 224 L 156 183 L 132 128 Z" fill="#18181b" stroke="#22d3ee" strokeWidth="2.5" />
          <circle cx="110" cy="151" r="27" fill="url(#primordialMirror)" className="animate-pulse" />
          <polygon points="110,132 126,151 110,171 94,151" fill="#fff" opacity="0.9" />
          <path d="M 68 118 L 38 165 L 60 158 M 152 118 L 182 165 L 160 158" stroke="#e879f9" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 90 222 L 78 246 M 130 222 L 142 246" stroke="#a5f3fc" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

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

  // RASGADOR ALFA (APEX STALKER)
  if (isRasgadorAlfa) {
    return (
      <div className={`relative transition-all duration-300 transform select-none ${animClass}`}>
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-55 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle, #f43f5e 0%, #7f1d1d 45%, transparent 75%)' }}
        />
        <svg width="220" height="260" viewBox="0 0 220 260" className="relative z-10 drop-shadow-[0_0_26px_rgba(244,63,94,0.75)]">
          <defs>
            <linearGradient id="alphaStalkerArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="50%" stopColor="#18111b" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>
          <path d="M 82 78 L 48 30 L 62 92 L 22 72 L 55 125 L 34 166 L 83 148" fill="#1c101b" stroke="#fb7185" strokeWidth="3" />
          <path d="M 138 78 L 172 30 L 158 92 L 198 72 L 165 125 L 186 166 L 137 148" fill="#1c101b" stroke="#fb7185" strokeWidth="3" />
          <path d="M 88 76 L 132 76 L 146 145 L 130 205 L 110 225 L 90 205 L 74 145 Z" fill="url(#alphaStalkerArmor)" stroke="#f43f5e" strokeWidth="3" />
          <path d="M 91 56 L 76 18 L 105 43 L 110 10 L 115 43 L 144 18 L 129 56 L 136 82 L 110 98 L 84 82 Z" fill="#0f172a" stroke="#fda4af" strokeWidth="2.5" />
          <path d="M 92 68 L 108 72 L 100 78 Z M 128 68 L 112 72 L 120 78 Z" fill="#fef2f2" className="animate-pulse" />
          <path d="M 95 110 L 108 120 L 98 128 M 125 110 L 112 120 L 122 128" stroke="#fda4af" strokeWidth="3" fill="none" />
          <circle cx="110" cy="150" r="22" fill="#be123c" className="animate-pulse" />
          <circle cx="110" cy="150" r="9" fill="#fff1f2" />
          <path d="M 90 192 L 64 232 M 130 192 L 156 232" stroke="#fb7185" strokeWidth="8" strokeLinecap="round" />
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
