import React from 'react';
import {
  ArrowLeft,
  Skull,
  Lock,
  CheckCircle2,
  Play,
  AlertTriangle,
  Award,
  Sparkles,
  Radio
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState, SecretBossConfig } from '../types/game';
import { SecretBossSystem } from '../systems/SecretBossSystem';
import { ItemRegistry } from '../systems/ItemRegistry';
import { audio } from '../systems/AudioEngine';

interface SecretBossesSceneProps {
  player: PlayerState;
  completedPhases: string[];
  onStartSecretBossCombat: (boss: SecretBossConfig) => void;
  onBackToNexus: () => void;
}

export const SecretBossesScene: React.FC<SecretBossesSceneProps> = ({
  player,
  completedPhases,
  onStartSecretBossCombat,
  onBackToNexus,
}) => {
  const discoveredSecretsCount = player.discoveredSecrets?.length ?? 0;
  const defeatedBosses = player.defeatedSecretBosses ?? [];

  const bosses = SecretBossSystem.getBossesWithStatus(
    completedPhases,
    player.level,
    discoveredSecretsCount,
    defeatedBosses
  );

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
          <div className="flex items-center gap-2 text-xs text-rose-400">
            <Skull className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="tracking-widest">CÂMARA DE CHEFES SECRETOS DA FENDA</span>
          </div>
        </div>

        {/* Overview Banner */}
        <div className="bg-slate-900/80 border border-rose-500/40 p-5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>AMEAÇAS CLASSIFICADAS DE NÍVEL APOCALÍPTICO</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            ENTIDADES PRIMORDIAIS DA CONVERGÊNCIA
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Ecos ancestrais que não foram contidos durante a criação do Nexus. Cada confronto possui múltiplas fases e concede recompensas de equipamentos lendários.
          </p>
        </div>

        {/* Boss Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bosses.map(boss => {
            const isDefeated = boss.status === 'DEFEATED';
            const isUnlocked = boss.status === 'DISCOVERED';
            const rewardItem = boss.rewards.itemId ? ItemRegistry.getItemById(boss.rewards.itemId) : null;

            return (
              <div
                key={boss.id}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between min-h-[300px] ${
                  isDefeated
                    ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md'
                    : isUnlocked
                    ? 'border-rose-500/60 bg-slate-900/95 shadow-xl shadow-rose-950/40 ring-1 ring-rose-500/40'
                    : 'border-slate-850 bg-slate-950/60 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 uppercase font-bold">
                      {boss.realmId}
                    </span>
                    {isDefeated ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DERROTADO
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] text-rose-400 font-bold animate-pulse">
                        ⚠️ DISPONÍVEL
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> BLOQUEADO
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{boss.name}</h3>
                    <p className="text-[10px] text-rose-300 tracking-wider mt-0.5">{boss.title}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-light">{boss.description}</p>

                  <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>HP Estimado:</span>
                      <strong className="text-rose-400">{boss.enemyStats.hp} HP ({boss.enemyStats.maxPhases} Fases)</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Poder de Ataque:</span>
                      <strong className="text-amber-400">{boss.enemyStats.atk} ATK</strong>
                    </div>
                  </div>

                  {!isUnlocked && !isDefeated && (
                    <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-[10px] text-slate-400">
                      <strong className="text-slate-300 block mb-0.5">Condição de Desbloqueio:</strong>
                      {boss.unlockCondition}
                    </div>
                  )}

                  {rewardItem && (
                    <div className="text-[10px] text-slate-400 pt-1">
                      Recompensa Exclusiva: <strong className="text-amber-300">{rewardItem.name}</strong>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800">
                  {isUnlocked || isDefeated ? (
                    <button
                      onClick={() => {
                        audio.playBossPhase();
                        onStartSecretBossCombat(boss);
                      }}
                      className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition flex items-center justify-center gap-2 ${
                        isDefeated
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isDefeated ? 'REPETIR CONFRONTO' : 'ENFRENTAR CHEFE'}</span>
                    </button>
                  ) : (
                    <div className="text-center text-xs text-slate-600 py-2">
                      Acesso Bloqueado
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
