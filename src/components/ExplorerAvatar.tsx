import React from 'react';
import type { EquippedGearState } from '../types/game';
import { getExplorerProfile } from '../systems/ExplorerSystem';
import { KaelAvatar } from './KaelAvatar';

type AvatarState = 'idle' | 'attack' | 'defend' | 'hit';

export const ExplorerAvatar: React.FC<{
  explorerId?: string;
  state?: AvatarState;
  skinId?: string;
  equippedGear?: EquippedGearState;
}> = ({ explorerId, state = 'idle', skinId, equippedGear }) => {
  const explorer = getExplorerProfile(explorerId);

  if (explorer.id === 'kael') {
    return <KaelAvatar state={state} skinId={skinId} equippedGear={equippedGear} />;
  }

  const motion = state === 'attack'
    ? '-translate-x-8 scale-105'
    : state === 'hit'
    ? 'translate-x-4 opacity-75'
    : state === 'defend'
    ? 'scale-95'
    : '';
  const coreSize = equippedGear?.coreId === 'cor-04' ? 15 : equippedGear?.coreId ? 12 : 8;
  const hasHeavyArmor = equippedGear?.armorId === 'arm-03' || equippedGear?.armorId === 'arm-04';
  const weaponColor = equippedGear?.weaponId === 'wpn-04' ? '#f8fafc' : '#67e8f9';

  return (
    <div className={`relative transition-all duration-300 transform select-none ${motion}`} aria-label={`${explorer.name}, ${explorer.role}`}>
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none animate-pulse"
        style={{
          background: explorer.id === 'lyra'
            ? 'radial-gradient(circle, #34d399 0%, #064e3b 55%, transparent 80%)'
            : explorer.id === 'marcus'
            ? 'radial-gradient(circle, #fbbf24 0%, #78350f 55%, transparent 80%)'
            : explorer.id === 'kira'
            ? 'radial-gradient(circle, #e879f9 0%, #701a75 55%, transparent 80%)'
            : 'radial-gradient(circle, #67e8f9 0%, #1e3a8a 55%, transparent 80%)',
        }}
      />
      <svg width="200" height="240" viewBox="0 0 200 240" className="relative z-10 drop-shadow-[0_0_16px_rgba(34,211,238,0.35)]">
        {explorer.id === 'lyra' && (
          <g>
            <path d="M 74 82 L 92 66 L 126 68 L 143 91 L 132 152 L 148 205 L 55 205 L 72 151 Z" fill="#064e3b" stroke="#34d399" strokeWidth="3" />
            <path d="M 75 82 L 53 111 L 64 151 M 140 86 L 162 111 L 151 151" fill="none" stroke="#a7f3d0" strokeWidth="9" strokeLinecap="round" />
            <circle cx="108" cy="49" r="27" fill="#0f172a" stroke="#6ee7b7" strokeWidth="3" />
            <path d="M 84 46 Q 107 17 132 43 L 124 55 L 92 58 Z" fill="#a7f3d0" />
            <path d="M 95 49 L 121 49" stroke="#fff" strokeWidth="4" />
            <rect x="43" y="123" width="15" height="30" rx="4" fill="#10b981" stroke="#d1fae5" />
            <circle cx="108" cy="125" r={coreSize} fill="#ecfdf5" className="animate-pulse" />
            <path d="M 61 203 L 54 228 M 139 203 L 146 228" stroke="#6ee7b7" strokeWidth="10" strokeLinecap="round" />
          </g>
        )}
        {explorer.id === 'marcus' && (
          <g>
            <path d={hasHeavyArmor ? 'M 50 80 L 72 54 L 128 54 L 150 80 L 160 160 L 135 205 L 65 205 L 40 160 Z' : 'M 60 82 L 78 60 L 122 60 L 140 82 L 150 158 L 130 201 L 70 201 L 50 158 Z'} fill="#422006" stroke="#fbbf24" strokeWidth="4" />
            <path d="M 74 75 L 54 32 L 94 61 M 126 75 L 146 32 L 106 61" fill="#78350f" stroke="#fcd34d" strokeWidth="4" />
            <rect x="78" y="60" width="44" height="28" rx="8" fill="#0f172a" stroke="#fde68a" strokeWidth="3" />
            <path d="M 90 73 L 110 73" stroke="#fff7ed" strokeWidth="5" />
            <circle cx="100" cy="131" r={coreSize + 3} fill="#f59e0b" className="animate-pulse" />
            <circle cx="100" cy="131" r="7" fill="#fff7ed" />
            <polygon points="23,91 53,77 58,177 28,192" fill="#1e293b" stroke="#fbbf24" strokeWidth="4" />
            <path d="M 72 202 L 67 230 M 128 202 L 133 230" stroke="#f59e0b" strokeWidth="13" strokeLinecap="round" />
          </g>
        )}
        {explorer.id === 'kira' && (
          <g>
            <path d="M 100 17 L 147 72 L 132 99 L 145 178 L 121 215 L 79 215 L 55 178 L 68 99 L 53 72 Z" fill="#3b0764" stroke="#e879f9" strokeWidth="3" />
            <path d="M 100 29 L 83 77 L 117 77 Z" fill="#09090b" stroke="#f0abfc" strokeWidth="3" />
            <path d="M 82 60 L 118 60" stroke="#fdf4ff" strokeWidth="4" />
            <path d="M 77 103 L 37 165 L 49 173 L 88 120 M 123 103 L 163 165 L 151 173 L 112 120" fill="#c026d3" stroke="#f5d0fe" strokeWidth="2" />
            <circle cx="100" cy="139" r={coreSize} fill="#fdf4ff" className="animate-pulse" />
            <path d="M 82 202 L 67 231 M 118 202 L 133 231" stroke="#d946ef" strokeWidth="7" strokeLinecap="round" />
          </g>
        )}
        {explorer.id === 'sena' && (
          <g>
            <ellipse cx="100" cy="90" rx="77" ry="27" fill="none" stroke="#67e8f9" strokeWidth="2" transform="rotate(-28 100 90)" className="animate-spin" style={{ transformOrigin: '100px 90px', animationDuration: '12s' }} />
            <path d="M 100 24 L 133 65 L 125 98 L 149 209 L 100 228 L 51 209 L 75 98 L 67 65 Z" fill="#164e63" stroke="#a5f3fc" strokeWidth="3" />
            <path d="M 100 35 L 82 69 L 100 81 L 118 69 Z" fill="#0f172a" stroke="#fef3c7" strokeWidth="2" />
            <path d="M 82 62 L 118 62" stroke="#fff" strokeWidth="4" />
            <polygon points="100,104 125,139 100,171 75,139" fill="#0e7490" stroke="#cffafe" strokeWidth="3" />
            <circle cx="100" cy="139" r={coreSize} fill="#fef3c7" className="animate-pulse" />
            <path d="M 51 122 L 31 168 M 149 122 L 169 168" stroke={weaponColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M 78 207 L 70 232 M 122 207 L 130 232" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};