import React, { useState } from 'react';
import {
  Cpu,
  ArrowLeft,
  Shield,
  Zap,
  Sword,
  Activity,
  Sparkles,
  Coins,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface UpgradeItem {
  id: string;
  name: string;
  desc: string;
  statBonus: string;
  costCredits: number;
  costCells: number;
  maxLevel: number;
  icon: React.ReactNode;
}

const UPGRADE_LIST: UpgradeItem[] = [
  {
    id: 'hp_suit',
    name: 'Nanotraje Hiperdenso',
    desc: 'Reforça a estrutura de grafeno e absorção cinética do traje.',
    statBonus: '+20 HP Máximo',
    costCredits: 80,
    costCells: 1,
    maxLevel: 5,
    icon: <Activity className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: 'plasma_blade',
    name: 'Condensador de Plasma',
    desc: 'Amplifica a voltagem das lâminas e disparos táticos de ruptura.',
    statBonus: '+5 Ataque (ATK)',
    costCredits: 100,
    costCells: 1,
    maxLevel: 5,
    icon: <Sword className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: 'kinetic_shield',
    name: 'Defletor Gravitacional',
    desc: 'Aumenta a resistência de campo a impactos dimensionais diretos.',
    statBonus: '+4 Defesa (DEF)',
    costCredits: 90,
    costCells: 1,
    maxLevel: 5,
    icon: <Shield className="w-5 h-5 text-blue-400" />,
  },
  {
    id: 'focus_cell',
    name: 'Acumulador de Foco Quântico',
    desc: 'Inicia combates com foco pré-carregado para uso imediato de habilidades.',
    statBonus: '+15 Foco Inicial',
    costCredits: 120,
    costCells: 2,
    maxLevel: 3,
    icon: <Zap className="w-5 h-5 text-fuchsia-400" />,
  },
];

export const UpgradesScene: React.FC<{
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onBackToNexus: () => void;
}> = ({ player, setPlayer, onBackToNexus }) => {
  const [upgrades, setUpgrades] = useState<Record<string, number>>(
    player.upgradeLevels ?? {
      hp_suit: 0,
      plasma_blade: 0,
      kinetic_shield: 0,
      focus_cell: 0,
    }
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBuy = (item: UpgradeItem) => {
    const currentLvl = upgrades[item.id] ?? 0;
    if (currentLvl >= item.maxLevel) return;

    const cells = player.matrixCells ?? 0;
    if (player.credits < item.costCredits || cells < item.costCells) {
      audio.playDenied();
      setFeedback('❌ Recursos insuficientes para este aprimoramento.');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    audio.playUpgrade();
    const nextLvl = currentLvl + 1;
    const newUpgrades = { ...upgrades, [item.id]: nextLvl };
    setUpgrades(newUpgrades);

    // Apply stats to player
    setPlayer(p => {
      let nextMaxHp = p.maxHp;
      let nextAtk = p.atk;
      let nextDef = p.def;
      let nextFocus = p.focus ?? 30;

      if (item.id === 'hp_suit') nextMaxHp += 20;
      if (item.id === 'plasma_blade') nextAtk += 5;
      if (item.id === 'kinetic_shield') nextDef += 4;
      if (item.id === 'focus_cell') nextFocus = Math.min(100, nextFocus + 15);

      return {
        ...p,
        credits: p.credits - item.costCredits,
        matrixCells: (p.matrixCells ?? 0) - item.costCells,
        maxHp: nextMaxHp,
        hp: Math.min(nextMaxHp, p.hp + 20),
        atk: nextAtk,
        def: nextDef,
        focus: nextFocus,
        upgradeLevels: newUpgrades,
      };
    });

    setFeedback(`✅ ${item.name} aprimorado para Nível ${nextLvl}!`);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto space-y-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <button
            onClick={onBackToNexus}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center gap-2 text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR AO NEXUS</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="tracking-widest">LABORATÓRIO DE APRIMORAMENTOS</span>
          </div>
        </div>

        {/* Current Stats card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl backdrop-blur-md">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">HP MÁXIMO</span>
            <span className="text-xl font-bold text-emerald-400">{player.maxHp} HP</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">PODER DE ATAQUE</span>
            <span className="text-xl font-bold text-cyan-400">{player.atk} ATK</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">DEFESA BASE</span>
            <span className="text-xl font-bold text-blue-400">{player.def} DEF</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">CÉLULAS DISPONÍVEIS</span>
            <span className="text-xl font-bold text-amber-400">{player.matrixCells ?? 0} Células</span>
          </div>
        </div>

        {feedback && (
          <div className="p-3 bg-slate-900 border border-cyan-500/50 rounded-xl text-center text-xs text-cyan-300 font-bold animate-bounce">
            {feedback}
          </div>
        )}

        {/* Upgrade cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UPGRADE_LIST.map(item => {
            const lvl = upgrades[item.id] ?? 0;
            const isMax = lvl >= item.maxLevel;
            const cells = player.matrixCells ?? 0;
            const canAfford = player.credits >= item.costCredits && cells >= item.costCells;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      NÍVEL {lvl}/{item.maxLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  <div className="mt-3 inline-block px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-300">
                    Bônus: {item.statBonus}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-300 space-x-2">
                    <span>Custo:</span>
                    <strong className="text-amber-400">{item.costCredits} Cr</strong>
                    <span>+</span>
                    <strong className="text-emerald-400">{item.costCells} Células</strong>
                  </div>

                  <button
                    disabled={isMax || !canAfford}
                    onClick={() => handleBuy(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                      isMax
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isMax ? 'NÍVEL MÁXIMO' : 'APRIMORAR'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
