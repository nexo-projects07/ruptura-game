import React from 'react';
import { Terminal, ChevronRight } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { audio } from '../systems/AudioEngine';

export const IntroScene: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden h-full">
      <AtmosphericCanvas />
      <div className="relative z-10 max-w-2xl w-full bg-slate-900/90 border border-cyan-500/40 p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 border-b border-cyan-500/20 pb-3">
          <Terminal className="w-4 h-4" />
          <span>REGISTRO DE TRANSMISSÃO DE DADOS #001</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          NOVA ARCÁDIA — O PRIMEIRO COLAPSO
        </h2>
        <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base font-light">
          <p>
            No ano de 2088, o céu da metrópole futurista de Nova Arcádia se partiu. Uma fenda dimensional conhecida como <span className="text-fuchsia-400 font-semibold">RUPTURA</span> surgiu, mesclando arquitetura e tecnologia com matéria de realidades desconhecidas.
          </p>
          <p>
            Como <span className="text-cyan-400 font-bold">KAEL</span>, um Explorador tático com implantes quânticos, você deve investigar o epicentro e neutralizar as criaturas geradas pela fusão dimensional.
          </p>
        </div>
        <button
          onClick={() => {
            audio.playClick();
            onContinue();
          }}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold tracking-wider uppercase rounded-xl shadow-md transition flex items-center justify-center gap-2 font-mono"
        >
          <span>INICIAR INVESTIGAÇÃO DE NOVA ARCÁDIA</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};