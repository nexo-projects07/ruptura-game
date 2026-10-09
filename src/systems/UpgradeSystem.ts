export interface UpgradeCost {
  credits: number;
  matrixCells: number;
}

export function calculateUpgradeCost(
  baseCredits: number,
  baseMatrixCells: number,
  currentLevel: number
): UpgradeCost {
  const level = Number.isFinite(currentLevel) ? Math.max(0, Math.floor(currentLevel)) : 0;
  return {
    credits: Math.ceil(baseCredits * (1 + level * 0.45)),
    matrixCells: baseMatrixCells + level,
  };
}