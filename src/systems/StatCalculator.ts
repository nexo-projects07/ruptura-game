import {
  CalculatedStats,
  EquipmentItem,
  EquippedGearState,
  PlayerState,
  StatModifiers,
} from '../types/game';
import { ItemRegistry } from './ItemRegistry';
import { SkillTreeSystem } from './SkillTreeSystem';
import { getExplorerProfile } from './ExplorerSystem';

/**
 * Bounds and caps for player derived stats to prevent runaway scaling or infinite stats.
 */
export const STAT_LIMITS = {
  MIN_HP: 50,
  MAX_HP: 5000,
  MIN_ATK: 5,
  MAX_ATK: 1000,
  MIN_DEF: 0,
  MAX_DEF: 500,
  MIN_FOCUS: 10,
  MAX_FOCUS: 100,
  MIN_FOCUS_RECOVERY: 0,
  MAX_FOCUS_RECOVERY: 40,
  MIN_CRIT_CHANCE: 0.0,
  MAX_CRIT_CHANCE: 0.75, // 75% max
  MIN_DODGE_BONUS: 0.0,
  MAX_DODGE_BONUS: 0.60, // 60% max
  MIN_DAMAGE_REDUCTION: 0.0,
  MAX_DAMAGE_REDUCTION: 0.65, // 65% max passive mitigation
} as const;

/**
 * Sanitizes an arbitrary input into a safe, finite floating-point or integer number within range.
 */
