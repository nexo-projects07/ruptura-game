import type { ExplorerId, StatModifiers } from '../types/game';

export interface ExplorerProfile {
  id: ExplorerId;
  name: string;
  role: string;
  chapter: number;
  biography: string;
  combatStyle: string;
  statModifiers: StatModifiers;
  ultimateName: string;
  ultimateDescription: string;
}

export const EXPLORERS: Record<ExplorerId, ExplorerProfile> = {
  kael: {
    id: 'kael',
    name: 'Kael',
    role: 'Vanguarda Dimensional',
    chapter: 1,
    biography: 'O primeiro explorador enviado ao perímetro de impacto; sua ligação com a Ruptura abre o caminho para o Nexus.',
    combatStyle: 'Equilibrado: combo, precisão e dano concentrado.',
    statModifiers: {},
    ultimateName: 'Overdrive da Matriz',
    ultimateDescription: 'Descarrega a matriz em um golpe de alta penetração.',
  },
  lyra: {
    id: 'lyra',
    name: 'Lyra',
    role: 'Operadora Tática',
    chapter: 2,
    biography: 'Analista de campo que reconstrói os registros das equipes perdidas e transforma leitura de padrões em sobrevivência.',
    combatStyle: 'Suporte: recuperação de foco e mitigação.',
    statModifiers: { focusRecovery: 5, damageReduction: 0.03 },
    ultimateName: 'Ressonância Nanítica',
    ultimateDescription: 'Restaura integridade do traje e estabiliza o foco.',
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus',
    role: 'Baluarte de Titânio',
    chapter: 3,
    biography: 'Especialista de contenção que mantém a linha quando as alianças dimensionais começam a ruir.',
    combatStyle: 'Defesa e controle: absorção de impacto e stagger.',
    statModifiers: { hp: 45, def: 8 },
    ultimateName: 'Bastião Cinético',
    ultimateDescription: 'Converte a matriz em um impacto que rompe postura e reduz a próxima ameaça.',
  },
  kira: {
    id: 'kira',
    name: 'Kira',
    role: 'Algoz do Vazio',
    chapter: 4,
    biography: 'Caçadora de fendas que conhece as rotas de retirada das frotas e ataca antes que o cerco se feche.',
    combatStyle: 'Assalto: crítico, mobilidade e penetração.',
    statModifiers: { atk: 4, critChance: 0.08, dodgeBonus: 0.06 },
    ultimateName: 'Lâmina do Vazio',
    ultimateDescription: 'Um corte de precisão que atravessa a maior parte da defesa inimiga.',
  },
  sena: {
    id: 'sena',
    name: 'Sena',
    role: 'Cartógrafa do Nexus',
    chapter: 5,
    biography: 'Cartógrafa das rotas de convergência; conhece o Nexus por dentro e busca uma saída que não apague nenhuma realidade.',
    combatStyle: 'Convergência: foco, controle e dano híbrido.',
    statModifiers: { focus: 15, focusRecovery: 3, dodgeBonus: 0.03 },
    ultimateName: 'Mapa de Convergência',
    ultimateDescription: 'Sincroniza as linhas temporais para expor e desestabilizar o alvo.',
  },
};

export function getExplorerProfile(id?: string): ExplorerProfile {
  return EXPLORERS[(id as ExplorerId) in EXPLORERS ? id as ExplorerId : 'kael'];
}