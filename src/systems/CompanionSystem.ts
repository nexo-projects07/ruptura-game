import { CompanionRole } from '../types/game';

export interface CompanionAbility {
  role: CompanionRole;
  name: string;
  title: string;
  description: string;
  cooldown: number;
}

export const COMPANION_ABILITIES: Record<CompanionRole, CompanionAbility> = {
  LYRA_TACTICIAN: {
    role: 'LYRA_TACTICIAN',
    name: 'Lyra',
    title: 'Pulso Nanítico',
    description: 'Recupera 45 HP e 30 de foco.',
    cooldown: 3,
  },
  MARCUS_JUGGERNAUT: {
    role: 'MARCUS_JUGGERNAUT',
    name: 'Marcus',
    title: 'Impacto de Baluarte',
    description: 'Causa 40% de quebra de postura e pode atordoar o alvo.',
    cooldown: 3,
  },
  KIRA_VOID: {
    role: 'KIRA_VOID',
    name: 'Kira',
    title: 'Lâmina do Vazio',
    description: 'Causa dano de precisão escalado pelo ataque de Kael.',
    cooldown: 3,
  },
};

export const COMPANION_ROLES = Object.keys(COMPANION_ABILITIES) as CompanionRole[];

export function getNextCompanionRole(current: CompanionRole): CompanionRole {
  const currentIndex = COMPANION_ROLES.indexOf(current);
  return COMPANION_ROLES[(currentIndex + 1) % COMPANION_ROLES.length];
}