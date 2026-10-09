import { PlayerState, Quest, QuestStatus } from '../types/game';

export const INITIAL_QUESTS: readonly Quest[] = Object.freeze([
  {
    id: 'qst-01',
    title: 'Eco do Primeiro Sinal',
    description: 'Investigue o perímetro de impacto em Nova Arcádia e elimine a primeira anomalia dimensional detectada pelos sensores.',
    realmId: 'realm-alpha',
    status: 'ACTIVE',
    requiredLevel: 1,
    objectives: [
      {
        id: 'obj-fase-01',
        description: 'Neutralize o Rasgador na Fase 01 da Campanha',
        targetCount: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    rewards: {
      exp: 120,
      credits: 60,
      fragments: 2,
      matrixCells: 1,
      itemId: 'wpn-01',
    },
  },
  {
    id: 'qst-02',
    title: 'Frequências Perdidas',
    description: 'Use o sensor quântico de reconhecimento para sintonizar a frequência de um terminal antigo isolado na Fenda.',
    realmId: 'realm-alpha',
    status: 'ACTIVE',
    requiredLevel: 1,
    objectives: [
      {
        id: 'obj-scan-01',
        description: 'Decodifique com sucesso 1 ponto de anomalia no modo Exploração',
        targetCount: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    rewards: {
      exp: 160,
      credits: 100,
      fragments: 3,
      matrixCells: 2,
      itemId: 'cor-01',
    },
  },
  {
    id: 'qst-03',
    title: 'O Vigia Silenciado',
    description: 'A Torre de Vigilância do Complexo Industrial bloqueia o avanço para o norte. Elimine o Vigia Industrial na Fase 05.',
    realmId: 'realm-beta',
    status: 'AVAILABLE',
    requiredLevel: 2,
    requiredPhase: 'fase-04',
    objectives: [
      {
        id: 'obj-fase-05',
        description: 'Derrote o Vigia Industrial na Fase 05 da Campanha',
        targetCount: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    rewards: {
      exp: 240,
      credits: 160,
      fragments: 4,
      matrixCells: 2,
      itemId: 'acc-02',
    },
  },
  {
    id: 'qst-04',
    title: 'Sobrecarga no Reator',
    description: 'O Guardião Industrial atingiu estágio de sobrecarga no Núcleo de Fabricação. Destrua suas duas fases de combate.',
    realmId: 'realm-beta',
    status: 'AVAILABLE',
    requiredLevel: 3,
    requiredPhase: 'fase-07',
    objectives: [
      {
        id: 'obj-fase-08',
        description: 'Derrote o Guardião Industrial (Chefe da Fase 08)',
        targetCount: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    rewards: {
      exp: 380,
      credits: 280,
      fragments: 6,
      matrixCells: 3,
      itemId: 'arm-03',
    },
  },
  {
    id: 'qst-05',
    title: 'Explorador do Multiverso',
    description: 'Estabeleça sincronização dimensional com todas as cinco realidades alternativas descobertas no Nexus.',
    realmId: 'realm-epsilon',
    status: 'AVAILABLE',
    requiredLevel: 4,
    objectives: [
      {
        id: 'obj-realms-5',
        description: 'Sincronize os portais de pelo menos 4 realidades dimensionais',
        targetCount: 4,
        currentCount: 1,
        completed: false,
      },
    ],
    rewards: {
      exp: 520,
      credits: 450,
      fragments: 8,
      matrixCells: 4,
      itemId: 'cor-03',
    },
  },
  {
    id: 'qst-06',
    title: 'A Queda do Arquiteto',
    description: 'Chegue ao Além do Véu e confronte a inteligência suprema da Convergência para estabilizar a malha do espaço-tempo.',
    realmId: 'realm-gamma',
    status: 'AVAILABLE',
    requiredLevel: 5,
    requiredPhase: 'fase-09',
    objectives: [
      {
        id: 'obj-fase-10',
        description: 'Derrote O Arquiteto (Chefe Final da Fase 10)',
        targetCount: 1,
        currentCount: 0,
        completed: false,
      },
    ],
    rewards: {
      exp: 1000,
      credits: 800,
      fragments: 15,
      matrixCells: 6,
      itemId: 'wpn-04',
    },
  },
]);

export class QuestSystem {
  /**
   * Initializes or updates quest states based on the player's campaign progress.
   */
  static getUpdatedQuests(
    player: Readonly<PlayerState>,
    completedPhases: string[],
    unlockedRealms: string[],
    discoveredSecretsCount: number
  ): Quest[] {
    const activeQuestIds = new Set(player.activeQuests ?? ['qst-01', 'qst-02']);
    const completedQuestIds = new Set(player.completedQuests ?? []);

    return INITIAL_QUESTS.map(q => {
      // 1. If already completed
      if (completedQuestIds.has(q.id)) {
        return {
          ...q,
          status: 'COMPLETED' as QuestStatus,
          objectives: q.objectives.map(o => ({ ...o, currentCount: o.targetCount, completed: true })),
        };
      }

      // 2. Clone objectives and evaluate progress
      let allObjectivesDone = true;
      const objectives = q.objectives.map(obj => {
        let count = 0;
        if (obj.id === 'obj-fase-01' && completedPhases.includes('fase-01')) count = 1;
        if (obj.id === 'obj-scan-01' && discoveredSecretsCount >= 1) count = Math.min(obj.targetCount, discoveredSecretsCount);
        if (obj.id === 'obj-fase-05' && completedPhases.includes('fase-05')) count = 1;
        if (obj.id === 'obj-fase-08' && completedPhases.includes('fase-08')) count = 1;
        if (obj.id === 'obj-realms-5') count = Math.min(obj.targetCount, unlockedRealms.length);
        if (obj.id === 'obj-fase-10' && completedPhases.includes('fase-10')) count = 1;

        const isDone = count >= obj.targetCount;
        if (!isDone) allObjectivesDone = false;
        return { ...obj, currentCount: count, completed: isDone };
      });

      // 3. Determine status
      let status: QuestStatus = 'AVAILABLE';
      if (allObjectivesDone) {
        status = 'COMPLETED';
      } else if (activeQuestIds.has(q.id) || player.level >= q.requiredLevel) {
        status = 'ACTIVE';
      }

      return {
        ...q,
        status,
        objectives,
      };
    });
  }
}
