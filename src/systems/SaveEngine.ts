import { SaveData, PlayerState, ScreenType } from '../types/game';

const SAVE_KEY_V2 = 'ruptura_v2_campaign';
const SAVE_KEY_V1 = 'ruptura_v1_campaign';
const LEGACY_SAVE_KEY = 'ruptura_game_save_v1';

export class SaveEngine {
  static hasSave(): boolean {
    try {
      return (
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
      // 1. Try V2 save first
      const v2Data = localStorage.getItem(SAVE_KEY_V2);
      if (v2Data) {
        return JSON.parse(v2Data) as SaveData;
      }

      // 2. Try V1 campaign save
      const v1Data = localStorage.getItem(SAVE_KEY_V1);
      if (v1Data) {
        const parsed = JSON.parse(v1Data);
        return {
          player: parsed.player,
          unlockedSectors: parsed.unlockedSectors || [],
          completedSectors: parsed.completedSectors || [],
          unlockedPhases: parsed.unlockedPhases || ['fase-01'],
          completedPhases: parsed.completedPhases || [],
          lastPhaseId: parsed.lastPhaseId || 'fase-01',
          currentScreen: 'CAMPAIGN_MAP',
          unlockedRealms: ['realm-alpha'],
          discoveredSecrets: [],
          version: '2.0-migrated',
          timestamp: parsed.updatedAt || Date.now(),
        };
      }

      // 3. Try legacy key
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
        version: '2.0',
        timestamp: Date.now(),
      };

      const serialized = JSON.stringify(saveData);
      localStorage.setItem(SAVE_KEY_V2, serialized);
      // Keep v1 updated for direct backward compatibility
      localStorage.setItem(SAVE_KEY_V1, serialized);
      localStorage.setItem(LEGACY_SAVE_KEY, serialized);
      return true;
    } catch {
      return false;
    }
  }

  static clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY_V2);
      localStorage.removeItem(SAVE_KEY_V1);
      localStorage.removeItem(LEGACY_SAVE_KEY);
    } catch {
      // storage disabled
    }
  }
}