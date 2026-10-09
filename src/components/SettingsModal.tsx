import React, { useState } from 'react';
import { Volume2, VolumeX, Trash2, X, Sliders } from 'lucide-react';
import { audio } from '../systems/AudioEngine';
import { SaveEngine } from '../systems/SaveEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgressCleared?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onProgressCleared }) => {
  const [muted, setMuted] = useState(audio.muted);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const toggleMute = () => {
    audio.muted = !audio.muted;
    setMuted(audio.muted);
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 p-6 rounded-2xl max-w-md w-full font-mono shadow-2xl relative space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sliders className="w-5 h-5" />
            <span className="font-bold tracking-wider">CONFIGURAÇÕES</span>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300">EFEITOS SONOROS</span>
            <button
              onClick={toggleMute}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                muted
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{muted ? 'DESATIVADO' : 'ATIVADO'}</span>
            </button>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs text-slate-300 block">DADOS DE JOGO</span>
            <button
              onClick={handleClearData}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                confirmDelete
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmDelete ? 'CONFIRMAR APAGAR PROGRESSO?' : 'APAGAR PROGRESSO SALVO'}</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition"
        >
          FECHAR
        </button>
      </div>
    </div>
  );
};