import React from 'react';
import { Award, ChevronRight, Orbit, Cpu, Sparkles, Coins } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { audio } from '../systems/AudioEngine';

interface VictorySceneProps {
  onContinue: () => void;
  onGoToNexus?: () => void;
  phaseTitle?: string;
  enemyName?: string;
  rewards?: {
    exp: number;
    credits: number;
    fragments: number;
    matrixCells?: number;
    aetherCores?: number;
  };
}

export const VictoryScene: React.FC<VictorySceneProps> = ({
  onContinue,
  onGoToNexus,
  phaseTitle = 'Missão Concluída',
  enemyName = 'Ameaça Eliminada',
  rewards = { exp: 120, credits: 50, fragments: 1, matrixCells: 1 },
}) => {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-hidden h-full bg-slate-950">
      <AtmosphericCanvas />
      <div className="relative z-10 max-w-md w-full bg-slate-900/90 border border-emerald-500/40 p-6 md:p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto shadow-lg shadow-emerald-500/20">
          <Award className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">RUPTURA 2.0 // VITÓRIA</span>
          <h2 className="text-3xl md:text-4xl font-black text-emerald-300 tracking-wider mt-1">VITÓRIA!</h2>
          <p className="text-xs font-mono text-slate-300 mt-1 uppercase font-semibold">
            {enemyName} NEUTRALIZADO COM SUCESSO
          </p>
          <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{phaseTitle}</p>
        </div>

        <div className="bg-slate-950/80 border border-emerald-500/20 p-4 rounded-xl text-left font-mono text-xs space-y-2">
          <span className="text-slate-400 font-bold block border-b border-slate-800 pb-1">
            RECURSOS RECUPERADOS:
          </span>
          <div className="flex justify-between text-cyan-300">
            <span>EXPERIÊNCIA (EXP):</span>
            <span className="font-bold">+{rewards.exp}</span>
          </div>
          <div className="flex justify-between text-amber-300">
            <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5"/> CRÉDITOS:</span>
            <span className="font-bold">+{rewards.credits}</span>
          </div>
          <div className="flex justify-between text-fuchsia-300">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/> FRAGMENTOS DE FENDA:</span>
            <span className="font-bold">+{rewards.fragments}</span>
          </div>
          {(rewards.matrixCells ?? 0) > 0 && (
            <div className="flex justify-between text-emerald-300">
              <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5"/> CÉLULAS DE MATRIZ:</span>
              <span className="font-bold">+{rewards.matrixCells}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 font-mono pt-2">
          <button
            onClick={() => {
              audio.playClick();
              onContinue();
            }}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-xs md:text-sm"
          >
            <span>CONTINUAR NARRATIVA</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {onGoToNexus && (
            <button
              onClick={() => {
                audio.playClick();
                onGoToNexus();
              }}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs"
            >
              <Orbit className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>IR PARA O NEXUS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
