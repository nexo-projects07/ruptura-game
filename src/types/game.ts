export type ScreenType = 
  | 'MENU' 
  | 'CINEMATIC_PROLOGUE'
  | 'INTRO' 
  | 'NOVA_ARCADIA_INVESTIGATION' 
  | 'COMBAT' 
  | 'VICTORY' 
  | 'DEFEAT' 
  | 'FIRST_RUPTURE' 
  | 'MAP' 
  | 'SECTOR_02_BRIEFING' 
  | 'SECTOR_02_INVESTIGATION'
  | 'SECTOR_03_STATION'
  | 'SECTOR_04_RESEARCH'
  | 'LYRA_DIALOGUE'
  | 'GRANDE_RUPTURA'
  | 'CHAPTER_END'
  | 'CAMPAIGN_MAP'
  | 'PHASE_BRIEFING'
  // RUPTURA 2.0 Screens
  | 'NEXUS_HUB'
  | 'MULTIVERSE_MAP'
  | 'EXPLORATION'
  | 'UPGRADES'
  | 'LORE_ARCHIVES'
  | 'QUANTUM_ARENA';

export interface PlayerState {
  name: string;
  role: string;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  exp: number;
  maxExp: number;
  credits: number;
  fragments: number;
  // RUPTURA 2.0 Fields
  focus?: number;
  maxFocus?: number;
  matrixCells?: number;
  aetherCores?: number;
  unlockedSkills?: string[];
  upgradeLevels?: Record<string, number>;
  discoveredSecrets?: string[];
  unlockedRealms?: string[];
}

export interface EnemyIntent {
  type: 'LIGHT_ATTACK' | 'HEAVY_TELEGRAPH' | 'CHANNELING' | 'BARRIER' | 'COUNTER';
  description: string;
  power: number;
}

export interface EnemyState {
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  def?: number;
  // RUPTURA 2.0 Fields
  phase?: number;
  maxPhases?: number;
  phaseName?: string;
  intent?: EnemyIntent;
  boss?: boolean;
  bossType?: 'NORMAL' | 'GUARDIAN' | 'AVATAR' | 'ARCHITECT';
  stagger?: number; // 0 to 100
  isStaggered?: boolean;
  avatarType?: 'rasgador' | 'eco' | 'sentinela' | 'guardiao' | 'avatar' | 'arquiteto';
}

export interface NodeData {
  id: string;
  name: string;
  code: string;
  status: 'CONCLUÍDO' | 'DISPONÍVEL' | 'BLOQUEADO';
  x: number;
  y: number;
  description: string;
}

export interface RealmData {
  id: string;
  name: string;
  code: string;
  description: string;
  threatLevel: string;
  isUnlocked: boolean;
  icon: string;
  phases: string[];
  ambientColor: string;
}

export interface SaveData {
  player: PlayerState;
  unlockedSectors: string[];
  completedSectors: string[];
  unlockedPhases?: string[];
  completedPhases?: string[];
  lastPhaseId?: string;
  currentScreen: ScreenType;
  discoveredSecrets?: string[];
  unlockedRealms?: string[];
  version?: string;
  timestamp: number;
}

export interface GameSettings {
  muted: boolean;
  masterVolume: number;
}