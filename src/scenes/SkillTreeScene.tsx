import React, { useState } from 'react';
import {
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Activity
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState, TalentBranch, TalentNode } from '../types/game';
import { SkillTreeSystem, TALENT_TREE } from '../systems/SkillTreeSystem';
import { audio } from '../systems/AudioEngine';

interface SkillTreeSceneProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onBackToNexus: () => void;
}

export const SkillTreeScene: React.FC<SkillTreeSceneProps> = ({
  player,
  setPlayer,
  onBackToNexus,
}) => {
  const [activeBranch, setActiveBranch] = useState<TalentBranch>('QUANTUM_ASSAULT');
  const [selectedNode, setSelectedNode] = useState<TalentNode | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const allocated = player.allocatedTalents ?? [];
  const talentPoints = player.talentPoints ?? 0;
  const branchNodes = SkillTreeSystem.getTalentsByBranch(activeBranch);
  const aggregatedStats = SkillTreeSystem.getAggregatedTalentStats(allocated);

  // Unlock node
  const handleUnlock = (node: TalentNode) => {
    const check = SkillTreeSystem.canUnlockTalent(player, node.id);
    if (!check.canUnlock) {
      audio.playDenied();
      setFeedback(`❌ ${check.reason}`);
      setTimeout(() => setFeedback(null), 2800);
      return;
    }

    audio.playUpgrade();
    setPlayer(prev => ({
      ...prev,
      talentPoints: (prev.talentPoints ?? 0) - node.costPoints,
      matrixCells: node.costMatrixCells
        ? (prev.matrixCells ?? 0) - node.costMatrixCells
        : prev.matrixCells,
      allocatedTalents: [...(prev.allocatedTalents ?? []), node.id],
    }));

    setFeedback(`✅ Talento "${node.name}" ativado com sucesso!`);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Reset all talents and refund points
  const handleReset = () => {
    if (allocated.length === 0) return;

    audio.playClick();
    let refundedPoints = 0;
    let refundedCells = 0;

    for (const id of allocated) {
      const node = SkillTreeSystem.getTalentById(id);
      if (node) {
        refundedPoints += node.costPoints;
        if (node.costMatrixCells) refundedCells += node.costMatrixCells;
      }
    }

    setPlayer(prev => ({
      ...prev,
      talentPoints: (prev.talentPoints ?? 0) + refundedPoints,
      matrixCells: (prev.matrixCells ?? 0) + refundedCells,
      allocatedTalents: [],
    }));

    setSelectedNode(null);
    setFeedback(`🔄 Todos os ${refundedPoints} pontos de talento foram redefinidos!`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const getBranchMeta = (branch: TalentBranch) => {
    switch (branch) {
      case 'QUANTUM_ASSAULT':
        return {
          title: 'ASSALTO QUÂNTICO',
          desc: 'Maximização de dano bruto, multiplicadores de combo e quebra de postura.',
          color: 'text-rose-400 border-rose-500/50 bg-rose-950/60',
          icon: <Zap className="w-4 h-4 text-rose-400" />,
        };
      case 'MATRIX_GUARDIAN':
        return {
          title: 'GUARDIÃO DE MATRIZ',
          desc: 'Reforço estrutural, absorção de impacto e resistência contra chefes.',
          color: 'text-blue-400 border-blue-500/50 bg-blue-950/60',
          icon: <Shield className="w-4 h-4 text-blue-400" />,
        };
      case 'TEMPORAL_WARP':
        return {
          title: 'MANIPULAÇÃO TEMPORAL',
          desc: 'Reflexos de esquiva perfeita e regeneração contínua de foco a cada turno.',
          color: 'text-indigo-400 border-indigo-500/50 bg-indigo-950/60',
          icon: <Clock className="w-4 h-4 text-indigo-400" />,
        };
      case 'CONVERGENCE':
        return {
          title: 'CONVERGÊNCIA',
          desc: 'Sinergia com as 5 realidades, expansão do limite de foco e poderes híbridos.',
          color: 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/60',
          icon: <Sparkles className="w-4 h-4 text-fuchsia-400" />,
        };
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
          <div className="flex items-center gap-2 text-xs text-fuchsia-300">
            <Zap className="w-4 h-4 text-fuchsia-400" />
            <span className="tracking-widest">ÁRVORE DE TALENTOS & ESPECIALIZAÇÕES</span>
          </div>
        </div>

        {/* Talent Points Counter & Reset Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-fuchsia-950/80 border border-fuchsia-500/40 rounded-xl text-fuchsia-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                PONTOS DE TALENTO DISPONÍVEIS
              </span>
              <h2 className="text-2xl font-black text-fuchsia-300">{talentPoints} PONTOS</h2>
              <span className="text-[10px] text-slate-500">
                Ganhe pontos ao subir de nível e derrotar chefes de capítulo.
              </span>
            </div>
          </div>

          <button
            disabled={allocated.length === 0}
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-rose-400 text-slate-400 hover:text-rose-300 text-xs font-bold transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REDEFINIR TODOS OS TALENTOS</span>
          </button>
        </div>

        {feedback && (
          <div className="p-2.5 bg-slate-900 border border-fuchsia-500/50 text-fuchsia-300 text-xs rounded-xl text-center font-bold animate-bounce">
            {feedback}
          </div>
        )}

        {/* 4 Specialization Branches Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['QUANTUM_ASSAULT', 'MATRIX_GUARDIAN', 'TEMPORAL_WARP', 'CONVERGENCE'] as const).map(b => {
            const meta = getBranchMeta(b);
            const isSelected = activeBranch === b;
            const branchAllocatedCount = branchNodes.filter(n => allocated.includes(n.id)).length;

            return (
              <button
                key={b}
                onClick={() => {
                  audio.playClick();
                  setActiveBranch(b);
                }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between min-h-[95px] ${
                  isSelected
                    ? `${meta.color} shadow-lg ring-1 ring-fuchsia-400`
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">{meta.icon}</div>
                  <span className="text-[10px] font-bold opacity-80">
                    {branchAllocatedCount}/4
                  </span>
                </div>
                <h3 className="font-bold text-xs text-white mt-2">{meta.title}</h3>
              </button>
            );
          })}
        </div>

        {/* Selected Branch Active Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tiers list */}
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              PROGRESSÃO POR TIERS ({getBranchMeta(activeBranch).title})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {branchNodes.map(node => {
                const isAcquired = allocated.includes(node.id);
                const check = SkillTreeSystem.canUnlockTalent(player, node.id);
                const isAvailable = check.canUnlock;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      audio.playClick();
                      setSelectedNode(node);
                    }}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between min-h-[140px] relative overflow-hidden ${
                      isSelected
                        ? 'border-fuchsia-400 bg-fuchsia-950/70 shadow-md ring-1 ring-fuchsia-400'
                        : isAcquired
                        ? 'border-emerald-500/60 bg-emerald-950/30'
                        : isAvailable
                        ? 'border-cyan-500/50 bg-slate-900/90 hover:border-cyan-300'
                        : 'border-slate-850 bg-slate-950/60 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                          TIER {node.tier} • REQ. NV {node.requiredLevel}
                        </span>
                        {isAcquired ? (
                          <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ATIVO
                          </span>
                        ) : isAvailable ? (
                          <span className="text-[9px] text-cyan-300 font-bold">DISPONÍVEL</span>
                        ) : (
                          <span className="text-[9px] text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> BLOQUEADO
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-white mt-2">{node.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{node.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-fuchsia-300 font-bold">{node.specialEffect}</span>
                      <span className="text-slate-400">{node.costPoints} pt(s)</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Node Inspector & Total Passive Breakdown */}
          <div className="lg:col-span-4 space-y-4">
            {selectedNode ? (
              <div className="bg-slate-900/95 border border-fuchsia-500/40 p-5 rounded-2xl space-y-4 shadow-xl backdrop-blur-xl">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-fuchsia-950 border border-fuchsia-500/30 text-fuchsia-300 uppercase">
                    TIER {selectedNode.tier} • {selectedNode.branch}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1.5">{selectedNode.name}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.description}</p>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-xs">
                  <span className="text-[10px] text-fuchsia-400 font-bold block">EFEITO PERMANENTE:</span>
                  <p className="text-white font-bold">{selectedNode.specialEffect}</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Custo: <strong>{selectedNode.costPoints} Ponto(s) de Talento</strong>
                    {selectedNode.costMatrixCells ? ` + ${selectedNode.costMatrixCells} Célula(s)` : ''}
                  </p>
                </div>

                {allocated.includes(selectedNode.id) ? (
                  <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl text-center font-bold">
                    ✓ TALENTO JÁ ATIVADO
                  </div>
                ) : (
                  <button
                    onClick={() => handleUnlock(selectedNode)}
                    className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider rounded-xl text-xs transition shadow-lg shadow-fuchsia-600/30"
                  >
                    DESBLOQUEAR TALENTO
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center text-slate-500 text-xs py-10">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Selecione um talento para visualizar seus detalhes e custos.</p>
              </div>
            )}

            {/* Total Passive Bonuses from Talents */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">
                BÔNUS PASSIVOS TOTAIS ATIVADOS:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>HP: <strong className="text-emerald-400">+{aggregatedStats.hp}</strong></div>
                <div>ATK: <strong className="text-cyan-400">+{aggregatedStats.atk}</strong></div>
                <div>DEF: <strong className="text-blue-400">+{aggregatedStats.def}</strong></div>
                <div>FOCO: <strong className="text-fuchsia-400">+{aggregatedStats.focus}</strong></div>
                <div>REC. FOCO: <strong className="text-fuchsia-300">+{aggregatedStats.focusRecovery}/T</strong></div>
                <div>CRÍTICO: <strong className="text-amber-400">+{Math.round(aggregatedStats.critChance * 100)}%</strong></div>
                <div>ESQUIVA: <strong className="text-indigo-400">+{Math.round(aggregatedStats.dodgeBonus * 100)}%</strong></div>
                <div>REDUÇÃO: <strong className="text-teal-400">+{Math.round(aggregatedStats.damageReduction * 100)}%</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