export function sanitizeNumber(
  value: unknown,
  fallback: number,
  min: number = -Infinity,
  max: number = Infinity
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

export class StatCalculator {
  /**
   * Resolves the list of active equipment items from the player's equipped gear IDs.
   * Returns a clean, non-null list of EquipmentItem objects.
   */
  static getEquippedItems(gearState?: EquippedGearState): EquipmentItem[] {
    if (!gearState) return [];

    const ids = [
      gearState.weaponId,
      gearState.armorId,
      gearState.coreId,
      gearState.accessoryId,
    ].filter((id): id is string => typeof id === 'string' && id.trim().length > 0);

    const items: EquipmentItem[] = [];
    for (const id of ids) {
      const item = ItemRegistry.getItemById(id);
      if (item) {
        items.push(item);
      }
    }
    return items;
  }

  /**
   * Aggregates the stat modifiers from a list of equipment items into a single combined modifier.
   * Guarantees immutability and sanitizes any malformed values.
   */
  static aggregateModifiers(items: readonly EquipmentItem[]): Required<StatModifiers> {
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

    if (!Array.isArray(items)) return total;

    for (const item of items) {
      if (!item || typeof item.stats !== 'object') continue;

      const s = item.stats;
      total.hp += sanitizeNumber(s.hp, 0, -1000, 1000);
      total.atk += sanitizeNumber(s.atk, 0, -500, 500);
      total.def += sanitizeNumber(s.def, 0, -500, 500);
      total.focus += sanitizeNumber(s.focus, 0, -100, 100);
      total.critChance += sanitizeNumber(s.critChance, 0, -1, 1);
      total.focusRecovery += sanitizeNumber(s.focusRecovery, 0, -50, 50);
      total.dodgeBonus += sanitizeNumber(s.dodgeBonus, 0, -1, 1);
      total.damageReduction += sanitizeNumber(s.damageReduction, 0, -1, 1);
    }

    return total;
  }

  /**
   * Calculates final derived stats for Kael based on base stats, upgrades, and gear.
   *
   * Pure function: NEVER mutates the input player object or gear.
   */
  static calculate(
    player: Readonly<PlayerState>,
    overrideGear?: EquippedGearState
  ): CalculatedStats {
    // 1. Sanitize base stats
    const baseHp = sanitizeNumber(player.maxHp, 100, STAT_LIMITS.MIN_HP, STAT_LIMITS.MAX_HP);
    const baseAtk = sanitizeNumber(player.atk, 20, STAT_LIMITS.MIN_ATK, STAT_LIMITS.MAX_ATK);
    const baseDef = sanitizeNumber(player.def, 10, STAT_LIMITS.MIN_DEF, STAT_LIMITS.MAX_DEF);
    const baseFocus = sanitizeNumber(player.focus ?? 30, 30, STAT_LIMITS.MIN_FOCUS, STAT_LIMITS.MAX_FOCUS);

    // 2. Resolve gear and talent modifiers
    const gearState = overrideGear ?? player.equippedGear;
    const equippedItems = this.getEquippedItems(gearState);
    const gearMods = this.aggregateModifiers(equippedItems);
    const talentMods = SkillTreeSystem.getAggregatedTalentStats(player.allocatedTalents, player.activeExplorerId ?? 'kael');
    const explorerMods = getExplorerProfile(player.activeExplorerId).statModifiers;

    // 3. Compute combined stats
    const rawMaxHp = baseHp + gearMods.hp + talentMods.hp + sanitizeNumber(explorerMods.hp, 0, -1000, 1000);
    const rawAtk = baseAtk + gearMods.atk + talentMods.atk + sanitizeNumber(explorerMods.atk, 0, -500, 500);
    const rawDef = baseDef + gearMods.def + talentMods.def + sanitizeNumber(explorerMods.def, 0, -500, 500);
    const rawFocus = baseFocus + gearMods.focus + talentMods.focus + sanitizeNumber(explorerMods.focus, 0, -100, 100);
    const rawFocusRecovery = gearMods.focusRecovery + talentMods.focusRecovery + sanitizeNumber(explorerMods.focusRecovery, 0, -50, 50);
    const rawCritChance = gearMods.critChance + talentMods.critChance + sanitizeNumber(explorerMods.critChance, 0, -1, 1);
    const rawDodgeBonus = gearMods.dodgeBonus + talentMods.dodgeBonus + sanitizeNumber(explorerMods.dodgeBonus, 0, -1, 1);
    const rawDamageReduction = gearMods.damageReduction + talentMods.damageReduction + sanitizeNumber(explorerMods.damageReduction, 0, -1, 1);

    // 4. Apply soft caps and final clamping
    return {
      maxHp: Math.round(sanitizeNumber(rawMaxHp, baseHp, STAT_LIMITS.MIN_HP, STAT_LIMITS.MAX_HP)),
      atk: Math.round(sanitizeNumber(rawAtk, baseAtk, STAT_LIMITS.MIN_ATK, STAT_LIMITS.MAX_ATK)),
      def: Math.round(sanitizeNumber(rawDef, baseDef, STAT_LIMITS.MIN_DEF, STAT_LIMITS.MAX_DEF)),
      baseFocus: Math.round(sanitizeNumber(rawFocus, baseFocus, STAT_LIMITS.MIN_FOCUS, STAT_LIMITS.MAX_FOCUS)),
      focusRecovery: Math.round(sanitizeNumber(rawFocusRecovery, 0, STAT_LIMITS.MIN_FOCUS_RECOVERY, STAT_LIMITS.MAX_FOCUS_RECOVERY)),
      critChance: Number(sanitizeNumber(rawCritChance, 0, STAT_LIMITS.MIN_CRIT_CHANCE, STAT_LIMITS.MAX_CRIT_CHANCE).toFixed(4)),
      dodgeBonus: Number(sanitizeNumber(rawDodgeBonus, 0, STAT_LIMITS.MIN_DODGE_BONUS, STAT_LIMITS.MAX_DODGE_BONUS).toFixed(4)),
      damageReductionPercent: Number(sanitizeNumber(rawDamageReduction, 0, STAT_LIMITS.MIN_DAMAGE_REDUCTION, STAT_LIMITS.MAX_DAMAGE_REDUCTION).toFixed(4)),
    };
  }

  /**
   * Compares currently equipped stats with projected stats if a new item is equipped in its designated slot.
   * Useful for UI item tooltips and comparison cards.
   */
  static compareItem(
    player: Readonly<PlayerState>,
    newItem: EquipmentItem
  ): {
    current: CalculatedStats;
    projected: CalculatedStats;
    diff: {
      maxHp: number;
      atk: number;
      def: number;
      baseFocus: number;
      critChance: number;
      dodgeBonus: number;
    };
  } {
    const current = this.calculate(player);

    const projectedGear: EquippedGearState = {
      ...(player.equippedGear ?? {}),
    };

    switch (newItem.slot) {
      case 'WEAPON':
        projectedGear.weaponId = newItem.id;
        break;
      case 'ARMOR':
        projectedGear.armorId = newItem.id;
        break;
      case 'CORE':
        projectedGear.coreId = newItem.id;
        break;
      case 'ACCESSORY':
        projectedGear.accessoryId = newItem.id;
        break;
    }

    const projected = this.calculate(player, projectedGear);

    const diff = {
      maxHp: projected.maxHp - current.maxHp,
      atk: projected.atk - current.atk,
      def: projected.def - current.def,
      baseFocus: projected.baseFocus - current.baseFocus,
      critChance: Number((projected.critChance - current.critChance).toFixed(4)),
      dodgeBonus: Number((projected.dodgeBonus - current.dodgeBonus).toFixed(4)),
    };

    return { current, projected, diff };
  }
}
