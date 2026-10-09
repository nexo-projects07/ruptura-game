import { PlayerState, StatModifiers, TalentBranch, TalentNode } from '../types/game';

export const TALENT_TREE: readonly TalentNode[] = Object.freeze([
  // ----------------------------------------------------
  // RAMO 1: ASSALTO QUÂNTICO (QUANTUM ASSAULT)
  // ----------------------------------------------------
  {
    id: 'qa-01',
    branch: 'QUANTUM_ASSAULT',
    name: 'Foco Cortante',
    description: 'Aprimora o foco de energia nas extremidades das armas para desferir cortes mais profundos.',
    tier: 1,
    requiredLevel: 1,
    costPoints: 1,
    stats: { atk: 6 },
    specialEffect: '+6 de Poder de Ataque permanente.',
  },
  {
    id: 'qa-02',
    branch: 'QUANTUM_ASSAULT',
    name: 'Fúria de Fase',
    description: 'Sintoniza os disparos em frequências de fase para ignorar frações da armadura inimiga.',
    tier: 2,
    requiredLevel: 2,
    requiredTalents: ['qa-01'],
    costPoints: 1,
    stats: { atk: 12, critChance: 0.05 },
    specialEffect: '+12 ATK e +5% de Chance Crítica.',
  },
  {
    id: 'qa-03',
    branch: 'QUANTUM_ASSAULT',
    name: 'Ruptura Crítica',
    description: 'Canaliza micro-dobras gravitacionais em cada impacto, aumentando o multiplicador de choque.',
    tier: 3,
    requiredLevel: 4,
    requiredTalents: ['qa-02'],
    costPoints: 2,
    stats: { atk: 18, critChance: 0.10 },
    specialEffect: '+18 ATK e +10% de Chance Crítica.',
  },
  {
    id: 'qa-04',
    branch: 'QUANTUM_ASSAULT',
    name: 'Colapso de Matéria',
    description: 'O ápice do assalto dimensional: ataques quebram a postura do inimigo duas vezes mais rápido.',
    tier: 4,
    requiredLevel: 6,
    requiredTalents: ['qa-03'],
    costPoints: 3,
    costMatrixCells: 2,
    stats: { atk: 30, critChance: 0.15, focus: 15 },
    specialEffect: '+30 ATK, +15% Crítico e +15 de Foco Máximo.',
  },

  // ----------------------------------------------------
  // RAMO 2: GUARDIÃO DE MATRIZ (MATRIX GUARDIAN)
  // ----------------------------------------------------
  {
    id: 'mg-01',
    branch: 'MATRIX_GUARDIAN',
    name: 'Placas Refratárias',
    description: 'Reforço de nanografeno que protege órgãos vitais contra estilhaços e radiação da fenda.',
    tier: 1,
    requiredLevel: 1,
    costPoints: 1,
    stats: { hp: 30, def: 5 },
    specialEffect: '+30 HP Máximo e +5 DEF.',
  },
  {
    id: 'mg-02',
    branch: 'MATRIX_GUARDIAN',
    name: 'Regeneração Táquionica',
    description: 'Nano-reparadores que absorvem calor ambiental e restauram a integridade estrutural do traje.',
    tier: 2,
    requiredLevel: 2,
    requiredTalents: ['mg-01'],
    costPoints: 1,
    stats: { hp: 60, def: 8, damageReduction: 0.04 },
    specialEffect: '+60 HP, +8 DEF e +4% de Redução de Dano.',
  },
  {
    id: 'mg-03',
    branch: 'MATRIX_GUARDIAN',
    name: 'Barreira Adaptativa',
    description: 'Escudo energético de polaridade invertida que se adapta aos ataques dos chefes.',
    tier: 3,
    requiredLevel: 4,
    requiredTalents: ['mg-02'],
    costPoints: 2,
    stats: { hp: 100, def: 15, damageReduction: 0.08 },
    specialEffect: '+100 HP, +15 DEF e +8% de Redução de Dano.',
  },
  {
    id: 'mg-04',
    branch: 'MATRIX_GUARDIAN',
    name: 'Fortaleza Inviolável',
    description: 'O nanotraje bloqueia oscilações de vácuo, tornando Kael resistente a golpes massivos.',
    tier: 4,
    requiredLevel: 6,
    requiredTalents: ['mg-03'],
    costPoints: 3,
    costMatrixCells: 2,
    stats: { hp: 160, def: 25, damageReduction: 0.14 },
    specialEffect: '+160 HP, +25 DEF e +14% de Redução de Dano.',
  },

  // ----------------------------------------------------
  // RAMO 3: MANIPULAÇÃO TEMPORAL (TEMPORAL WARP)
  // ----------------------------------------------------
  {
    id: 'tw-01',
    branch: 'TEMPORAL_WARP',
    name: 'Reflexos de Dobra',
    description: 'Acelera a resposta neural de Kael, facilitando a esquiva de ataques telegrafados.',
    tier: 1,
    requiredLevel: 1,
    costPoints: 1,
    stats: { dodgeBonus: 0.05 },
    specialEffect: '+5% de Bônus de Esquiva.',
  },
  {
    id: 'tw-02',
    branch: 'TEMPORAL_WARP',
    name: 'Foco Contínuo',
    description: 'Sincroniza o relógio biológico com o fluxo da fenda para recuperar foco todo turno.',
    tier: 2,
    requiredLevel: 2,
    requiredTalents: ['tw-01'],
    costPoints: 1,
    stats: { dodgeBonus: 0.08, focusRecovery: 5 },
    specialEffect: '+8% de Esquiva e +5 de Foco por Turno.',
  },
  {
    id: 'tw-03',
    branch: 'TEMPORAL_WARP',
    name: 'Passo Fantasma',
    description: 'Permite deslocar-se através de micro-descontinuidades espaciais durante o combate.',
    tier: 3,
    requiredLevel: 4,
    requiredTalents: ['tw-02'],
    costPoints: 2,
    stats: { dodgeBonus: 0.14, focusRecovery: 10, atk: 8 },
    specialEffect: '+14% de Esquiva, +10 Foco/Turno e +8 ATK.',
  },
  {
    id: 'tw-04',
    branch: 'TEMPORAL_WARP',
    name: 'Crono-Singularidade',
    description: 'Domínio temporal completo: desacelera a velocidade relativa dos inimigos ao atacar.',
    tier: 4,
    requiredLevel: 6,
    requiredTalents: ['tw-03'],
    costPoints: 3,
    costMatrixCells: 2,
    stats: { dodgeBonus: 0.22, focusRecovery: 15, atk: 14 },
    specialEffect: '+22% de Esquiva, +15 Foco/Turno e +14 ATK.',
  },

  // ----------------------------------------------------
  // RAMO 4: CONVERGÊNCIA (CONVERGENCE)
  // ----------------------------------------------------
  {
    id: 'cv-01',
    branch: 'CONVERGENCE',
    name: 'Ressonância Primordial',
    description: 'Desperta a afinidade natural de Kael com a matéria interdimensional do Nexus.',
    tier: 1,
    requiredLevel: 1,
    costPoints: 1,
    stats: { focus: 15, atk: 5, def: 5 },
    specialEffect: '+15 Foco Base, +5 ATK e +5 DEF.',
  },
  {
    id: 'cv-02',
    branch: 'CONVERGENCE',
    name: 'Sinergia Multiversal',
    description: 'Canaliza poder das outras quatro realidades para fortalecer habilidades quânticas.',
    tier: 2,
    requiredLevel: 2,
    requiredTalents: ['cv-01'],
    costPoints: 1,
    stats: { focus: 25, atk: 10, def: 8 },
    specialEffect: '+25 Foco Base, +10 ATK e +8 DEF.',
  },
  {
    id: 'cv-03',
    branch: 'CONVERGENCE',
    name: 'Foco Ilimitado',
    description: 'Permite ativar habilidades avançadas com tempo de recarga reduzido.',
    tier: 3,
    requiredLevel: 4,
    requiredTalents: ['cv-02'],
    costPoints: 2,
    stats: { focus: 35, atk: 16, def: 12, critChance: 0.06 },
    specialEffect: '+35 Foco Base, +16 ATK, +12 DEF e +6% Crítico.',
  },
  {
    id: 'cv-04',
    branch: 'CONVERGENCE',
    name: 'Avatar do Véu',
    description: 'A transformação definitiva: Kael transcende os limites de uma única realidade.',
    tier: 4,
    requiredLevel: 6,
    requiredTalents: ['cv-03'],
    costPoints: 3,
    costMatrixCells: 3,
    stats: { focus: 50, atk: 25, def: 20, critChance: 0.10, dodgeBonus: 0.10 },
    specialEffect: '+50 Foco, +25 ATK, +20 DEF, +10% Crítico e +10% Esquiva.',
  },
]);

