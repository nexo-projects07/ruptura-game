import React, { useState } from 'react';
import { Compass, Coins, Sparkles, Volume2, VolumeX, ArrowLeft, Orbit, Cpu } from 'lucide-react';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

export const ProgressionHUD: React.FC<{
  player: PlayerState;
  onMenuClick?: () => void;
  onNexusClick?: () => void;
}> = ({ player, onMenuClick, onNexusClick }) => {
  const [muted, setMuted] = useState(audio.muted);
  const expPercent = Math.min(100, Math.floor((player.exp / player.maxExp) * 100));

  const toggleMute = () => {
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <header className="relative z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/30 px-3 md:px-4 py-2.5 md:py-3 flex flex-wrap items-center justify-between gap-3 md:gap-4 text-cyan-100 shadow-lg shadow-cyan-950/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-950/80 border border-cyan-500/50 rounded-lg text-cyan-400 flex items-center justify-center">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider text-sm md:text-base">{player.name}</span>
            <span className="text-[10px] md:text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 uppercase font-semibold">
              {player.role}
            </span>
          </div>
          <p className="text-[10px] text-cyan-400/70 font-mono tracking-widest uppercase">RUPTURA 2.0 • SINAL SINCRONIZADO</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs font-mono">
        <div className="flex flex-col min-w-[110px] md:min-w-[130px]">
          <div className="flex justify-between text-[10px] md:text-[11px] mb-1">
            <span className="text-slate-400 font-bold">NÍVEL <span className="text-cyan-400">{player.level}</span></span>
            <span className="text-cyan-300">{player.exp}/{player.maxExp} EXP</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-amber-500/30 px-2.5 py-1 rounded-md text-[11px]">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold tracking-wide">{player.credits}</span>
          <span className="text-[9px] text-amber-500 uppercase hidden sm:inline">CRÉDITOS</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-fuchsia-500/30 px-2.5 py-1 rounded-md text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          <span className="text-fuchsia-300 font-bold tracking-wide">{player.fragments}</span>
          <span className="text-[9px] text-fuchsia-400 uppercase hidden sm:inline">FRAGMENTOS</span>
        </div>

        {(player.matrixCells !== undefined && player.matrixCells > 0) && (
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-cyan-500/30 px-2.5 py-1 rounded-md text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold tracking-wide">{player.matrixCells}</span>
            <span className="text-[9px] text-cyan-400 uppercase hidden sm:inline">CÉLULAS</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onNexusClick && (
          <button
            onClick={() => {
              audio.playClick();
              onNexusClick();
            }}
            className="text-xs px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white rounded-lg transition flex items-center gap-1.5 font-mono shadow-md shadow-cyan-950/50"
            title="Acessar Hub NEXUS Dimensional"
          >
            <Orbit className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
            <span className="font-bold tracking-wider">NEXUS</span>
          </button>
        )}

        <button
          onClick={toggleMute}
          className="p-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 rounded transition"
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
            className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 rounded transition flex items-center gap-1.5 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>MENU</span>
          </button>
        )}
      </div>
    </header>
  );
};