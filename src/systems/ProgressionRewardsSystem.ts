import type { PlayerState, RiftRaidMission } from '../types/game';

export interface ExperienceProgress {
  exp: number;
  level: number;
  maxExp: number;
  atk: number;
  maxHp: number;
  talentPoints: number;
}

export function applyExperienceReward(player: PlayerState, amount: number): ExperienceProgress {
  let exp = player.exp + amount;
  let level = player.level;
  let maxExp = player.maxExp;
  let atk = player.atk;
  let maxHp = player.maxHp;
  let talentPoints = player.talentPoints ?? 0;

  while (maxExp > 0 && exp >= maxExp) {
    exp -= maxExp;
    level += 1;
    talentPoints += 1;
    maxExp = Math.floor(maxExp * 1.35);
    atk += 3;
    maxHp += 10;
  }

  return { exp, level, maxExp, atk, maxHp, talentPoints };
}

export function grantExplorationPointReward(
  player: PlayerState,
  pointId: string,
  reward: { credits: number; fragments: number; matrixCells: number }
): PlayerState {
  const discoveredSecrets = player.discoveredSecrets ?? [];
  if (discoveredSecrets.includes(pointId)) return player;

  return {
    ...player,
    credits: player.credits + reward.credits,
    fragments: player.fragments + reward.fragments,
    matrixCells: (player.matrixCells ?? 0) + reward.matrixCells,
    discoveredSecrets: [...discoveredSecrets, pointId],
  };
}

export function hasReceivedRiftRaidReward(player: PlayerState, missionId: string): boolean {
  return player.completedRiftRaids?.includes(missionId) ?? false;
}

export function isRiftRaidUnlocked(mission: RiftRaidMission, completedPhases: readonly string[]): boolean {
  return !mission.requiredPhase || completedPhases.includes(mission.requiredPhase);
}

export function grantRiftRaidReward(player: PlayerState, mission: RiftRaidMission): PlayerState {
  if (hasReceivedRiftRaidReward(player, mission.id)) return player;

  return {
    ...player,
    ...applyExperienceReward(player, 350),
    credits: player.credits + mission.rewardCredits,
    fragments: player.fragments + mission.rewardFragments,
    matrixCells: (player.matrixCells ?? 0) + mission.rewardMatrixCells,
    aetherCores: (player.aetherCores ?? 0) + mission.rewardAetherCores,
    coopRaidsCompleted: (player.coopRaidsCompleted ?? 0) + 1,
    completedRiftRaids: [...(player.completedRiftRaids ?? []), mission.id],
  };
}