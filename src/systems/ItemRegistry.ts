import { EquipmentItem, EquipmentSlot, ItemRarity } from '../types/game';

/**
 * Deep freezes an array of equipment items so that runtime modifications are impossible.
 */
function freezeCatalog(items: EquipmentItem[]): readonly EquipmentItem[] {
  items.forEach(item => {
    Object.freeze(item.stats);
    Object.freeze(item);
  });
  return Object.freeze(items);
}

const RAW_ITEMS: EquipmentItem[] = [
  // ==========================================
  // ARMAS (WEAPONS)
  // ==========================================
  {
    id: 'wpn-01',
    name: 'Faca Térmica de Reconhecimento',
    description: 'Lâmina retrátil padrão distribuída aos exploradores da defesa metropolitana de Nova Arcádia.',
    lore: 'Produzida em massa antes do colapso de 2147 para técnicos de telecomunicações.',
    slot: 'WEAPON',
    rarity: 'COMMON',
    stats: {
      atk: 6,
    },
    requiredLevel: 1,
    creditValue: 40,
  },
  {
    id: 'wpn-02',
    name: 'Sabre de Plasma Bifásico',
    description: 'Emite um feixe pressurizado de partículas carregadas capaz de cortar blindagens fragmentadas.',
    lore: 'Recuperado dos arsenais da Guarda Civil após o isolamento do Distrito Central.',
    slot: 'WEAPON',
    rarity: 'RARE',
    stats: {
      atk: 14,
      critChance: 0.05,
    },
    requiredLevel: 2,
    creditValue: 120,
    matrixCost: 1,
  },
  {
    id: 'wpn-03',
    name: 'Lança-Pulsos de Ruptura',
    description: 'Arma pesada de impacto sônico sintetizada para romper a estabilidade dimensional de anomalias.',
    lore: 'Protótipo militar abandonado durante a evacuação do Complexo Industrial.',
    slot: 'WEAPON',
    rarity: 'EPIC',
    stats: {
      atk: 24,
      focus: 10,
      critChance: 0.08,
    },
    requiredLevel: 4,
    creditValue: 300,
    matrixCost: 3,
  },
  {
    id: 'wpn-04',
    name: 'Lâmina da Singularidade de Kael',
    description: 'Arma forjada com os resíduos colapsados do Marco Zero, vibrando na frequência primordial da Convergência.',
    lore: 'Uma lâmina que existe em múltiplas linhas temporais ao mesmo instante.',
    slot: 'WEAPON',
    rarity: 'LEGENDARY',
    stats: {
      atk: 38,
      focus: 20,
      critChance: 0.15,
    },
    requiredLevel: 6,
    creditValue: 750,
    matrixCost: 5,
  },

  // ==========================================
  // ARMADURAS E NANOTRAJES (ARMOR)
  // ==========================================
  {
    id: 'arm-01',
    name: 'Colete de Fibra Balística',
    description: 'Colete de polímero leve que oferece absorção de choques cinéticos e detritos urbanos.',
    lore: 'Equipamento básico do kit de emergência das estações subterrâneas.',
    slot: 'ARMOR',
    rarity: 'COMMON',
    stats: {
      hp: 25,
      def: 4,
    },
    requiredLevel: 1,
    creditValue: 45,
  },
  {
    id: 'arm-02',
    name: 'Nanotraje de Contenção de Fenda',
    description: 'Malha hermética com isolamento táquionico para reduzir o desgaste celular em zonas de anomalia.',
    lore: 'Desenvolvido pelos laboratórios do Setor 02 para permitir investigações no Distrito Industrial.',
    slot: 'ARMOR',
    rarity: 'RARE',
    stats: {
      hp: 60,
      def: 9,
      damageReduction: 0.04,
    },
    requiredLevel: 2,
    creditValue: 130,
    matrixCost: 1,
  },
  {
    id: 'arm-03',
    name: 'Armadura de Fácies Refratária',
    description: 'Placas hexagonais de liga refratária que dissipam campos de força e absorvem impactos em área.',
    lore: 'Utilizada pelos esquadrões de elite enviados para conter a Grande Ruptura.',
    slot: 'ARMOR',
    rarity: 'EPIC',
    stats: {
      hp: 110,
      def: 16,
      damageReduction: 0.08,
    },
    requiredLevel: 4,
    creditValue: 320,
    matrixCost: 3,
  },
  {
    id: 'arm-04',
    name: 'Égide Quântica de Nova Arcádia',
    description: 'O nanotraje definitivo, projetado pelos arquitetos originais para sobreviver à morte térmica do universo.',
    lore: 'A última linha de defesa entre o corpo de Kael e a dissolução de matéria.',
    slot: 'ARMOR',
    rarity: 'LEGENDARY',
    stats: {
      hp: 180,
      def: 26,
      damageReduction: 0.14,
    },
    requiredLevel: 6,
    creditValue: 800,
    matrixCost: 5,
  },

  // ==========================================
  // NÚCLEOS DE MATRIZ (CORES)
  // ==========================================
  {
    id: 'cor-01',
    name: 'Célula Energética Auxiliar',
    description: 'Microgerador de fluxo de íons que mantém os sistemas do traje alimentados.',
    lore: 'Recarregável em qualquer terminal padrão de Nova Arcádia.',
    slot: 'CORE',
    rarity: 'COMMON',
    stats: {
      hp: 15,
      focus: 5,
    },
    requiredLevel: 1,
    creditValue: 35,
  },
  {
    id: 'cor-02',
    name: 'Núcleo de Ressonância Táquionica',
    description: 'Estabiliza a taxa de condensação de energia, regenerando foco continuamente a cada turno.',
    lore: 'Extraído dos condensadores da Estação Ômega.',
    slot: 'CORE',
    rarity: 'RARE',
    stats: {
      atk: 6,
      focus: 10,
      focusRecovery: 5,
    },
    requiredLevel: 2,
    creditValue: 140,
    matrixCost: 1,
  },
  {
    id: 'cor-03',
    name: 'Matriz de Dobra Hiperespectral',
    description: 'Núcleo de pesquisa que sintoniza as frequências de vácuo, concedendo poder e foco substanciais.',
    lore: 'Resgatado do reator de confinamento do Laboratório de Contenção.',
    slot: 'CORE',
    rarity: 'EPIC',
    stats: {
      atk: 10,
      def: 6,
      focus: 25,
      focusRecovery: 10,
    },
    requiredLevel: 4,
    creditValue: 340,
    matrixCost: 3,
  },
  {
    id: 'cor-04',
    name: 'Coração da Convergência Primordial',
    description: 'O núcleo definitivo de poder do Nexus, pulsando com a força motriz de todas as realidades fundidas.',
    lore: 'A essência estabilizadora que impede o colapso irreversível das dimensões.',
    slot: 'CORE',
    rarity: 'LEGENDARY',
    stats: {
      atk: 18,
      def: 12,
      focus: 40,
      focusRecovery: 15,
      critChance: 0.10,
    },
    requiredLevel: 6,
    creditValue: 850,
    matrixCost: 6,
  },

  // ==========================================
  // ACESSÓRIOS TECNOLÓGICOS (ACCESSORIES)
  // ==========================================
  {
    id: 'acc-01',
    name: 'Visor Holográfico de Reconhecimento',
    description: 'Interface ocular com leitura de trajetórias e detecção antecipada de ameaças hostis.',
    lore: 'Calibrado com os satélites de mapeamento orbital de Nova Arcádia.',
    slot: 'ACCESSORY',
    rarity: 'COMMON',
    stats: {
      dodgeBonus: 0.04,
    },
    requiredLevel: 1,
    creditValue: 30,
  },
  {
    id: 'acc-02',
    name: 'Giroscópio Gravitacional de Pulso',
    description: 'Módulo de pulso montado na cintura que impulsiona o usuário para fora da trajetória de projéteis.',
    lore: 'Equipamento essencial de segurança para operários da Torre de Vigilância.',
    slot: 'ACCESSORY',
    rarity: 'RARE',
    stats: {
      atk: 5,
      dodgeBonus: 0.08,
    },
    requiredLevel: 2,
    creditValue: 125,
    matrixCost: 1,
  },
  {
    id: 'acc-03',
    name: 'Amuleto de Crono-Deslocamento',
    description: 'Relógio quântico miniaturizado que distorce frações de milissegundo durante momentos críticos.',
    lore: 'Criado pelos físicos que previram o colapso temporal de 2147.',
    slot: 'ACCESSORY',
    rarity: 'EPIC',
    stats: {
      def: 8,
      critChance: 0.08,
      dodgeBonus: 0.14,
    },
    requiredLevel: 4,
    creditValue: 310,
    matrixCost: 3,
  },
  {
    id: 'acc-04',
    name: 'Anel da Ruptura Estelar',
    description: 'Artefato que curva a geometria do espaço local ao redor do portador, elevando todos os reflexos.',
    lore: 'Encontrado além do Véu, nas ruínas da linha temporal primordial.',
    slot: 'ACCESSORY',
    rarity: 'LEGENDARY',
    stats: {
      atk: 15,
      def: 15,
      critChance: 0.12,
      dodgeBonus: 0.20,
    },
    requiredLevel: 6,
    creditValue: 780,
    matrixCost: 5,
  },
];

