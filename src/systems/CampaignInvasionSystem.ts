import type { CampaignInvasionDefinition, CampaignInvasionOutcome, PlayerState } from '../types/game';

export function resolveCampaignInvasion(
  player: PlayerState,
  invasion: CampaignInvasionDefinition,
  outcome: CampaignInvasionOutcome
): PlayerState {
  const outcomes = player.invasionOutcomes ?? {};
  const current = outcomes[invasion.id]?.outcome;

  if (current === 'SECURED' || current === outcome) return player;

  return {
    ...player,
    invasionOutcomes: {
      ...outcomes,
      [invasion.id]: {
        outcome,
        realmId: invasion.realmId,
        affectedPhaseId: invasion.affectedPhaseId,
        securedConsequence: invasion.securedConsequence,
        breachedConsequence: invasion.breachedConsequence,
      },
    },
  };
}

export function getInvasionThreatMultiplier(player: PlayerState, phaseId: string): number {
  for (const invasion of Object.values(player.invasionOutcomes ?? {})) {
    if (invasion.affectedPhaseId !== phaseId) continue;
    return invasion.outcome === 'SECURED' ? 0.85 : 1.2;
  }
  return 1;
}

export function getInvasionConsequence(
  player: PlayerState,
  invasion: CampaignInvasionDefinition
): string | undefined {
  const outcome = player.invasionOutcomes?.[invasion.id]?.outcome;
  if (!outcome) return undefined;
  return outcome === 'SECURED' ? invasion.securedConsequence : invasion.breachedConsequence;
}

export function getInvasionConsequenceForPhase(player: PlayerState, phaseId: string): string | undefined {
  const event = Object.values(player.invasionOutcomes ?? {}).find(item => item.affectedPhaseId === phaseId);
  if (!event) return undefined;
  return event.outcome === 'SECURED' ? event.securedConsequence : event.breachedConsequence;
}