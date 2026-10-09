import { SaveData, PlayerState, ScreenType } from '../types/game';

const SAVE_KEY_V3 = 'ruptura_v3_campaign';
const SAVE_KEY_V2 = 'ruptura_v2_campaign';
const SAVE_KEY_V1 = 'ruptura_v1_campaign';
const LEGACY_SAVE_KEY = 'ruptura_game_save_v1';

export class SaveEngine {
  static hasSave(): boolean {
    try {
      return (
        localStorage.getItem(SAVE_KEY_V3) !== null ||
        localStorage.getItem(SAVE_KEY_V2) !== null ||
        localStorage.getItem(SAVE_KEY_V1) !== null ||
        localStorage.getItem(LEGACY_SAVE_KEY) !== null
      );
    } catch {
      return false;
    }
  }

  static getSave(): SaveData | null {
    try {
      // 1. Try V3 save first
      const v3Data = localStorage.getItem(SAVE_KEY_V3);
      if (v3Data) {
        return JSON.parse(v3Data) as SaveData;
      }

      // 2. Try V2 save and migrate
      const v2Data = localStorage.getItem(SAVE_KEY_V2);
      if (v2Data) {
        const parsed = JSON.parse(v2Data) as SaveData;
        return {
          ...parsed,
          player: {
            ...parsed.player,
            inventory: parsed.player.inventory ?? [],
            equippedGear: parsed.player.equippedGear ?? {},
            talentPoints: parsed.player.talentPoints ?? Math.max(0, parsed.player.level - 1),
            allocatedTalents: parsed.player.allocatedTalents ?? [],
            activeQuests: parsed.player.activeQuests ?? ['qst-01', 'qst-02'],
            completedQuests: parsed.player.completedQuests ?? [],
            discoveredSecretBosses: parsed.player.discoveredSecretBosses ?? [],
            defeatedSecretBosses: parsed.player.defeatedSecretBosses ?? [],
          },
          version: '3.0-migrated-v2',
        };
      }

      // 3. Try V1 campaign save and migrate
      const v1Data = localStorage.getItem(SAVE_KEY_V1);
      if (v1Data) {
        const parsed = JSON.parse(v1Data);
        return {
          player: {
            ...parsed.player,
            focus: 30,
            matrixCells: 0,
            aetherCores: 0,
            inventory: [],
            equippedGear: {},
            talentPoints: Math.max(0, (parsed.player?.level ?? 1) - 1),
            allocatedTalents: [],
            activeQuests: ['qst-01', 'qst-02'],
            completedQuests: [],
            discoveredSecretBosses: [],
            defeatedSecretBosses: [],
          },
          unlockedSectors: parsed.unlockedSectors || [],
          completedSectors: parsed.completedSectors || [],
          unlockedPhases: parsed.unlockedPhases || ['fase-01'],
          completedPhases: parsed.completedPhases || [],
          lastPhaseId: parsed.lastPhaseId || 'fase-01',
          currentScreen: 'CAMPAIGN_MAP',
          unlockedRealms: ['realm-alpha'],
          discoveredSecrets: [],
          version: '3.0-migrated-v1',
          timestamp: parsed.updatedAt || Date.now(),
        };
      }

      // 4. Try legacy key
      const legacyData = localStorage.getItem(LEGACY_SAVE_KEY);
      if (legacyData) {
        return JSON.parse(legacyData) as SaveData;
      }

      return null;
    } catch {
      return null;
    }
  }

  static save(
    player: PlayerState,
    currentScreen: ScreenType,
    unlockedPhases: string[] = ['fase-01'],
    completedPhases: string[] = [],
    extraData: {
      lastPhaseId?: string;
      unlockedRealms?: string[];
      discoveredSecrets?: string[];
      unlockedSectors?: string[];
      completedSectors?: string[];
      activeQuests?: string[];
      completedQuests?: string[];
      defeatedSecretBosses?: string[];
    } = {}
  ): boolean {
    try {
      const saveData: SaveData = {
        player,
        currentScreen,
        unlockedPhases,
        completedPhases,
        lastPhaseId: extraData.lastPhaseId || 'fase-01',
        unlockedRealms: extraData.unlockedRealms || ['realm-alpha'],
        discoveredSecrets: extraData.discoveredSecrets || [],
        unlockedSectors: extraData.unlockedSectors || [],
        completedSectors: extraData.completedSectors || [],
        activeQuests: extraData.activeQuests || player.activeQuests || [],
        completedQuests: extraData.completedQuests || player.completedQuests || [],
        defeatedSecretBosses: extraData.defeatedSecretBosses || player.defeatedSecretBosses || [],
        version: '3.0',
        timestamp: Date.now(),
      };

      const serialized = JSON.stringify(saveData);
      localStorage.setItem(SAVE_KEY_V3, serialized);
      // Keep v2 and v1 updated for direct backward compatibility
      localStorage.setItem(SAVE_KEY_V2, serialized);
      localStorage.setItem(SAVE_KEY_V1, serialized);
      localStorage.setItem(LEGACY_SAVE_KEY, serialized);
      return true;
    } catch {
      return false;
    }
  }

  static exportSaveString(): string | null {
    try {
      const current = this.getSave();
      if (!current) return null;
      return JSON.stringify(current, null, 2);
    } catch {
      return null;
    }
  }

  static importSaveString(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString) as SaveData;
      if (!parsed || typeof parsed !== 'object' || !parsed.player) {
        return { success: false, error: 'Arquivo de salvamento inválido ou corrompido.' };
      }
      if (typeof parsed.player.name !== 'string' || typeof parsed.player.hp !== 'number') {
        return { success: false, error: 'Dados do explorador incompatíveis com o motor RUPTURA.' };
      }

      const serialized = JSON.stringify({
        ...parsed,
        version: '3.0-imported',
        timestamp: Date.now(),
      });

      localStorage.setItem(SAVE_KEY_V3, serialized);
      localStorage.setItem(SAVE_KEY_V2, serialized);
      localStorage.setItem(SAVE_KEY_V1, serialized);
      return { success: true };
    } catch {
      return { success: false, error: 'Formato JSON inválido.' };
    }
  }

  static clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY_V3);
      localStorage.removeItem(SAVE_KEY_V2);
      localStorage.removeItem(SAVE_KEY_V1);
      localStorage.removeItem(LEGACY_SAVE_KEY);
    } catch {
      // storage disabled
    }
  }
}