export const ITEM_CATALOG: readonly EquipmentItem[] = freezeCatalog(RAW_ITEMS);

// Quick lookup index by ID for O(1) performance
const ITEM_MAP: ReadonlyMap<string, EquipmentItem> = new Map(
  ITEM_CATALOG.map(item => [item.id, item])
);

export class ItemRegistry {
  /**
   * Retrieves an item by its unique ID. Returns undefined if not found.
   */
  static getItemById(id: string): EquipmentItem | undefined {
    return ITEM_MAP.get(id);
  }

  /**
   * Returns all items in the catalog (immutable array).
   */
  static getAllItems(): readonly EquipmentItem[] {
    return ITEM_CATALOG;
  }

  /**
   * Returns all items matching the specified equipment slot.
   */
  static getItemsBySlot(slot: EquipmentSlot): EquipmentItem[] {
    return ITEM_CATALOG.filter(item => item.slot === slot);
  }

  /**
   * Returns all items matching the specified rarity.
   */
  static getItemsByRarity(rarity: ItemRarity): EquipmentItem[] {
    return ITEM_CATALOG.filter(item => item.rarity === rarity);
  }

  /**
   * Verifies if an item ID exists in the registry.
   */
  static hasItem(id: string): boolean {
    return ITEM_MAP.has(id);
  }
}
