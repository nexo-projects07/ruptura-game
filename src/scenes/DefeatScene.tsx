import React from 'react';
import { AlertTriangle, RefreshCw, Map, Orbit } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { audio } from '../systems/AudioEngine';

interface DefeatSceneProps {
  onRetry: () => void;
  onReturnToMap?: () => void;
  onGoToNexus?: () => void;
}

export const DefeatScene: React.FC<DefeatSceneProps> = ({ onRetry, onReturnToMap, onGoToNexus }) => {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-hidden h-full bg-slate-950">
      <AtmosphericCanvas />
      <div className="relative z-10 max-w-md w-full bg-slate-900/90 border border-rose-500/40 p-6 md:p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 mx-auto shadow-lg shadow-rose-500/20">
          <AlertTriangle className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase">RUPTURA // COLAPSO</span>
          <h2 className="text-3xl md:text-4xl font-black text-rose-500 tracking-wider mt-1">DERROTA</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase font-semibold">
            SISTEMAS DO EXPLORADOR COLAPSARAM
          </p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          A energia da anomalia sobrecarregou seus escudos temporais. Kael foi forçado a recuar para recalibrar os padrões da matriz.
        </p>

        <div className="flex flex-col gap-2.5 font-mono pt-2">
          <button
            onClick={() => {
              audio.playClick();
              onRetry();
            }}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 text-xs md:text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>TENTAR NOVAMENTE</span>
          </button>

          {onReturnToMap && (
            <button
              onClick={() => {
                audio.playClick();
                onReturnToMap();
              }}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs"
            >
              <Map className="w-4 h-4 text-cyan-400" />
              <span>RETORNAR AO MAPA DA CAMPANHA</span>
            </button>
          )}

          {onGoToNexus && (
            <button
              onClick={() => {
                audio.playClick();
                onGoToNexus();
              }}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs"
            >
              <Orbit className="w-4 h-4 text-cyan-400" />
              <span>RECALIBRAR NO NEXUS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
