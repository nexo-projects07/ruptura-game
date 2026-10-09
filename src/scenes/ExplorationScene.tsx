import React, { useState } from 'react';
import {
  Compass,
  ArrowLeft,
  Terminal,
  Radio,
  Cpu,
  Coins,
  Sparkles,
  Search,
  CheckCircle2,
  Key,
  Unlock,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface SecretPoint {
  id: string;
  name: string;
  sector: string;
  type: 'terminal' | 'arc' | 'anomaly';
  discovered: boolean;
  solved: boolean;
  targetFreq: number;
  description: string;
  loreText: string;
  reward: { credits: number; fragments: number; matrixCells: number };
}

const INITIAL_POINTS: SecretPoint[] = [
  {
    id: 'poi-1',
    name: 'Terminal de Contenção Omega-7',
    sector: 'Setor 01 — Perímetro de Impacto',
    type: 'terminal',
    discovered: false,
    solved: false,
    targetFreq: 440,
    description: 'Um terminal governamental de Nova Arcádia isolado pela expansão da primeira fenda.',
    loreText: 'REGISTRO 01-A: "A anomalia não surgiu do nada. Nossos aceleradores de partículas ultrapassaram a constante de Planck às 03:14."',
    reward: { credits: 80, fragments: 2, matrixCells: 1 },
  },
  {
    id: 'poi-2',
    name: 'Arca de Suprimentos Nanotecnológicos',
    sector: 'Setor 04 — Complexo Industrial',
    type: 'arc',
    discovered: false,
    solved: false,
    targetFreq: 620,
    description: 'Cápsula de carga pressurizada lacrada por um campo eletromagnético descalibrado.',
    loreText: 'REGISTRO 04-F: "Os operários do setor industrial foram os primeiros a ver as sombras com dentes. Ninguém sobreviveu ao turno da noite."',
    reward: { credits: 120, fragments: 3, matrixCells: 2 },
  },
  {
    id: 'poi-3',
    name: 'Câmara de Recombinação Quântica',
    sector: 'Setor 07 — Laboratório de Pesquisa',
    type: 'anomaly',
    discovered: false,
    solved: false,
    targetFreq: 880,
    description: 'Núcleo de testes onde o Arquiteto iniciou a fusão das primeiras linhas temporais.',
    loreText: 'REGISTRO 07-Q: "Ele não é uma máquina, nem um homem. Ele é o somatório de todas as decisões que nunca tomamos."',
    reward: { credits: 200, fragments: 5, matrixCells: 4 },
  },
];

export const ExplorationScene: React.FC<{
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onBackToNexus: () => void;
}> = ({ player, setPlayer, onBackToNexus }) => {
  const [points, setPoints] = useState<SecretPoint[]>(INITIAL_POINTS);
  const [selectedPoint, setSelectedPoint] = useState<SecretPoint | null>(null);
  const [tuningFreq, setTuningFreq] = useState<number>(500);
  const [tuningMsg, setTuningMsg] = useState<string | null>(null);

  const handleScan = (point: SecretPoint) => {
    audio.playScan();
    setPoints(prev =>
      prev.map(p => (p.id === point.id ? { ...p, discovered: true } : p))
    );
    setSelectedPoint({ ...point, discovered: true });
    setTuningFreq(500);
    setTuningMsg(null);
  };

  const handleTune = () => {
    if (!selectedPoint) return;
    const diff = Math.abs(tuningFreq - selectedPoint.targetFreq);

    if (diff <= 25) {
      // Success!
      audio.playSecretFound();
      setTuningMsg('✅ FREQUÊNCIA SINCRONIZADA! SEGREDO DECIFRADO!');

      // Grant rewards
      setPlayer(p => ({
        ...p,
        credits: p.credits + selectedPoint.reward.credits,
        fragments: p.fragments + selectedPoint.reward.fragments,
        matrixCells: (p.matrixCells ?? 0) + selectedPoint.reward.matrixCells,
        discoveredSecrets: [...(p.discoveredSecrets ?? []), selectedPoint.id],
      }));

      setPoints(prev =>
        prev.map(p => (p.id === selectedPoint.id ? { ...p, solved: true } : p))
      );
      setSelectedPoint(prev => (prev ? { ...prev, solved: true } : null));
    } else if (diff < 80) {
      audio.playClick();
      setTuningMsg(
        tuningFreq < selectedPoint.targetFreq
          ? '📡 SINAL PRÓXIMO! Aumente ligeiramente a frequência.'
          : '📡 SINAL PRÓXIMO! Reduza ligeiramente a frequência.'
      );
    } else {
      audio.playDenied();
      setTuningMsg(
        tuningFreq < selectedPoint.targetFreq
          ? '❌ Interferência alta. Frequência muito baixa.'
          : '❌ Interferência alta. Frequência muito alta.'
      );
    }
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto space-y-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <button
            onClick={onBackToNexus}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center gap-2 text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR AO NEXUS</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-emerald-300">
            <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="tracking-widest">SISTEMA DE EXPLORAÇÃO & SEGREDOS</span>
          </div>
        </div>

        {/* Overview Header */}
        <div className="bg-slate-900/80 border border-emerald-500/40 p-4 md:p-6 rounded-2xl backdrop-blur-md">
          <h2 className="text-xl md:text-2xl font-black text-white">
            RECONHECIMENTO DE FENDA & ANOMALIAS
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Use o sensor quântico do traje de Kael para detectar arquivos perdidos, caixas de nanotecnologia e calibrar frequências de decodificação dimensional.
          </p>
        </div>

        {/* Points of interest list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {points.map((p, idx) => (
            <div
              key={p.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between min-h-[160px] ${
                p.solved
                  ? 'border-emerald-500/60 bg-emerald-950/30'
                  : p.discovered
                  ? 'border-cyan-500/50 bg-slate-900/90'
                  : 'border-slate-800 bg-slate-950/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-cyan-400 tracking-wider">
                    PONTO 0{idx + 1}
                  </span>
                  {p.solved ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DECIFRADO
                    </span>
                  ) : p.discovered ? (
                    <span className="text-[10px] text-cyan-300 font-bold">DETECTADO</span>
                  ) : (
                    <span className="text-[10px] text-slate-500">OCULTO</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white">{p.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{p.sector}</p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">{p.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between">
                <span className="text-[10px] text-amber-400">
                  +{p.reward.matrixCells} Células
                </span>
                <button
                  onClick={() => handleScan(p)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{p.solved ? 'REVER' : p.discovered ? 'SINTONIZAR' : 'ESCANEAR'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Frequency Tuning Interactive Decryption Console */}
        {selectedPoint && (
          <div className="bg-slate-900/90 border border-cyan-500/40 p-5 md:p-6 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-300 text-sm font-bold">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>SINTONIZADOR QUÂNTICO — {selectedPoint.name}</span>
              </div>
              <span className="text-xs text-slate-400">{selectedPoint.sector}</span>
            </div>

            {selectedPoint.solved ? (
              <div className="space-y-3 bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl">
                <p className="text-xs font-bold text-emerald-400">DADOS DECODIFICADOS COM SUCESSO:</p>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  {selectedPoint.loreText}
                </p>
                <p className="text-[11px] text-cyan-300">
                  Recompensas creditadas ao inventário de Kael (+{selectedPoint.reward.credits} Créditos, +{selectedPoint.reward.fragments} Fragmentos, +{selectedPoint.reward.matrixCells} Células de Matriz).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Ajuste o oscilador de frequência para sintonizar a assinatura quântica da anomalia:
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">FREQUÊNCIA:</span>
                    <span className="text-cyan-300 font-bold text-base">{tuningFreq} MHz</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    step="10"
                    value={tuningFreq}
                    onChange={e => setTuningFreq(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>200 MHz</span>
                    <span>600 MHz</span>
                    <span>1000 MHz</span>
                  </div>
                </div>

                {tuningMsg && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-cyan-300 text-center">
                    {tuningMsg}
                  </div>
                )}

                <button
                  onClick={handleTune}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs md:text-sm tracking-wider uppercase transition flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>CALIBRAR FREQUÊNCIA</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
