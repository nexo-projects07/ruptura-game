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
  | 'QUANTUM_ARENA'
  // RUPTURA 3.0 Screens (Expansion)
  | 'INVENTORY'
  | 'SKILL_TREE'
  | 'QUEST_LOG'
  | 'SECRET_BOSSES'
  // RUPTURA 5.0 Screens (Ultimate Expansion)
  | 'RIFT_COOP';

export type CompanionRole = 'LYRA_TACTICIAN' | 'MARCUS_JUGGERNAUT' | 'KIRA_VOID';

export interface CoopSquadMember {
  id: string;
  name: string;
  roleTitle: string;
  role: CompanionRole | 'KAEL_VANGUARD';
  level: number;
  hp: number;
  maxHp: number;
  status: 'ONLINE' | 'ENGAGED' | 'SYNCED' | 'DOWN';
  activeSkill: string;
  avatarColor: string;
  isLocalPlayer?: boolean;
}

export interface RiftRaidMission {
  id: string;
  title: string;
  threatRank: 'ALTA' | 'EXTREMA' | 'SINGULARIDADE';
  bossName: string;
  bossHp: number;
  bossAtk: number;
  bossDef: number;
  rewardCredits: number;
  rewardFragments: number;
  rewardMatrixCells: number;
  rewardAetherCores: number;
  realmId: string;
  description: string;
  mechanicWarning: string;
}

export type ItemRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export type EquipmentSlot = 'WEAPON' | 'ARMOR' | 'CORE' | 'ACCESSORY';

export interface StatModifiers {
  hp?: number;
  atk?: number;
  def?: number;
  focus?: number;
  critChance?: number;
  focusRecovery?: number;
  dodgeBonus?: number;
  damageReduction?: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  lore?: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  stats: StatModifiers;
  requiredLevel: number;
  creditValue: number;
  matrixCost?: number;
}

export interface InventorySlot {
  instanceId: string;
  itemId: string;
  equipped: boolean;
  acquiredAt: number;
}

export interface EquippedGearState {
  weaponId?: string | null;
  armorId?: string | null;
  coreId?: string | null;
  accessoryId?: string | null;
}

export type TalentBranch = 
  | 'QUANTUM_ASSAULT'
  | 'MATRIX_GUARDIAN'
  | 'TEMPORAL_WARP'
  | 'CONVERGENCE';

export interface TalentNode {
  id: string;
  branch: TalentBranch;
  name: string;
  description: string;
  tier: number;
  requiredLevel: number;
  requiredTalents?: string[];
  costPoints: number;
  costMatrixCells?: number;
  stats?: StatModifiers;
  specialEffect?: string;
}

export interface PlayerTalents {
  allocatedTalents: string[];
  talentPoints: number;
  totalEarnedPoints: number;
}

export type QuestStatus = 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';

export interface QuestObjective {
  id: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
}

export interface QuestReward {
  exp: number;
  credits: number;
  fragments: number;
  matrixCells?: number;
  itemId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  realmId: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: QuestReward;
  requiredLevel: number;
  requiredPhase?: string;
}

export type SecretBossStatus = 'LOCKED' | 'DISCOVERED' | 'DEFEATED';

export interface SecretBossConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  realmId: string;
  status: SecretBossStatus;
  unlockCondition: string;
  rewards: QuestReward;
  enemyStats: {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    maxPhases: number;
    bossType: 'NORMAL' | 'GUARDIAN' | 'AVATAR' | 'ARCHITECT';
  };
}

export interface CalculatedStats {
  maxHp: number;
  atk: number;
  def: number;
  baseFocus: number;
  focusRecovery: number;
  critChance: number;
  dodgeBonus: number;
  damageReductionPercent: number;
}

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
  // RUPTURA 3.0 Fields
  inventory?: InventorySlot[];
  equippedGear?: EquippedGearState;
  talentPoints?: number;
  allocatedTalents?: string[];
  activeQuests?: string[];
  completedQuests?: string[];
  discoveredSecretBosses?: string[];
  defeatedSecretBosses?: string[];
  // RUPTURA 5.0 Fields
  activeCompanion?: CompanionRole;
  coopRaidsCompleted?: number;
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
  questProgress?: Record<string, number>;
  activeQuests?: string[];
  completedQuests?: string[];
  discoveredSecretBosses?: string[];
  defeatedSecretBosses?: string[];
  version?: string;
  timestamp: number;
}

export interface GameSettings {
  muted: boolean;
  masterVolume: number;
}