import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Sword,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  X
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { EquipmentItem, EquipmentSlot, ItemRarity, PlayerState } from '../types/game';
import { ItemRegistry } from '../systems/ItemRegistry';
import { StatCalculator } from '../systems/StatCalculator';
import { audio } from '../systems/AudioEngine';

interface InventorySceneProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onBackToNexus: () => void;
}

export const InventoryScene: React.FC<InventorySceneProps> = ({
  player,
  setPlayer,
  onBackToNexus,
}) => {
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<EquipmentSlot | 'ALL'>('ALL');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Derive all active player inventory items
  const inventorySlots = player.inventory ?? [];
  const inventoryItems: { slotData: typeof inventorySlots[0]; item: EquipmentItem }[] = [];

  for (const slot of inventorySlots) {
    const item = ItemRegistry.getItemById(slot.itemId);
    if (item) {
      inventoryItems.push({ slotData: slot, item });
    }
  }

  // Calculate live stats
  const calculatedStats = StatCalculator.calculate(player);

  // Equipped gear lookup
  const equippedGear = player.equippedGear ?? {};
  const equippedWeapon = equippedGear.weaponId ? ItemRegistry.getItemById(equippedGear.weaponId) : null;
  const equippedArmor = equippedGear.armorId ? ItemRegistry.getItemById(equippedGear.armorId) : null;
  const equippedCore = equippedGear.coreId ? ItemRegistry.getItemById(equippedGear.coreId) : null;
  const equippedAccessory = equippedGear.accessoryId ? ItemRegistry.getItemById(equippedGear.accessoryId) : null;

  // Equip an item
  const handleEquip = (item: EquipmentItem) => {
    if (player.level < item.requiredLevel) {
      audio.playDenied();
      setFeedbackToast(`Requer Nível ${item.requiredLevel} do explorador.`);
      setTimeout(() => setFeedbackToast(null), 2500);
      return;
    }

    audio.playUpgrade();
    setPlayer(prev => {
      const nextGear = { ...(prev.equippedGear ?? {}) };

      switch (item.slot) {
        case 'WEAPON':
          nextGear.weaponId = item.id;
          break;
        case 'ARMOR':
          nextGear.armorId = item.id;
          break;
        case 'CORE':
          nextGear.coreId = item.id;
          break;
        case 'ACCESSORY':
          nextGear.accessoryId = item.id;
          break;
      }

      // Mark slot equipped in inventory list
      const nextInventory = (prev.inventory ?? []).map(inv => ({
        ...inv,
        equipped: inv.itemId === item.id ? true : inv.equipped,
      }));

      return {
        ...prev,
        equippedGear: nextGear,
        inventory: nextInventory,
      };
    });

    setFeedbackToast(`Equipado: ${item.name}!`);
    setTimeout(() => setFeedbackToast(null), 2200);
  };

  // Unequip slot
  const handleUnequip = (slot: EquipmentSlot) => {
    audio.playClick();
    setPlayer(prev => {
      const nextGear = { ...(prev.equippedGear ?? {}) };
      let unequippedId: string | null = null;

      switch (slot) {
        case 'WEAPON':
          unequippedId = nextGear.weaponId ?? null;
          nextGear.weaponId = null;
          break;
        case 'ARMOR':
          unequippedId = nextGear.armorId ?? null;
          nextGear.armorId = null;
          break;
        case 'CORE':
          unequippedId = nextGear.coreId ?? null;
          nextGear.coreId = null;
          break;
        case 'ACCESSORY':
          unequippedId = nextGear.accessoryId ?? null;
          nextGear.accessoryId = null;
          break;
      }

      const nextInventory = (prev.inventory ?? []).map(inv => ({
        ...inv,
        equipped: inv.itemId === unequippedId ? false : inv.equipped,
      }));

      return {
        ...prev,
        equippedGear: nextGear,
        inventory: nextInventory,
      };
    });

    setFeedbackToast('Item desequipado com sucesso.');
    setTimeout(() => setFeedbackToast(null), 2200);
  };

  // Filter items
  const filteredItems = inventoryItems.filter(({ item }) => {
    if (selectedSlotFilter === 'ALL') return true;
    return item.slot === selectedSlotFilter;
  });

  const getRarityBadgeColor = (rarity: ItemRarity) => {
    switch (rarity) {
      case 'COMMON':
        return 'text-slate-300 border-slate-700 bg-slate-900/60';
      case 'RARE':
        return 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60';
      case 'EPIC':
        return 'text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-950/60';
      case 'LEGENDARY':
        return 'text-amber-300 border-amber-500/50 bg-amber-950/70 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
    }
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto space-y-6 py-4">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <button
            onClick={onBackToNexus}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center gap-2 text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR AO NEXUS</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <Sword className="w-4 h-4 text-cyan-400" />
            <span className="tracking-widest">INVENTÁRIO & EQUIPAMENTOS DE KAEL</span>
          </div>
        </div>

        {feedbackToast && (
          <div className="p-2.5 bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-xs rounded-xl flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Live Derived Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-md text-center text-xs">
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">HP MÁXIMO</span>
            <span className="font-bold text-emerald-400">{calculatedStats.maxHp}</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">ATAQUE</span>
            <span className="font-bold text-cyan-400">{calculatedStats.atk}</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">DEFESA</span>
            <span className="font-bold text-blue-400">{calculatedStats.def}</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">FOCO BASE</span>
            <span className="font-bold text-fuchsia-400">{calculatedStats.baseFocus}</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">REC. FOCO</span>
            <span className="font-bold text-fuchsia-300">+{calculatedStats.focusRecovery}/T</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">CRÍTICO</span>
            <span className="font-bold text-amber-400">{Math.round(calculatedStats.critChance * 100)}%</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">ESQUIVA</span>
            <span className="font-bold text-indigo-400">{Math.round(calculatedStats.dodgeBonus * 100)}%</span>
          </div>
          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">REDUÇÃO</span>
            <span className="font-bold text-teal-400">{Math.round(calculatedStats.damageReductionPercent * 100)}%</span>
          </div>
        </div>

        {/* Main Section: 4 Equipped Slots & Item Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 4 Equipped Slots */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              EQUIPAMENTOS ATIVOS (4 SLOTS)
            </span>

            {/* Slot: Weapon */}
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-cyan-500/40 text-cyan-400">
                  <Sword className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">ARMA</span>
                  <h4 className="text-xs font-bold text-white">
                    {equippedWeapon ? equippedWeapon.name : 'Nenhuma Arma Equipada'}
                  </h4>
                  {equippedWeapon && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border ${getRarityBadgeColor(equippedWeapon.rarity)}`}>
                      {equippedWeapon.rarity} • +{equippedWeapon.stats.atk} ATK
                    </span>
                  )}
                </div>
              </div>
              {equippedWeapon && (
                <button
                  onClick={() => handleUnequip('WEAPON')}
                  className="text-[10px] text-rose-400 hover:text-rose-300 underline"
                >
                  Desequipar
                </button>
              )}
            </div>

            {/* Slot: Armor */}
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-blue-500/40 text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">ARMADURA / NANOTRAJE</span>
                  <h4 className="text-xs font-bold text-white">
                    {equippedArmor ? equippedArmor.name : 'Nenhuma Armadura Equipada'}
                  </h4>
                  {equippedArmor && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border ${getRarityBadgeColor(equippedArmor.rarity)}`}>
                      {equippedArmor.rarity} • +{equippedArmor.stats.hp} HP
                    </span>
                  )}
                </div>
              </div>
              {equippedArmor && (
                <button
                  onClick={() => handleUnequip('ARMOR')}
                  className="text-[10px] text-rose-400 hover:text-rose-300 underline"
                >
                  Desequipar
                </button>
              )}
            </div>

            {/* Slot: Core */}
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-fuchsia-500/40 text-fuchsia-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">NÚCLEO DE MATRIZ</span>
                  <h4 className="text-xs font-bold text-white">
                    {equippedCore ? equippedCore.name : 'Nenhum Núcleo Equipado'}
                  </h4>
                  {equippedCore && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border ${getRarityBadgeColor(equippedCore.rarity)}`}>
                      {equippedCore.rarity} • +{equippedCore.stats.focus} FOCO
                    </span>
                  )}
                </div>
              </div>
              {equippedCore && (
                <button
                  onClick={() => handleUnequip('CORE')}
                  className="text-[10px] text-rose-400 hover:text-rose-300 underline"
                >
                  Desequipar
                </button>
              )}
            </div>

            {/* Slot: Accessory */}
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/40 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">ACESSÓRIO TECNOLÓGICO</span>
                  <h4 className="text-xs font-bold text-white">
                    {equippedAccessory ? equippedAccessory.name : 'Nenhum Acessório Equipado'}
                  </h4>
                  {equippedAccessory && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border ${getRarityBadgeColor(equippedAccessory.rarity)}`}>
                      {equippedAccessory.rarity} • +{Math.round((equippedAccessory.stats.dodgeBonus ?? 0) * 100)}% ESQUIVA
                    </span>
                  )}
                </div>
              </div>
              {equippedAccessory && (
                <button
                  onClick={() => handleUnequip('ACCESSORY')}
                  className="text-[10px] text-rose-400 hover:text-rose-300 underline"
                >
                  Desequipar
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Inventory Bag & Selected Item Inspection */}
          <div className="lg:col-span-7 space-y-4">
            {/* Slot Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {(['ALL', 'WEAPON', 'ARMOR', 'CORE', 'ACCESSORY'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    audio.playClick();
                    setSelectedSlotFilter(tab);
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                    selectedSlotFilter === tab
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'ALL'
                    ? 'TODOS'
                    : tab === 'WEAPON'
                    ? 'ARMAS'
                    : tab === 'ARMOR'
                    ? 'ARMADURAS'
                    : tab === 'CORE'
                    ? 'NÚCLEOS'
                    : 'ACESSÓRIOS'}
                </button>
              ))}
            </div>

            {/* Inventory Grid */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl min-h-[180px]">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-xs">
                  <HelpCircle className="w-8 h-8 mb-2 opacity-50" />
                  <p>Nenhum item nesta categoria ainda.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Conclua missões, chefes e explorações para encontrar itens!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredItems.map(({ item, slotData }) => {
                    const isEquipped =
                      equippedGear.weaponId === item.id ||
                      equippedGear.armorId === item.id ||
                      equippedGear.coreId === item.id ||
                      equippedGear.accessoryId === item.id;
                    const isSelected = selectedItem?.id === item.id;

                    return (
                      <button
                        key={slotData.instanceId}
                        onClick={() => {
                          audio.playClick();
                          setSelectedItem(item);
                        }}
                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/70 shadow-md ring-1 ring-cyan-400'
                            : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border ${getRarityBadgeColor(item.rarity)}`}>
                            {item.rarity}
                          </span>
                          <h4 className="text-xs font-bold text-white mt-1.5">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">{item.slot}</span>
                        </div>
                        {isEquipped && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> EQUIPADO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Item Inspector / Comparison Card */}
            {selectedItem && (
              <div className="bg-slate-900/95 border border-cyan-500/40 p-5 rounded-2xl space-y-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getRarityBadgeColor(selectedItem.rarity)}`}>
                      {selectedItem.rarity} • {selectedItem.slot}
                    </span>
                    <h3 className="text-base font-black text-white mt-1">{selectedItem.name}</h3>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">{selectedItem.creditValue} CR</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">{selectedItem.description}</p>
                {selectedItem.lore && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    "{selectedItem.lore}"
                  </p>
                )}

                {/* Stat Comparison */}
                {(() => {
                  const comparison = StatCalculator.compareItem(player, selectedItem);
                  return (
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-2 text-xs">
                      <span className="text-[10px] text-cyan-400 font-bold block uppercase">
                        IMPACTO NOS ATRIBUTOS DE KAEL AO EQUIPAR:
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[9px]">HP</span>
                          <span className={comparison.diff.maxHp >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {comparison.diff.maxHp >= 0 ? `+${comparison.diff.maxHp}` : comparison.diff.maxHp}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">ATAQUE</span>
                          <span className={comparison.diff.atk >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {comparison.diff.atk >= 0 ? `+${comparison.diff.atk}` : comparison.diff.atk}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">DEFESA</span>
                          <span className={comparison.diff.def >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {comparison.diff.def >= 0 ? `+${comparison.diff.def}` : comparison.diff.def}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleEquip(selectedItem)}
                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>EQUIPAR NO SLOT</span>
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-400 rounded-xl text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
