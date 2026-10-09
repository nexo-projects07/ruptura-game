import React, { useState } from 'react';
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
  const [, setSaveVersion] = useState(0);

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
    <div className="relative w-full h-full min-h-dvh flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-hidden bg-slate-950 font-mono">
      <AtmosphericCanvas />

      <div className="relative z-10 w-full max-w-xl bg-slate-900/85 border border-cyan-500/40 p-6 md:p-10 rounded-2xl backdrop-blur-xl shadow-2xl shadow-cyan-950/60 my-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] md:text-xs tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>RPG SCI-FI DIMENSIONAL — V2.0 MULTIVERSO</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] mb-2">
          RUPTURA 2.0
        </h1>

        <p className="text-xs md:text-sm text-cyan-300/90 tracking-wider uppercase mb-3">
          10 FASES • NEXUS MULTIVERSAL • COMBATE DINÂMICO
        </p>

        <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mb-8 font-light italic leading-relaxed font-sans">
          "Quando duas realidades colidem, nenhuma permanece a mesma. Bem-vindo à Convergência."
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              audio.playClick();
              onStartNewGame();
            }}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-cyan-500/25 transition duration-200 flex items-center justify-center gap-2 text-xs md:text-sm"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>NOVO JOGO</span>
          </button>

          <button
            onClick={handleContinueClick}
            className={`w-full py-3 px-5 border font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs md:text-sm ${
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
                audio.playPortal();
                onOpenNexus();
              }}
              className="w-full py-3 px-5 bg-fuchsia-950/60 hover:bg-fuchsia-900/80 border border-fuchsia-500/50 hover:border-fuchsia-400 text-fuchsia-300 font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs md:text-sm shadow-md shadow-fuchsia-950/30"
            >
              <Orbit className="w-4 h-4 text-fuchsia-400 animate-spin" />
              <span>HUB NEXUS 2.0</span>
            </button>
          )}

          <button
            onClick={() => {
              audio.playClick();
              setIsSettingsOpen(true);
            }}
            className="w-full py-2.5 px-5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 font-bold tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 text-xs"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>CONFIGURAÇÕES</span>
          </button>
        </div>

        {saveAlert && (
          <div className="mt-4 text-xs text-rose-400 bg-rose-950/80 border border-rose-500/40 px-3 py-1.5 rounded-lg animate-bounce">
            ⚠️ {saveAlert}
          </div>
        )}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onProgressCleared={() => setSaveVersion(v => v + 1)}
      />
    </div>
  );
};
