import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

export const Sector02BriefingScene: React.FC<{
  player: PlayerState;
  onEnterSector: () => void;
  onBackToMap: () => void;
}> = ({ player, onEnterSector, onBackToMap }) => {
  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden p-6 h-full">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onMenuClick={onBackToMap} />

      <div className="relative z-10 max-w-xl mx-auto my-auto w-full bg-slate-900/95 border border-cyan-500/40 p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <span className="text-xs font-mono text-cyan-400">SETOR 02</span>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
            DISTRITO INDUSTRIAL
          </span>
        </div>

        <h2 className="text-3xl font-black text-white">DISTRITO INDUSTRIAL</h2>

        <p className="text-slate-300 text-sm leading-relaxed">
          Uma zona de produção abandonada após os primeiros pulsos dimensionais. Máquinas continuam funcionando sem operadores. Leituras anômalas indicam atividade dentro das instalações.
        </p>

        <div className="bg-slate-950 border border-cyan-500/20 p-4 rounded-xl text-xs font-mono text-cyan-300 space-y-1">
          <p>🎯 OBJETIVO: Investigar a origem do sinal anômalo nas 3 instalações.</p>
        </div>

        <div className="flex gap-3 font-mono">
          <button
            onClick={() => {
              audio.playClick();
              onBackToMap();
            }}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
          >
            VOLTAR AO MAPA
          </button>
          <button
            onClick={() => {
              audio.playClick();
              onEnterSector();
            }}
            className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
          >
            <span>ENTRAR NO SETOR</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};