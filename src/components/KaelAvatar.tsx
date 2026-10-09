import React from 'react';
import { EquippedGearState } from '../types/game';
import { SkinRegistry } from '../systems/SkinSystem';

export interface KaelAvatarProps {
  state?: 'idle' | 'attack' | 'defend' | 'hit';
  skinId?: string;
  equippedGear?: EquippedGearState;
  scale?: number;
  showAura?: boolean;
}

export const KaelAvatar: React.FC<KaelAvatarProps> = ({
  state = 'idle',
  skinId = 'skin-default',
  equippedGear,
  scale = 1,
  showAura = true,
}) => {
  const isAttack = state === 'attack';
  const isDefend = state === 'defend';
  const isHit = state === 'hit';

  const skin = SkinRegistry.getSkin(skinId);
  const { palette } = skin;

  // Equipment Visual Toggles
  const weaponId = equippedGear?.weaponId;
  const armorId = equippedGear?.armorId;
  const coreId = equippedGear?.coreId;
  const accessoryId = equippedGear?.accessoryId;

  // Weapons visual type
  // wpn-01: Thermal dagger
  // wpn-02: Plasma dual saber
  // wpn-03: Heavy pulse launcher
  // wpn-04: Singularity astral greatsword
  const isPlasmaSaber = weaponId === 'wpn-02';
  const isPulseLauncher = weaponId === 'wpn-03';
  const isSingularityBlade = weaponId === 'wpn-04';

  // Armor visual tier
  // arm-01: Scout vest
  // arm-02: Tachyon mesh suit
  // arm-03: Heavy refractory plates
  // arm-04: Quantum Aegis (Wings/Pauldrons)
  const isTachyonMesh = armorId === 'arm-02';
  const isRefractoryArmor = armorId === 'arm-03';
  const isQuantumAegis = armorId === 'arm-04';

  // Core visual tier
  // cor-01, cor-02, cor-03, cor-04
  const hasAdvancedCore = coreId === 'cor-02' || coreId === 'cor-03' || coreId === 'cor-04';
  const isPrimordialCore = coreId === 'cor-04';

  // Accessory visual tier
  // acc-01: Recon holographic eyepiece
  // acc-02: Wrist gravity module
  // acc-03: Chrono displacement amulet
  const hasEyepiece = accessoryId === 'acc-01';
  const hasGravityWrist = accessoryId === 'acc-02';
  const hasChronoAmulet = accessoryId === 'acc-03';

  return (
    <div
      style={{ transform: `scale(${scale})` }}
      className={`relative transition-all duration-300 transform select-none ${
        isAttack ? 'translate-x-12 scale-105' : ''
      } ${isHit ? '-translate-x-4 opacity-75 blur-[0.5px]' : ''}`}
    >
      {/* Background Dimensional Aura according to skin and core */}
      {showAura && (
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none animate-pulse"
          style={{
            background: `radial-gradient(circle, ${palette.glow} 0%, ${palette.primary} 45%, transparent 75%)`,
          }}
        />
      )}

      <svg
        width="200"
        height="240"
        viewBox="0 0 200 240"
        className="relative z-10"
        style={{
          filter: `drop-shadow(0 0 16px ${palette.glow})`,
        }}
      >
        <defs>
          <linearGradient id={`kaelArmorGrad-${skin.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.armorDark} />
            <stop offset="50%" stopColor={palette.secondary} />
            <stop offset="100%" stopColor={palette.armorDark} />
          </linearGradient>

          <radialGradient id={`kaelCoreGrad-${skin.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor={palette.primary} />
            <stop offset="85%" stopColor={palette.accent} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <linearGradient id={`kaelBladeGrad-${skin.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor={palette.primary} />
            <stop offset="100%" stopColor={palette.accent} />
          </linearGradient>
        </defs>

        {/* Defense Barrier Arc if Defending */}
        {isDefend && (
          <g>
            <path
              d="M 20 20 Q 100 -15 180 20 Q 190 130 100 225 Q 10 130 20 20 Z"
              fill={palette.primary}
              fillOpacity="0.18"
              stroke={palette.glow}
              strokeWidth="3.5"
              strokeDasharray="6 3"
              className="animate-pulse"
            />
            {/* Deflection Hex Shield Pattern */}
            <polygon
              points="100,50 125,65 125,95 100,110 75,95 75,65"
              fill="none"
              stroke={palette.primary}
              strokeWidth="2"
              opacity="0.7"
              className="animate-spin"
              style={{ transformOrigin: '100px 80px', animationDuration: '6s' }}
            />
          </g>
        )}

        {/* Shadow on Floor */}
        <ellipse cx="100" cy="215" rx="65" ry="12" fill="rgba(0, 0, 0, 0.45)" />

        {/* BACK ACCESSORY: Wings / Quantum Mantle if arm-04 or skin-ascendant/legendary */}
        {(isQuantumAegis || skin.id === 'skin-ascendant' || skin.id === 'skin-legendary') && (
          <g opacity="0.85" className="animate-pulse">
            <polygon points="100,70 30,30 50,110 85,120" fill={palette.primary} fillOpacity="0.3" stroke={palette.accent} strokeWidth="2" />
            <polygon points="100,70 170,30 150,110 115,120" fill={palette.primary} fillOpacity="0.3" stroke={palette.accent} strokeWidth="2" />
            <line x1="30" y1="30" x2="85" y2="120" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="170" y1="30" x2="115" y2="120" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}

        {/* LEGS: Tactical Greaves & Boots */}
        {/* Left Leg */}
        <path
          d="M 75 145 L 60 210 L 80 215 L 90 155 Z"
          fill={palette.armorDark}
          stroke={palette.secondary}
          strokeWidth="2"
        />
        {/* Right Leg */}
        <path
          d="M 125 145 L 140 210 L 120 215 L 110 155 Z"
          fill={palette.armorDark}
          stroke={palette.secondary}
          strokeWidth="2"
        />

        {/* Kneepads / Shin guards - Enhanced if arm-02 or arm-03 */}
        {(isTachyonMesh || isRefractoryArmor || isQuantumAegis) && (
          <g>
            <polygon points="65,175 75,170 82,185 70,190" fill={palette.primary} stroke={palette.accent} strokeWidth="1" />
            <polygon points="135,175 125,170 118,185 130,190" fill={palette.primary} stroke={palette.accent} strokeWidth="1" />
          </g>
        )}

        {/* TORSO: Body Armor & Nanot suit */}
        <path
          d="M 65 75 L 135 75 L 125 150 L 75 150 Z"
          fill={`url(#kaelArmorGrad-${skin.id})`}
          stroke={palette.primary}
          strokeWidth={isRefractoryArmor || isQuantumAegis ? 3 : 2}
        />

        {/* Heavy Chestplate Hexagons if arm-03 or arm-04 */}
        {(isRefractoryArmor || isQuantumAegis) && (
          <g opacity="0.9">
            <polygon points="100,85 115,95 115,115 100,125 85,115 85,95" fill="none" stroke={palette.accent} strokeWidth="1.5" />
            <line x1="68" y1="95" x2="85" y2="95" stroke={palette.primary} strokeWidth="2" />
            <line x1="132" y1="95" x2="115" y2="95" stroke={palette.primary} strokeWidth="2" />
          </g>
        )}

        {/* SHOULDER PAULDRONS: Armor Left & Right */}
        {/* Left Shoulder */}
        <path
          d={isQuantumAegis || isRefractoryArmor ? "M 42 75 L 70 58 L 76 95 L 48 102 Z" : "M 50 78 L 70 65 L 75 92 L 55 96 Z"}
          fill={palette.armorDark}
          stroke={palette.primary}
          strokeWidth="2"
        />
        {/* Right Shoulder */}
        <path
          d={isQuantumAegis || isRefractoryArmor ? "M 158 75 L 130 58 L 124 95 L 152 102 Z" : "M 150 78 L 130 65 L 125 92 L 145 96 Z"}
          fill={palette.armorDark}
          stroke={palette.primary}
          strokeWidth="2"
        />

        {/* CORE: Heart Matrix Generator on Chest */}
        <circle
          cx="100"
          cy="110"
          r={isPrimordialCore ? 14 : hasAdvancedCore ? 11 : 8}
          fill={`url(#kaelCoreGrad-${skin.id})`}
          className="animate-pulse"
        />
        {isPrimordialCore && (
          <ellipse
            cx="100"
            cy="110"
            rx="16"
            ry="6"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            transform="rotate(30 100 110)"
            className="animate-spin"
            style={{ transformOrigin: '100px 110px' }}
          />
        )}

        {/* LEFT ARM (Shield / Support Arm) */}
        <path
          d="M 60 85 L 40 120 L 50 135"
          stroke={palette.armorDark}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        {/* Gravity Wrist Module on Left Arm if acc-02 */}
        {hasGravityWrist && (
          <g>
            <rect x="35" y="115" width="12" height="16" rx="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <circle cx="41" cy="123" r="3" fill="#ffffff" className="animate-pulse" />
          </g>
        )}

        {/* RIGHT ARM (Weapon Arm) */}
        <path
          d="M 140 85 L 165 115 L 155 135"
          stroke={palette.armorDark}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* WEAPON MOUNT / BLADE / LAUNCHER (Dynamic based on equippedGear) */}
        <g transform={isAttack ? 'rotate(-25 155 115)' : 'rotate(0)'}>
          {isSingularityBlade ? (
            /* Legendary Singularity Greatsword (wpn-04) */
            <g>
              <line x1="155" y1="125" x2="195" y2="40" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
              <line x1="155" y1="125" x2="195" y2="40" stroke={`url(#kaelBladeGrad-${skin.id})`} strokeWidth="6" strokeLinecap="round" />
              <line x1="155" y1="125" x2="195" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              {/* Astral Crossguard */}
              <polygon points="148,118 162,110 168,124 154,132" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
              <circle cx="195" cy="40" r="5" fill="#ffffff" className="animate-ping" style={{ animationDuration: '2s' }} />
            </g>
          ) : isPulseLauncher ? (
            /* Heavy Pulse Launcher (wpn-03) */
            <g>
              <rect x="145" y="70" width="22" height="55" rx="5" fill="#0f172a" stroke={palette.primary} strokeWidth="2.5" />
              <rect x="150" y="55" width="12" height="20" rx="3" fill="#38bdf8" className="animate-pulse" />
              <circle cx="156" cy="65" r="4" fill="#ffffff" />
            </g>
          ) : isPlasmaSaber ? (
            /* Plasma Bifasic Saber (wpn-02) */
            <g>
              <line x1="155" y1="125" x2="185" y2="55" stroke={palette.primary} strokeWidth="6" strokeLinecap="round" />
              <line x1="155" y1="125" x2="185" y2="55" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="185" cy="55" r="4" fill={palette.accent} className="animate-pulse" />
            </g>
          ) : (
            /* Default / Thermal Dagger (wpn-01) */
            <g>
              <line x1="155" y1="125" x2="180" y2="70" stroke={palette.primary} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="155" y1="125" x2="180" y2="70" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* NECK / COLLAR */}
        <path d="M 85 75 L 115 75 L 110 65 L 90 65 Z" fill={palette.armorDark} stroke={palette.secondary} strokeWidth="1.5" />

        {/* HEAD / HELMET & VISOR */}
        {/* Helmet Outer Shell */}
        <path
          d="M 80 30 L 120 30 L 125 65 L 75 65 Z"
          fill={palette.armorDark}
          stroke={palette.primary}
          strokeWidth="2"
        />

        {/* Helmet Crest / Ridge */}
        <polygon points="100,20 108,30 92,30" fill={palette.primary} />

        {/* Tactical Visor Glow */}
        <polygon
          points="82,45 118,45 114,56 86,56"
          fill={palette.visor}
          className="animate-pulse"
          style={{ filter: `drop-shadow(0 0 6px ${palette.visor})` }}
        />

        {/* Holographic Recon Eyepiece if acc-01 */}
        {hasEyepiece && (
          <g>
            <circle cx="112" cy="50" r="5" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="animate-spin" />
            <line x1="117" y1="50" x2="128" y2="45" stroke="#22d3ee" strokeWidth="1.5" />
          </g>
        )}

        {/* Chrono Amulet if acc-03 */}
        {hasChronoAmulet && (
          <g>
            <circle cx="100" cy="74" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="100" cy="74" r="4" fill="#fb7185" />
          </g>
        )}
      </svg>
    </div>
  );
};
