import React from 'react';
import { Compass } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { audio } from '../systems/AudioEngine';

export const FirstRuptureScene: React.FC<{ onExploreMap: () => void }> = ({ onExploreMap }) => {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center overflow-hidden h-full">
      <AtmosphericCanvas />
      <div className="relative z-10 max-w-xl w-full bg-slate-900/95 border border-fuchsia-500/50 p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-mono uppercase tracking-widest">
          EVOLUÇÃO DA FENDA
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-300">
          A PRIMEIRA RUPTURA
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed font-light">
          Com a derrota da criatura, a anomalia dimensional no céu de Nova Arcádia se expandiu com um pulso ensurdecedor. Estruturas de vidro e aço começam a se rematerializar em novas configurações geométricas.
        </p>

        <div className="p-4 bg-slate-950 border border-fuchsia-500/20 rounded-xl text-xs font-mono text-fuchsia-300">
          &gt; MAPA TÁTICO METROPOLITANO DESBLOQUEADO
        </div>

        <button
          onClick={() => {
            audio.playClick();
            onExploreMap();
          }}
          className="w-full py-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 hover:opacity-90 text-white font-bold tracking-wider uppercase rounded-xl shadow-xl shadow-fuchsia-500/30 transition flex items-center justify-center gap-2 font-mono"
        >
          <Compass className="w-5 h-5" />
          <span>EXPLORAR NOVA ARCÁDIA</span>
        </button>
      </div>
    </div>
  );
};