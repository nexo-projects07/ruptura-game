import { CAMPAIGN_CHAPTERS } from './CampaignChapters';
import { PlayerState, SecretBossConfig } from '../types/game';
import { applyExperienceReward } from './ProgressionRewardsSystem';

export function inferClaimedChapterRewards(completedPhases: readonly string[]): string[] {
  return CAMPAIGN_CHAPTERS
    .filter(chapter => chapter.legacyFinalPhaseId && completedPhases.includes(chapter.legacyFinalPhaseId))
    .map(chapter => chapter.id);
}

export function inferLegacyChapterMarkers(completedPhases: readonly string[]): string[] {
  return CAMPAIGN_CHAPTERS
    .filter(chapter => chapter.legacyFinalPhaseId && completedPhases.includes(chapter.legacyFinalPhaseId))
    .map(chapter => chapter.id);
}

export function getNextCampaignPhaseId(phaseId: string): string | undefined {
  const chapterIndex = CAMPAIGN_CHAPTERS.findIndex(chapter => chapter.phases.some(phase => phase.id === phaseId));
  if (chapterIndex < 0) return undefined;
  const chapter = CAMPAIGN_CHAPTERS[chapterIndex];
  const phaseIndex = chapter.phases.findIndex(phase => phase.id === phaseId);
  return chapter.phases[phaseIndex + 1]?.id ?? CAMPAIGN_CHAPTERS[chapterIndex + 1]?.phases[0]?.id;
}

export function getLegacyContinuationPhaseIds(completedPhases: readonly string[]): string[] {
  return CAMPAIGN_CHAPTERS.flatMap(chapter => {
    if (!chapter.legacyFinalPhaseId || !completedPhases.includes(chapter.legacyFinalPhaseId)) return [];
    const legacyIndex = chapter.phases.findIndex(phase => phase.id === chapter.legacyFinalPhaseId);
    const continuation = chapter.phases[legacyIndex + 1];
    return continuation ? [continuation.id] : [];
  });
}

export function grantCampaignPhaseRewards(
  player: PlayerState,
  phaseId: string,
  completedPhases: readonly string[],
  timestamp = Date.now()
): PlayerState {
  if (completedPhases.includes(phaseId)) return player;

  const chapter = CAMPAIGN_CHAPTERS.find(
    candidate => candidate.phases.at(-1)?.id === phaseId
  );
  const chapterReward = chapter && !player.claimedChapterRewards?.includes(chapter.id)
    ? chapter.chapterBossReward
    : undefined;
  const progression = applyExperienceReward(player, 120);
  const inventory = [...(player.inventory ?? [])];

  if (chapterReward?.itemId) {
    inventory.push({
      instanceId: `chapter-${phaseId}-${timestamp}`,
      itemId: chapterReward.itemId,
      equipped: false,
      acquiredAt: timestamp,
    });
  }

  const unlockedSkins = chapterReward?.skinId
    ? Array.from(new Set([...(player.unlockedSkins ?? []), chapterReward.skinId]))
    : player.unlockedSkins;

  return {
    ...player,
    ...progression,
    hp: progression.maxHp,
    credits: player.credits + 50 + (chapterReward?.credits ?? 0),
    fragments: player.fragments + 1,
    matrixCells: (player.matrixCells ?? 0) + 1 + (chapterReward?.matrixCells ?? 0),
    inventory,
    unlockedSkins,
    claimedChapterRewards: chapterReward && chapter
      ? Array.from(new Set([...(player.claimedChapterRewards ?? []), chapter.id]))
      : player.claimedChapterRewards,
  };
}

export function grantSecretBossRewards(
  player: PlayerState,
  boss: SecretBossConfig,
  timestamp = Date.now()
): PlayerState {
  if (player.defeatedSecretBosses?.includes(boss.id)) return player;

  const reward = boss.rewards;
  const progression = applyExperienceReward(player, reward.exp);
  const inventory = [...(player.inventory ?? [])];

  if (reward.itemId) {
    inventory.push({
      instanceId: `boss-${boss.id}-${timestamp}`,
      itemId: reward.itemId,
      equipped: false,
      acquiredAt: timestamp,
    });
  }

  return {
    ...player,
    ...progression,
    hp: progression.maxHp,
    credits: player.credits + reward.credits,
    fragments: player.fragments + reward.fragments,
    matrixCells: (player.matrixCells ?? 0) + (reward.matrixCells ?? 0),
    inventory,
    defeatedSecretBosses: [...(player.defeatedSecretBosses ?? []), boss.id],
  };
}