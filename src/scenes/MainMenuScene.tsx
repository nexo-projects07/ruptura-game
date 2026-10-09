import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Sliders, Orbit, Sparkles } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { SettingsModal } from '../components/SettingsModal';
import { audio } from '../systems/AudioEngine';
import { SaveEngine } from '../systems/SaveEngine';

interface MainMenuSceneProps {
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onOpenNexus?: () => void;
}

export const MainMenuScene: React.FC<MainMenuSceneProps> = ({
  onStartNewGame,
  onContinueGame,
  onOpenNexus,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  useEffect(() => {
    audio.playBGM('MENU');
    return () => {
      audio.stopBGM();
    };
  }, []);

  const hasSave = SaveEngine.hasSave();

  const handleContinueClick = () => {
    audio.playClick();
    if (SaveEngine.hasSave()) {
      onContinueGame();
    } else {
      audio.playDenied();
      setSaveAlert('NENHUM ARQUIVO DE SALVAMENTO ENCONTRADO');
      setTimeout(() => setSaveAlert(null), 2500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-dvh flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center overflow-hidden bg-slate-950 font-mono">
      <AtmosphericCanvas realm="realm-alpha" />

      <div className="relative z-10 w-full max-w-xl bg-slate-900/85 border border-cyan-500/40 p-5 sm:p-6 md:p-10 rounded-2xl backdrop-blur-xl shadow-2xl shadow-cyan-950/60 my-auto flex flex-col items-center">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] md:text-xs tracking-widest uppercase mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>RPG SCI-FI DIMENSIONAL</span>
          <span aria-hidden="true" className="text-cyan-600">·</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] mb-2">
          RUPTURA
        </h1>

        <p className="text-[10px] sm:text-xs md:text-sm text-cyan-300/90 tracking-wider uppercase mb-2 sm:mb-3">
          CAMPANHA CINEMATOGRÁFICA · CO-OP MULTIPLAYER · MUNDO ABERTO · CHEFES MULTIFÁSICOS
        </p>

        <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mb-5 sm:mb-8 font-light italic leading-relaxed font-sans">
          "Quando duas realidades colidem, nenhuma permanece a mesma. Bem-vindo à Convergência."
        </p>

        <div className="flex flex-col gap-2.5 sm:gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              audio.playClick();
              onStartNewGame();
            }}
            className="min-h-[44px] w-full py-3 sm:py-3.5 px-5 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 active:scale-95 text-slate-950 font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-cyan-500/25 transition duration-200 flex items-center justify-center gap-2 text-xs md:text-sm touch-manipulation cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>NOVO JOGO</span>
          </button>

          <button
            onClick={handleContinueClick}
            className={`min-h-[44px] w-full py-3 px-5 border font-bold tracking-wider uppercase rounded-xl active:scale-95 transition flex items-center justify-center gap-2 text-xs md:text-sm touch-manipulation cursor-pointer ${
              hasSave
                ? 'bg-slate-900 hover:bg-slate-800 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-950/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>CONTINUAR</span>
          </button>

          {onOpenNexus && (
            <button
              onClick={() => {
                audio.playClick();
                onOpenNexus();
              }}
              className="min-h-[44px] w-full py-2.5 px-5 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 active:scale-95 text-indigo-200 font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs touch-manipulation cursor-pointer"
            >
              <Orbit className="w-4 h-4" />
              <span>NEXUS MULTIVERSAL</span>
            </button>
          )}

          <button
            onClick={() => {
              audio.playClick();
              setIsSettingsOpen(true);
            }}
            className="min-h-[44px] w-full py-2.5 px-5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 active:scale-95 text-slate-300 hover:text-white font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs touch-manipulation cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>CONFIGURAÇÕES & ÁUDIO</span>
          </button>
        </div>

        {saveAlert && (
          <div className="mt-4 p-2.5 bg-rose-950/90 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold animate-pulse">
            {saveAlert}
          </div>
        )}
      </div>

      <footer className="relative z-10 text-[10px] sm:text-xs text-slate-400 mt-4 font-mono">
        MOTOR MULTIVERSAL DE COMBATE E ÁUDIO PROCEDURAL
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
