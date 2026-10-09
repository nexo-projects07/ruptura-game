import React, { useState } from 'react';
import { Lock, CheckCircle2, Play, Map, ArrowLeft, Radio, Orbit, Sparkles, Skull, Award, ChevronRight, Layers } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { CAMPAIGN_CHAPTERS, CampaignChapter } from '../systems/CampaignChapters';
import { audio } from '../systems/AudioEngine';

export interface CampaignPhase {
  id: string;
  title: string;
  location: string;
  summary: string;
  enemy: string;
  hp: number;
  atk: number;
  def: number;
  boss?: boolean;
}

// Flat export of all 10 phases for App.tsx compatibility
export const CAMPAIGN_PHASES: CampaignPhase[] = CAMPAIGN_CHAPTERS.flatMap(c => c.phases);

export const CampaignMapScene: React.FC<{
  player: PlayerState;
  unlockedPhases: string[];
  completedPhases: string[];
  onSelectPhase: (phase: CampaignPhase) => void;
  onMenuClick: () => void;
  onNexusClick?: () => void;
  onUnlockAllDebug?: () => void;
}> = ({
  player,
  unlockedPhases,
  completedPhases,
  onSelectPhase,
  onMenuClick,
  onNexusClick,
  onUnlockAllDebug,
}) => {
  // Determine active chapter tab based on player progress
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(() => {
    // Check if player has progressed to chapter 2 or 3
    if (completedPhases.includes('fase-08')) return 2;
    if (completedPhases.includes('fase-04')) return 1;
    return 0;
  });

  const activeChapter = CAMPAIGN_CHAPTERS[selectedChapterIndex];

  // Chapter unlocked status
  const isChapterUnlocked = (idx: number) => {
    if (idx === 0) return true;
    if (idx === 1) return completedPhases.includes('fase-04');
    if (idx === 2) return completedPhases.includes('fase-08');
    return false;
  };

  const completedCount = completedPhases.length;

  return (
    <div className="relative flex-1 min-h-0 overflow-y-auto bg-slate-950 p-3 sm:p-4 md:p-8 font-mono">
      <AtmosphericCanvas />
      <div className="relative z-10 max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white active:scale-95 flex items-center gap-1.5 text-xs transition touch-manipulation cursor-pointer"
            >
              <ArrowLeft size={15} /> MENU
            </button>
            {onNexusClick && (
              <button
                onClick={onNexusClick}
                className="min-h-[38px] px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/80 active:scale-95 text-cyan-300 hover:text-white flex items-center gap-1.5 text-xs transition font-bold shadow-md shadow-cyan-950/40 touch-manipulation cursor-pointer"
              >
                <Orbit size={15} className="animate-spin text-cyan-400" />
                <span>NEXUS HUB</span>
              </button>
            )}
          </div>
          <span className="text-[11px] sm:text-xs tracking-wider sm:tracking-[.25em] text-cyan-300 flex items-center gap-1.5 sm:gap-2">
            <Radio size={15} /> CAMPANHA NARRATIVA // 3 CAPÍTULOS
          </span>
        </div>

        <ProgressionHUD player={player} onNexusClick={onNexusClick} onMenuClick={onMenuClick} />

        {/* Header */}
        <header className="text-center py-2">
          <p className="text-cyan-400 text-[10px] sm:text-xs tracking-[.35em]">2147 // NOVA ARCÁDIA</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-widest mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400">
            RUPTURA
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Crônicas do Colapso Dimensional em Nova Arcádia</p>

          <div className="w-full max-w-sm mx-auto h-2 rounded-full bg-slate-800 mt-3 sm:mt-4 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${(completedCount / 10) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-3 mt-2">
            <p className="text-xs text-slate-400 font-bold">
              {completedCount} / 10 Fases Concluídas
            </p>
            {onUnlockAllDebug && completedCount < 10 && (
              <button
                onClick={onUnlockAllDebug}
                className="text-[10px] text-cyan-400 hover:text-cyan-200 underline opacity-70 hover:opacity-100 transition touch-manipulation cursor-pointer"
                title="Desbloquear todas as fases para testes imediatos"
              >
                [Desbloquear todas para teste]
              </button>
            )}
          </div>
        </header>

        {/* Chapter Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
          {CAMPAIGN_CHAPTERS.map((chap, idx) => {
            const unlocked = isChapterUnlocked(idx);
            const isSelected = selectedChapterIndex === idx;
            const completedInChapter = chap.phases.filter(p => completedPhases.includes(p.id)).length;
            const isDone = completedInChapter === chap.phases.length;

            return (
              <button
                key={chap.id}
                onClick={() => {
                  if (unlocked) {
                    audio.playClick();
                    setSelectedChapterIndex(idx);
                  } else {
                    audio.playDenied();
                  }
                }}
                disabled={!unlocked}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/80 shadow-lg ring-1 ring-cyan-400 shadow-cyan-950/60'
                    : unlocked
                    ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    : 'border-slate-850 bg-slate-950/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      CAPÍTULO 0{chap.chapterNumber}
                    </span>
                    {isDone ? (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> 100%
                      </span>
                    ) : unlocked ? (
                      <span className="text-[9px] text-slate-400">
                        {completedInChapter}/{chap.phases.length} Fases
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                        <Lock size={11} /> Bloqueado
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{chap.title}</h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{chap.subtitle}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Recomendado: Nv {chap.recommendedLevel}</span>
                  {isSelected && <span className="text-cyan-300 font-bold">Capítulo Ativo</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Chapter Lore Banner */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
              SINOPSE DO CAPÍTULO 0{activeChapter.chapterNumber}
            </span>
            <span className="text-xs text-white font-bold">{activeChapter.title}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            {activeChapter.loreIntro}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <span>Recompensa de Conclusão do Capítulo:</span>
            <span className="text-amber-400 font-bold">
              +{activeChapter.chapterBossReward.credits} Créditos · +{activeChapter.chapterBossReward.matrixCells} Células de Matriz
            </span>
          </div>
        </div>

        {/* Grid of Phases in the Active Chapter */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
          {activeChapter.phases.map((ph, idx) => {
            const unlocked = unlockedPhases.includes(ph.id);
            const done = completedPhases.includes(ph.id);
            const isBoss = ph.boss;

            return (
              <button
                key={ph.id}
                disabled={!unlocked}
                onClick={() => onSelectPhase(ph)}
                className={`text-left p-4 rounded-xl border transition min-h-36 relative overflow-hidden flex flex-col justify-between ${
                  done
                    ? 'border-emerald-500/60 bg-emerald-950/30 hover:border-emerald-400'
                    : unlocked
                    ? isBoss
                      ? 'border-rose-500/60 bg-slate-900/90 hover:border-rose-400 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                      : 'border-cyan-500/50 bg-slate-900/90 hover:border-cyan-300 hover:bg-slate-850 shadow-md shadow-cyan-950/30'
                    : 'border-slate-850 bg-slate-900/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] tracking-widest text-cyan-400 font-bold">
                        MISSÃO 0{idx + 1}
                      </span>
                      {isBoss && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                          <Skull size={11} /> CHEFE DE CAPÍTULO
                        </span>
                      )}
                    </div>
                    {done ? (
                      <CheckCircle2 className="text-emerald-400" size={18} />
                    ) : unlocked ? (
                      <Play className="text-cyan-300" size={17} />
                    ) : (
                      <Lock className="text-slate-500" size={17} />
                    )}
                  </div>

                  <h2 className="font-bold text-white text-base mt-2.5">{ph.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{ph.location}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{ph.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Ameaça: <strong className="text-slate-300">{ph.enemy}</strong></span>
                  <div className="flex gap-2">
                    <span className="text-cyan-400 font-bold">HP {ph.hp}</span>
                    <span className="text-rose-400 font-bold">ATK {ph.atk}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-[10px] tracking-wider text-slate-500 pb-4">
          RUPTURA • MOTOR MULTIVERSAL DE COMBATE E PROGRESSÃO SALVA
        </p>
      </div>
    </div>
  );
};
