export type RelayAction = 'DISRUPT' | 'BRACE' | 'REPAIR';

export interface RelayDefenseResult {
  integrity: number;
  damage: number;
  repaired: number;
  telegraphed: boolean;
}

export function isFrequencyDecoded(frequency: number, target: number, tolerance = 25): boolean {
  return Number.isFinite(frequency) && Number.isFinite(target) && Math.abs(frequency - target) <= tolerance;
}

export function resolveRelayDefense(
  integrity: number,
  defense: number,
  attack: number,
  round: number,
  action: RelayAction
): RelayDefenseResult {
  const telegraphed = round % 2 === 1;
  const rawAttack = Math.max(0, Number.isFinite(attack) ? attack : 0) * (telegraphed ? 1.35 : 0.85);
  const safeDefense = Math.max(0, Number.isFinite(defense) ? defense : 0);
  const multiplier = action === 'DISRUPT'
    ? telegraphed ? 0.2 : 0.75
    : action === 'BRACE'
    ? 0.45
    : 0.8;
  const damage = Math.max(0, Math.ceil(rawAttack * multiplier - safeDefense * 0.25));
  const repaired = action === 'REPAIR' ? 20 : 0;
  const currentIntegrity = Math.min(100, Math.max(0, Number.isFinite(integrity) ? integrity : 0));

  return {
    integrity: Math.min(100, Math.max(0, currentIntegrity - damage + repaired)),
    damage,
    repaired,
    telegraphed,
  };
}

export interface ExtractionStep {
  nextIndex: number;
  errors: number;
  correct: boolean;
  failed: boolean;
}

export function advanceExtraction(
  sequence: readonly string[],
  currentIndex: number,
  choice: string,
  errors: number,
  maxErrors = 2
): ExtractionStep {
  const correct = sequence[currentIndex] === choice;
  const nextIndex = correct ? currentIndex + 1 : currentIndex;
  const nextErrors = correct ? errors : errors + 1;
  return {
    nextIndex,
    errors: nextErrors,
    correct,
    failed: nextErrors >= maxErrors,
  };
}