const TALENT_MAP = new Map<string, TalentNode>(
  TALENT_TREE.map(node => [node.id, node])
);

export class SkillTreeSystem {
  static getTalentById(id: string): TalentNode | undefined {
    return TALENT_MAP.get(id);
  }

  static getTalentsByBranch(branch: TalentBranch): TalentNode[] {
    return TALENT_TREE.filter(node => node.branch === branch);
  }

  /**
   * Validates whether a player can unlock a given talent node.
   */
  static canUnlockTalent(player: Readonly<PlayerState>, talentId: string): { canUnlock: boolean; reason?: string } {
    const talent = TALENT_MAP.get(talentId);
    if (!talent) return { canUnlock: false, reason: 'Talento não encontrado.' };

    const allocated = player.allocatedTalents ?? [];
    if (allocated.includes(talentId)) {
      return { canUnlock: false, reason: 'Talento já desbloqueado.' };
    }

    if (player.level < talent.requiredLevel) {
      return { canUnlock: false, reason: `Requer Nível ${talent.requiredLevel} do explorador.` };
    }

    const availablePoints = player.talentPoints ?? 0;
    if (availablePoints < talent.costPoints) {
      return { canUnlock: false, reason: `Pontos de talento insuficientes (${availablePoints}/${talent.costPoints}).` };
    }

    if (talent.costMatrixCells && (player.matrixCells ?? 0) < talent.costMatrixCells) {
      return { canUnlock: false, reason: `Células de Matriz insuficientes (${player.matrixCells ?? 0}/${talent.costMatrixCells}).` };
    }

    // Check prerequisites
    if (talent.requiredTalents && talent.requiredTalents.length > 0) {
      for (const reqId of talent.requiredTalents) {
        if (!allocated.includes(reqId)) {
          const reqNode = TALENT_MAP.get(reqId);
          return { canUnlock: false, reason: `Requer o talento "${reqNode?.name ?? reqId}".` };
        }
      }
    }

    return { canUnlock: true };
  }

  /**
   * Aggregates all stat modifiers from all allocated talents.
   */
  static getAggregatedTalentStats(allocatedTalentIds?: string[]): Required<StatModifiers> {
    const total: Required<StatModifiers> = {
      hp: 0,
      atk: 0,
      def: 0,
      focus: 0,
      critChance: 0,
      focusRecovery: 0,
      dodgeBonus: 0,
      damageReduction: 0,
    };

    if (!Array.isArray(allocatedTalentIds)) return total;

    for (const id of allocatedTalentIds) {
      const node = TALENT_MAP.get(id);
      if (!node || !node.stats) continue;

      if (node.stats.hp) total.hp += node.stats.hp;
      if (node.stats.atk) total.atk += node.stats.atk;
      if (node.stats.def) total.def += node.stats.def;
      if (node.stats.focus) total.focus += node.stats.focus;
      if (node.stats.critChance) total.critChance += node.stats.critChance;
      if (node.stats.focusRecovery) total.focusRecovery += node.stats.focusRecovery;
      if (node.stats.dodgeBonus) total.dodgeBonus += node.stats.dodgeBonus;
      if (node.stats.damageReduction) total.damageReduction += node.stats.damageReduction;
    }

    return total;
  }
}
