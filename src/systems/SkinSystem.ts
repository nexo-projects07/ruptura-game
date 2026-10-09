export type KaelSkinId =
  | 'skin-default'
  | 'skin-explorer'
  | 'skin-tactical'
  | 'skin-elite'
  | 'skin-corrupted'
  | 'skin-tachyon'
  | 'skin-ascendant'
  | 'skin-legendary';

export interface SkinDefinition {
  id: KaelSkinId;
  name: string;
  category: 'KAEL' | 'COMPANION' | 'VILLAIN';
  characterName: string;
  title: string;
  description: string;
  unlockCondition: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    armorDark: string;
    visor: string;
  };
}

export const KAEL_SKINS: SkinDefinition[] = [
  {
    id: 'skin-default',
    name: 'Traje de Recruta Metropolitano',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'PADRÃO DE OPERAÇÕES URBANAS',
    description: 'Equipamento padrão distribuído aos patrulheiros de Nova Arcádia antes da convergência de 2147.',
    unlockCondition: 'Disponível desde o início da jornada.',
    palette: {
      primary: '#06b6d4',
      secondary: '#1e293b',
      accent: '#38bdf8',
      glow: '#06b6d4',
      armorDark: '#0f172a',
      visor: '#06b6d4',
    },
  },
  {
    id: 'skin-explorer',
    name: 'Sobrevivente da Fenda Norte',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'TRAJE DE EXPLORADOR TÉRMICO',
    description: 'Nanotraje reforçado com mantas de absorção sísmica e capuz reforçado contra poeira de cristal táquionico.',
    unlockCondition: 'Conclua a Fase 02 ou explore 3 nós em Nova Arcádia.',
    palette: {
      primary: '#10b981',
      secondary: '#1e293b',
      accent: '#34d399',
      glow: '#10b981',
      armorDark: '#064e3b',
      visor: '#6ee7b7',
    },
  },
  {
    id: 'skin-tactical',
    name: 'Operador de Intervenção Tática',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'BLINDAGEM PESADA DE DISTRITO',
    description: 'Placas balísticas hexagonais e exoesqueleto de suporte pneumático para incursões industriais pesadas.',
    unlockCondition: 'Conclua a Fase 04 (Distrito Industrial) ou alcance Nível 2.',
    palette: {
      primary: '#3b82f6',
      secondary: '#0f172a',
      accent: '#60a5fa',
      glow: '#3b82f6',
      armorDark: '#1e1b4b',
      visor: '#93c5fd',
    },
  },
  {
    id: 'skin-elite',
    name: 'Guarda Pretoriana do Nexus',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'UNIDADE DE CHOQUE DIMENSIONAL',
    description: 'Armadura forjada nas forjas de plasma do Nexus Central com ombreiras aerodinâmicas e capa de partículas.',
    unlockCondition: 'Conclua a Fase 06 (Estação Abandonada) ou Nível 4.',
    palette: {
      primary: '#f59e0b',
      secondary: '#1e293b',
      accent: '#fbbf24',
      glow: '#f59e0b',
      armorDark: '#451a03',
      visor: '#fef08a',
    },
  },
  {
    id: 'skin-corrupted',
    name: 'Ressonância do Vazio Corrompido',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'INFECÇÃO POR MATÉRIA DA FENDA',
    description: 'A energia da anomalia penetrou o núcleo do traje, fundindo grafeno com pulsos de antimatéria carmesim.',
    unlockCondition: 'Derrote qualquer Chefe Secreto ou conclua a Fase 08.',
    palette: {
      primary: '#e11d48',
      secondary: '#020617',
      accent: '#f43f5e',
      glow: '#e11d48',
      armorDark: '#2e020d',
      visor: '#fda4af',
    },
  },
  {
    id: 'skin-tachyon',
    name: 'Condutor de Fluxo Táquionico',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'ENERGIA DIMENSIONAL PURA',
    description: 'Exo-traje experimental alimentado diretamente por partículas que se movem mais rápido que a luz.',
    unlockCondition: 'Conclua a Fase 09 (A Grande Ruptura) ou acumule 10 Células de Matriz.',
    palette: {
      primary: '#a855f7',
      secondary: '#090514',
      accent: '#c084fc',
      glow: '#a855f7',
      armorDark: '#2e1065',
      visor: '#e9d5ff',
    },
  },
  {
    id: 'skin-ascendant',
    name: 'Kael Ascendente da Convergência',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'FORMA EVOLUÍDA DO MULTIVERSO',
    description: 'Kael sincronizado simultaneamente em todas as 5 linhas temporais, emanando halos cósmicos e placas puras de éter.',
    unlockCondition: 'Derrote O Arquiteto (Fase 10) na Campanha Principal.',
    palette: {
      primary: '#06b6d4',
      secondary: '#facc15',
      accent: '#ffffff',
      glow: '#38bdf8',
      armorDark: '#0f172a',
      visor: '#ffffff',
    },
  },
  {
    id: 'skin-legendary',
    name: 'Kael Primordial — O Novo Arquiteto',
    category: 'KAEL',
    characterName: 'Kael',
    title: 'AUTORIDADE MÁXIMA DO ESPELHO QUÂNTICO',
    description: 'A manifestação definitiva que assume o controle da grande rede de realidades para impedir o colapso do cosmos.',
    unlockCondition: 'Derrote o Eco Primordial e complete os 3 Capítulos da Campanha.',
    palette: {
      primary: '#fbbf24',
      secondary: '#701a75',
      accent: '#38bdf8',
      glow: '#fbbf24',
      armorDark: '#1e102d',
      visor: '#ffffff',
    },
  },
];

export class SkinRegistry {
  static getSkin(id: KaelSkinId | string): SkinDefinition {
    const found = KAEL_SKINS.find(s => s.id === id);
    return found ?? KAEL_SKINS[0];
  }

  static getUnlockedSkins(
    completedPhases: string[] = [],
    playerLevel: number = 1,
    discoveredSecretsCount: number = 0,
    defeatedBosses: string[] = [],
    unlockedList: string[] = []
  ): KaelSkinId[] {
    const result: KaelSkinId[] = ['skin-default'];

    if (completedPhases.includes('fase-02') || discoveredSecretsCount >= 3 || unlockedList.includes('skin-explorer')) {
      result.push('skin-explorer');
    }
    if (completedPhases.includes('fase-04') || playerLevel >= 2 || unlockedList.includes('skin-tactical')) {
      result.push('skin-tactical');
    }
    if (completedPhases.includes('fase-06') || playerLevel >= 4 || unlockedList.includes('skin-elite')) {
      result.push('skin-elite');
    }
    if (completedPhases.includes('fase-08') || defeatedBosses.length > 0 || unlockedList.includes('skin-corrupted')) {
      result.push('skin-corrupted');
    }
    if (completedPhases.includes('fase-09') || unlockedList.includes('skin-tachyon')) {
      result.push('skin-tachyon');
    }
    if (completedPhases.includes('fase-10') || unlockedList.includes('skin-ascendant')) {
      result.push('skin-ascendant');
    }
    if (defeatedBosses.includes('sb-eco-primordial') || unlockedList.includes('skin-legendary')) {
      result.push('skin-legendary');
    }

    return Array.from(new Set(result));
  }
}
