import React, { useState } from 'react';
import {
  Compass,
  Coins,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowLeft,
  Orbit,
  Cpu,
  Sword,
  Zap,
  BookOpen
} from 'lucide-react';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';
import { getExplorerProfile } from '../systems/ExplorerSystem';

export const ProgressionHUD: React.FC<{
  player: PlayerState;
  onMenuClick?: () => void;
  onNexusClick?: () => void;
  onInventoryClick?: () => void;
  onSkillTreeClick?: () => void;
  onQuestLogClick?: () => void;
}> = ({
  player,
  onMenuClick,
  onNexusClick,
  onInventoryClick,
  onSkillTreeClick,
  onQuestLogClick,
}) => {
  const [muted, setMuted] = useState(audio.muted);
  const explorer = getExplorerProfile(player.activeExplorerId);
  const expPercent = Math.min(100, Math.floor((player.exp / player.maxExp) * 100));

  const toggleMute = () => {
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <header className="relative z-30 w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/30 px-2 sm:px-4 md:px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-cyan-100 shadow-xl shadow-cyan-950/20 shrink-0">
      {/* Player Identity */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-cyan-950/80 border border-cyan-500/50 rounded-lg sm:rounded-xl text-cyan-400 flex items-center justify-center shadow-md">
          <Compass className="w-4 sm:w-5 h-4 sm:h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-white tracking-wider text-xs sm:text-sm md:text-base">{explorer.name}</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs bg-cyan-500/20 text-cyan-300 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded border border-cyan-500/30 uppercase font-semibold">
              {explorer.role}
            </span>
          </div>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">
            RUPTURA · EXPLORADOR DIMENSIONAL
          </p>
        </div>
      </div>

      {/* Progress & Currencies */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-4 text-xs font-mono">
        <div className="flex flex-col min-w-[85px] sm:min-w-[110px] md:min-w-[130px]">
          <div className="flex justify-between text-[9px] sm:text-[10px] md:text-[11px] mb-0.5 sm:mb-1">
            <span className="text-slate-400 font-bold">NV <span className="text-cyan-400">{player.level}</span></span>
            <span className="text-cyan-300">{player.exp}/{player.maxExp}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 border border-amber-500/30 px-2 py-1 rounded-lg text-[10px] sm:text-[11px]">
          <Coins className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold tracking-wide">{player.credits}</span>
          <span className="text-[8px] sm:text-[9px] text-amber-500 uppercase hidden sm:inline">CR</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 border border-fuchsia-500/30 px-2 py-1 rounded-lg text-[10px] sm:text-[11px]">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-fuchsia-400" />
          <span className="text-fuchsia-300 font-bold tracking-wide">{player.fragments}</span>
          <span className="text-[8px] sm:text-[9px] text-fuchsia-400 uppercase hidden sm:inline">FRAG</span>
        </div>

        {(player.matrixCells !== undefined && player.matrixCells > 0) && (
          <div className="flex items-center gap-1 bg-slate-900/80 border border-cyan-500/30 px-2 py-1 rounded-lg text-[10px] sm:text-[11px]">
            <Cpu className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold tracking-wide">{player.matrixCells}</span>
            <span className="text-[8px] sm:text-[9px] text-cyan-400 uppercase hidden sm:inline">CÉL</span>
          </div>
        )}

        {(player.talentPoints !== undefined && player.talentPoints > 0) && (
          <div className="flex items-center gap-1 bg-fuchsia-950/80 border border-fuchsia-500/50 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] animate-pulse">
            <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-fuchsia-400" />
            <span className="text-fuchsia-300 font-bold">{player.talentPoints}</span>
            <span className="text-[8px] sm:text-[9px] text-fuchsia-400 uppercase hidden sm:inline">PTS</span>
          </div>
        )}
      </div>

      {/* Quick Access Shortcuts & Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {onInventoryClick && (
          <button
            onClick={() => {
              audio.playClick();
              onInventoryClick();
            }}
            className="min-h-[36px] text-xs px-2 sm:px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 active:scale-95 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1 font-mono touch-manipulation cursor-pointer"
            title="Inventário & Equipamentos"
          >
            <Sword className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[10px] md:text-[11px]">ITENS</span>
          </button>
        )}

        {onSkillTreeClick && (
          <button
            onClick={() => {
              audio.playClick();
              onSkillTreeClick();
            }}
            className="min-h-[36px] text-xs px-2 sm:px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 active:scale-95 border border-slate-700 hover:border-fuchsia-400 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1 font-mono touch-manipulation cursor-pointer"
            title="Árvore de Talentos"
          >
            <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="hidden sm:inline text-[10px] md:text-[11px]">TALENTOS</span>
          </button>
        )}

        {onQuestLogClick && (
          <button
            onClick={() => {
              audio.playClick();
              onQuestLogClick();
            }}
            className="min-h-[36px] text-xs px-2 sm:px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 active:scale-95 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1 font-mono touch-manipulation cursor-pointer"
            title="Diário de Missões"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-[10px] md:text-[11px]">MISSÕES</span>
          </button>
        )}

        {onNexusClick && (
          <button
            onClick={() => {
              audio.playClick();
              onNexusClick();
            }}
            className="min-h-[36px] text-xs px-2 sm:px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900/90 active:scale-95 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white rounded-lg transition flex items-center gap-1 sm:gap-1.5 font-mono shadow-md shadow-cyan-950/50 font-bold touch-manipulation cursor-pointer"
            title="Acessar Hub NEXUS"
          >
            <Orbit className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
            <span className="text-[11px] sm:text-xs">NEXUS</span>
          </button>
        )}

        <button
          onClick={toggleMute}
          className="min-h-[36px] min-w-[36px] p-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 rounded-lg transition flex items-center justify-center touch-manipulation cursor-pointer"
          title="Alternar Som"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {onMenuClick && (
          <button
            onClick={() => {
              audio.playClick();
              onMenuClick();
            }}
            className="min-h-[36px] text-xs px-2 sm:px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 rounded-lg transition flex items-center gap-1 font-mono touch-manipulation cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">MENU</span>
          </button>
        )}
      </div>
    </header>
  );
};
