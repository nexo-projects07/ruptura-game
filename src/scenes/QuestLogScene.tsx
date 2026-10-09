import React, { useState } from 'react';
import {
  ArrowLeft,
  Compass,
  CheckCircle2,
  Clock,
  Coins,
  Sparkles,
  Cpu,
  Sword,
  Gift,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState, Quest, QuestStatus } from '../types/game';
import { QuestSystem } from '../systems/QuestSystem';
import { ItemRegistry } from '../systems/ItemRegistry';
import { audio } from '../systems/AudioEngine';

interface QuestLogSceneProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  completedPhases: string[];
  unlockedRealms: string[];
  onBackToNexus: () => void;
}

export const QuestLogScene: React.FC<QuestLogSceneProps> = ({
  player,
  setPlayer,
  completedPhases,
  unlockedRealms,
  onBackToNexus,
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  const discoveredSecretsCount = player.discoveredSecrets?.length ?? 0;
  const quests = QuestSystem.getUpdatedQuests(
    player,
    completedPhases,
    unlockedRealms,
    discoveredSecretsCount
  );

  const completedQuestIds = new Set(player.completedQuests ?? []);

  // Filter quests
  const filteredQuests = quests.filter(q => {
    if (filterTab === 'ACTIVE') return q.status === 'ACTIVE';
    if (filterTab === 'COMPLETED') return completedQuestIds.has(q.id) || q.status === 'COMPLETED';
    return true;
  });

  // Claim reward
  const handleClaim = (quest: Quest) => {
    if (completedQuestIds.has(quest.id)) return;

    audio.playSecretFound();
    const r = quest.rewards;

    setPlayer(prev => {
      let exp = prev.exp + r.exp;
      let level = prev.level;
      let maxExp = prev.maxExp;
      let atk = prev.atk;
      let maxHp = prev.maxHp;
      let talentPoints = prev.talentPoints ?? 0;

      if (exp >= maxExp) {
        exp -= maxExp;
        level += 1;
        talentPoints += 1; // +1 talent point on level up!
        maxExp = Math.floor(maxExp * 1.35);
        atk += 3;
        maxHp += 10;
      }

      // Add item to inventory if rewarded
      const newInventory = [...(prev.inventory ?? [])];
      if (r.itemId && ItemRegistry.hasItem(r.itemId)) {
        newInventory.push({
          instanceId: `inst-${Date.now()}-${Math.random()}`,
          itemId: r.itemId,
          equipped: false,
          acquiredAt: Date.now(),
        });
      }

      return {
        ...prev,
        exp,
        level,
        maxExp,
        atk,
        maxHp,
        talentPoints,
        credits: prev.credits + r.credits,
        fragments: prev.fragments + r.fragments,
        matrixCells: (prev.matrixCells ?? 0) + (r.matrixCells ?? 0),
        completedQuests: [...(prev.completedQuests ?? []), quest.id],
        inventory: newInventory,
      };
    });

    const itemMeta = r.itemId ? ItemRegistry.getItemById(r.itemId) : null;
    setFeedback(`🎁 Recompensa resgatada! +${r.exp} EXP, +${r.credits} CR${itemMeta ? `, e ${itemMeta.name}` : ''}!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/30 pb-3">
          <button
            onClick={onBackToNexus}
            className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 active:scale-95 text-slate-300 hover:text-white flex items-center gap-1.5 sm:gap-2 text-xs transition touch-manipulation cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR AO NEXUS</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-emerald-300">
            <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="tracking-widest text-[11px] sm:text-xs">DIÁRIO DE MISSÕES</span>
          </div>
        </div>

        {feedback && (
          <div className="p-2.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl text-center font-bold animate-bounce">
            {feedback}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 text-xs">
          {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                audio.playClick();
                setFilterTab(tab);
              }}
              className={`px-3 py-1.5 rounded-lg border transition ${
                filterTab === tab
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'TODAS AS MISSÕES' : tab === 'ACTIVE' ? 'MISSÕES ATIVAS' : 'CONCLUÍDAS'}
            </button>
          ))}
        </div>

        {/* Quests List */}
        <div className="space-y-3.5">
          {filteredQuests.map(quest => {
            const isClaimed = completedQuestIds.has(quest.id);
            const isReadyToClaim = quest.status === 'COMPLETED' && !isClaimed;
            const rewardItem = quest.rewards.itemId ? ItemRegistry.getItemById(quest.rewards.itemId) : null;

            return (
              <div
                key={quest.id}
                className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isClaimed
                    ? 'border-emerald-500/40 bg-emerald-950/20 opacity-80'
                    : isReadyToClaim
                    ? 'border-amber-400/60 bg-amber-950/30 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                    : 'border-slate-800 bg-slate-900/90'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-cyan-400 font-bold uppercase">
                      {quest.realmId}
                    </span>
                    {isClaimed ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RECOMPENSA RESGATADA
                      </span>
                    ) : isReadyToClaim ? (
                      <span className="text-[10px] text-amber-300 font-bold animate-pulse">
                        ⭐ PRONTA PARA RESGATE
                      </span>
                    ) : (
                      <span className="text-[10px] text-cyan-300 font-bold">EM ANDAMENTO</span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-white">{quest.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{quest.description}</p>

                  {/* Objectives Progress */}
                  <div className="space-y-1.5 pt-1">
                    {quest.objectives.map(obj => (
                      <div key={obj.id} className="text-xs flex items-center justify-between text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="flex items-center gap-2 text-[11px]">
                          {obj.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{obj.description}</span>
                        </span>
                        <span className="font-bold text-cyan-400 text-[11px]">
                          {obj.currentCount}/{obj.targetCount}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards preview */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1">
                    <span>Recompensas:</span>
                    <strong className="text-cyan-300">+{quest.rewards.exp} EXP</strong>
                    <strong className="text-amber-300">+{quest.rewards.credits} CR</strong>
                    <strong className="text-fuchsia-300">+{quest.rewards.fragments} Frag</strong>
                    {quest.rewards.matrixCells && (
                      <strong className="text-emerald-300">+{quest.rewards.matrixCells} Células</strong>
                    )}
                    {rewardItem && (
                      <strong className="text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded bg-indigo-950/60">
                        Item: {rewardItem.name}
                      </strong>
                    )}
                  </div>
                </div>

                {/* Claim Button */}
                <div className="md:w-48 shrink-0 flex flex-col justify-center">
                  {isReadyToClaim ? (
                    <button
                      onClick={() => handleClaim(quest)}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black uppercase tracking-wider rounded-xl text-xs transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 animate-bounce"
                    >
                      <Gift className="w-4 h-4" />
                      <span>RESGATAR</span>
                    </button>
                  ) : isClaimed ? (
                    <div className="text-center text-xs text-emerald-400 font-bold py-2">
                      CONCLUÍDA
                    </div>
                  ) : (
                    <div className="text-center text-xs text-slate-500 py-2">
                      Objetivos pendentes
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
