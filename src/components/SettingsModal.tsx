import React, { useState } from 'react';
import { Volume2, VolumeX, Trash2, X, Sliders, Music } from 'lucide-react';
import { audio } from '../systems/AudioEngine';
import { SaveEngine } from '../systems/SaveEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgressCleared?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onProgressCleared }) => {
  const [muted, setMuted] = useState(audio.muted);
  const [bgmVol, setBgmVol] = useState(audio.bgmVolume);
  const [sfxVol, setSfxVol] = useState(audio.sfxVolume);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const toggleMute = () => {
    const nextMute = !muted;
    audio.setMuted(nextMute);
    setMuted(nextMute);
    if (!nextMute) {
      audio.playClick();
    }
  };

  const handleBgmChange = (val: number) => {
    setBgmVol(val);
    audio.setBgmVolume(val);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    audio.setSfxVolume(val);
    audio.playClick();
  };

  const handleClearData = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    SaveEngine.clearSave();
    setConfirmDelete(false);
    audio.playClick();
    if (onProgressCleared) onProgressCleared();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 p-5 sm:p-6 rounded-2xl max-w-md w-full font-mono shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sliders className="w-5 h-5" />
            <span className="font-bold tracking-wider text-sm sm:text-base">CONFIGURAÇÕES DE SISTEMA</span>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white transition touch-manipulation cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span>ÁUDIO GERAL</span>
            </div>
            <button
              onClick={toggleMute}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 touch-manipulation cursor-pointer ${
                muted
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 hover:bg-rose-900'
                  : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900'
              }`}
            >
              <span>{muted ? 'MUTADO' : 'ATIVO'}</span>
            </button>
          </div>

          {/* BGM Volume Slider */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-indigo-400" />
                <span>MÚSICA PROCEDURAL (BGM)</span>
              </div>
              <span className="font-bold text-cyan-300">{Math.round(bgmVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={muted}
              value={bgmVol}
              onChange={e => handleBgmChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
            />
          </div>

          {/* SFX Volume Slider */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>EFEITOS SONOROS (SFX)</span>
              </div>
              <span className="font-bold text-cyan-300">{Math.round(sfxVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={muted}
              value={sfxVol}
              onChange={e => handleSfxChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
            />
          </div>

          {/* Data Reset */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-300 block">DADOS DE JOGO & SALVAMENTO</span>
            <button
              onClick={handleClearData}
              className={`w-full min-h-[42px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 touch-manipulation cursor-pointer ${
                confirmDelete
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmDelete ? 'CONFIRMAR APAGAR PROGRESSO?' : 'APAGAR PROGRESSO SALVO'}</span>
            </button>
            {confirmDelete && (
              <p className="text-[10px] text-rose-400 text-center">
                Esta ação apagará todo o inventário, níveis e registros salvos.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="w-full min-h-[42px] py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition touch-manipulation cursor-pointer"
        >
          FECHAR CONFIGURAÇÕES
        </button>
      </div>
    </div>
  );
};
