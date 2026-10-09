export function calculateDamageAgainstDefense(
  rawDamage: number,
  defense: number,
  armorPenetration = 0
): number {
  const damage = Number.isFinite(rawDamage) ? Math.max(0, rawDamage) : 0;
  const armor = Number.isFinite(defense) ? Math.max(0, defense) : 0;
  const penetration = Number.isFinite(armorPenetration)
    ? Math.min(1, Math.max(0, armorPenetration))
    : 0;

  return Math.max(1, Math.floor(damage - armor * (1 - penetration) * 0.35));
}