import { SecretBossConfig, SecretBossStatus } from '../types/game';

export const SECRET_BOSSES: readonly SecretBossConfig[] = Object.freeze([
  {
    id: 'sb-cartografo',
    name: 'O Cartógrafo do Vazio',
    title: 'ARQUITETURA DE LINHAS TEMPORAIS OMNIDIRECIONAIS',
    description: 'Uma entidade autônoma que mapeia e colapsa galáxias mortas na Fenda. Utiliza lâminas estelares e teleporte de fase contínuo.',
    realmId: 'realm-gamma',
    status: 'LOCKED',
    unlockCondition: 'Conclua a Fase 06 ou decodifique pelo menos 2 terminais no modo de Exploração.',
    rewards: {
      exp: 600,
      credits: 400,
      fragments: 8,
      matrixCells: 4,
      itemId: 'acc-03',
    },
    enemyStats: {
      hp: 360,
      maxHp: 360,
      atk: 36,
      def: 18,
      maxPhases: 2,
      bossType: 'AVATAR',
    },
  },
  {
    id: 'sb-sentinela',
    name: 'A Sentinela de Épsilon',
    title: 'BLINDAGEM MONOLÍTICA DO NEXUS PRIMORDIAL',
    description: 'Guardião colossal forjado a partir dos primeiros núcleos de antimatéria de Nova Arcádia. Projeta escudos reativos impenetráveis.',
    realmId: 'realm-epsilon',
    status: 'LOCKED',
    unlockCondition: 'Conclua a Fase 08 da Campanha ou alcance Nível 4 do explorador.',
    rewards: {
      exp: 850,
      credits: 600,
      fragments: 12,
      matrixCells: 6,
      itemId: 'wpn-03',
    },
    enemyStats: {
      hp: 440,
      maxHp: 440,
      atk: 40,
      def: 24,
      maxPhases: 2,
      bossType: 'GUARDIAN',
    },
  },
  {
    id: 'sb-eco-primordial',
    name: 'O Eco Primordial',
    title: 'A MANIFESTAÇÃO PRÉ-COLAPSO DE KAEL E DO ARQUITETO',
    description: 'A sombra originária da Grande Convergência, capaz de usar todas as quatro disciplinas de combate simultaneamente ao longo de três fases destrutivas.',
    realmId: 'realm-omega',
    status: 'LOCKED',
    unlockCondition: 'Derrote O Arquiteto (Fase 10) para desbloquear a câmara do Espelho Quântico.',
    rewards: {
      exp: 1500,
      credits: 1200,
      fragments: 20,
      matrixCells: 10,
      itemId: 'cor-04',
    },
    enemyStats: {
      hp: 550,
      maxHp: 550,
      atk: 48,
      def: 30,
      maxPhases: 3,
      bossType: 'ARCHITECT',
    },
  },
]);

export class SecretBossSystem {
  static getBossById(id: string): SecretBossConfig | undefined {
    return SECRET_BOSSES.find(b => b.id === id);
  }

  static getBossesWithStatus(
    completedPhases: string[],
    playerLevel: number,
    discoveredSecretsCount: number,
    defeatedBosses: string[] = []
  ): SecretBossConfig[] {
    return SECRET_BOSSES.map(b => {
      let isDefeated = defeatedBosses.includes(b.id);
      let isUnlocked = false;

      if (b.id === 'sb-cartografo') {
        isUnlocked = completedPhases.includes('fase-06') || discoveredSecretsCount >= 2;
      } else if (b.id === 'sb-sentinela') {
        isUnlocked = completedPhases.includes('fase-08') || playerLevel >= 4;
      } else if (b.id === 'sb-eco-primordial') {
        isUnlocked = completedPhases.includes('fase-10');
      }

      let status: SecretBossStatus = 'LOCKED';
      if (isDefeated) {
        status = 'DEFEATED';
      } else if (isUnlocked) {
        status = 'DISCOVERED';
      }

      return {
        ...b,
        status,
      };
    });
  }
}
