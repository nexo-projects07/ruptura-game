import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  MapPin,
  Radar,
  Shield,
  Layers,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface SecretPoint {
  id: string;
  realmId: string;
  name: string;
  sector: string;
  x: number;
  y: number;
  type: 'terminal' | 'arc' | 'anomaly' | 'shrine';
  discovered: boolean;
  solved: boolean;
  targetFreq: number;
  hazard?: string;
  description: string;
  loreText: string;
  reward: { credits: number; fragments: number; matrixCells: number };
}

const INITIAL_POINTS: SecretPoint[] = [
  // Realm Alpha (Nova Arcádia)
  {
    id: 'poi-1',
    realmId: 'realm-alpha',
    name: 'Terminal de Contenção Omega-7',
    sector: 'Setor 01 — Perímetro de Impacto',
    x: 28,
    y: 35,
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
    realmId: 'realm-alpha',
    name: 'Arca de Suprimentos Nanotecnológicos',
    sector: 'Setor 04 — Perímetro Urbano',
    x: 64,
    y: 50,
    type: 'arc',
    discovered: false,
    solved: false,
    targetFreq: 620,
    description: 'Cápsula de carga pressurizada lacrada por um campo eletromagnético descalibrado.',
    loreText: 'REGISTRO 04-F: "Os operários do setor industrial foram os primeiros a ver as sombras com dentes. Ninguém sobreviveu ao turno da noite."',
    reward: { credits: 120, fragments: 3, matrixCells: 2 },
  },
  // Realm Beta (Complexo Industrial)
  {
    id: 'poi-3',
    realmId: 'realm-beta',
    name: 'Fornalha de Plasma Quântico',
    sector: 'Setor 06 — Forja Abandonada',
    x: 42,
    y: 70,
    type: 'terminal',
    discovered: false,
    solved: false,
    targetFreq: 530,
    hazard: 'Superaquecimento Térmico',
    description: 'Caldeira industrial hiperbárica com registros da produção dos primeiros exoesqueletos de contenção.',
    loreText: 'LOG INDUSTRIAL B-9: "A forja agora molda armas que não pertencem ao nosso continuum. O metal parece sangrar luz violeta."',
    reward: { credits: 160, fragments: 4, matrixCells: 3 },
  },
  {
    id: 'poi-4',
    realmId: 'realm-beta',
    name: 'Bunker Subterrâneo de Titânio',
    sector: 'Setor 08 — Subsolo de Nova Arcádia',
    x: 80,
    y: 25,
    type: 'arc',
    discovered: false,
    solved: false,
    targetFreq: 710,
    description: 'Cofre militar lacrado por códigos biométricos corrompidos pela distorção dimensional.',
    loreText: 'RELATÓRIO TÁTICO: "As defesas automáticas continuam ativas mesmo sem comando humano há 12 anos."',
    reward: { credits: 210, fragments: 5, matrixCells: 4 },
  },
  // Realm Gamma (Fenda de Vórtice)
  {
    id: 'poi-5',
    realmId: 'realm-gamma',
    name: 'Câmara de Recombinação Quântica',
    sector: 'Setor 07 — Laboratório de Pesquisa',
    x: 50,
    y: 40,
    type: 'anomaly',
    discovered: false,
    solved: false,
    targetFreq: 880,
    hazard: 'Radiação de Vórtice',
    description: 'Núcleo de testes onde o Arquiteto iniciou a fusão das primeiras linhas temporais.',
    loreText: 'REGISTRO 07-Q: "Ele não é uma máquina, nem um homem. Ele é o somatório de todas as decisões que nunca tomamos."',
    reward: { credits: 280, fragments: 6, matrixCells: 5 },
  },
  {
    id: 'poi-6',
    realmId: 'realm-gamma',
    name: 'Relicário do Horizonte de Eventos',
    sector: 'Setor 09 — Borda da Singularidade',
    x: 85,
    y: 75,
    type: 'shrine',
    discovered: false,
    solved: false,
    targetFreq: 960,
    hazard: 'Distorção Gravitacional Extrema',
    description: 'Um monólito flutuante que desafia a gravidade, emanando ondas de choque taquiônicas.',
    loreText: 'TRANSMISSÃO PERDIDA: "Se você está ouvindo isso no passado... não acione o acelerador às 03:14."',
    reward: { credits: 350, fragments: 8, matrixCells: 6 },
  },
];

export const ExplorationScene: React.FC<{
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onBackToNexus: () => void;
}> = ({ player, setPlayer, onBackToNexus }) => {
  const [selectedRealm, setSelectedRealm] = useState<string>('realm-alpha');
  const [points, setPoints] = useState<SecretPoint[]>(() => {
    // Restore discovered state from player.discoveredSecrets
    const discovered = player.discoveredSecrets ?? [];
    return INITIAL_POINTS.map(p => ({
      ...p,
      discovered: p.discovered || discovered.includes(p.id),
      solved: p.solved || discovered.includes(p.id),
    }));
  });

  const [selectedPoint, setSelectedPoint] = useState<SecretPoint | null>(null);
  const [tuningFreq, setTuningFreq] = useState<number>(500);
  const [tuningMsg, setTuningMsg] = useState<string | null>(null);
  const [radarPing, setRadarPing] = useState<boolean>(true);

  // Play Exploration BGM
  useEffect(() => {
    audio.playBGM('EXPLORATION');
    return () => {
      audio.stopBGM();
    };
  }, []);

  const realmPoints = points.filter(p => p.realmId === selectedRealm);

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
      setTuningMsg('✅ FREQUÊNCIA SINCRONIZADA! ANOMALIA DECIFRADA COM SUCESSO!');

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
          ? '📡 SINAL DETECTADO! Aumente suavemente a frequência de pulso.'
          : '📡 SINAL DETECTADO! Reduza suavemente a frequência de pulso.'
      );
    } else {
      audio.playDenied();
      setTuningMsg(
        tuningFreq < selectedPoint.targetFreq
          ? '❌ Ruído estático alto. Frequência muito baixa.'
          : '❌ Ruído estático alto. Frequência muito alta.'
      );
    }
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 text-slate-100 font-mono">
      <AtmosphericCanvas realm={selectedRealm} />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-emerald-950 border border-emerald-400/50 rounded-xl shadow-lg shadow-emerald-500/20">
              <Compass className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/40">
                  RECONHECIMENTO LIVRE RUPTURA 5.0
                </span>
                <span className="text-[10px] text-slate-400">
                  {points.filter(p => p.solved).length} / {points.length} Decifrados
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">
                EXPLORAÇÃO DE SETORES & MUNDO ABERTO
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audio.playClick();
                onBackToNexus();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition touch-manipulation cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>NEXUS</span>
            </button>
          </div>
        </div>

        {/* Realm Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              audio.playClick();
              setSelectedRealm('realm-alpha');
              setSelectedPoint(null);
            }}
            className={`px-3 py-1.5 rounded-xl border font-bold transition whitespace-nowrap touch-manipulation cursor-pointer ${
              selectedRealm === 'realm-alpha'
                ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            NOVA ARCÁDIA (ALPHA)
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setSelectedRealm('realm-beta');
              setSelectedPoint(null);
            }}
            className={`px-3 py-1.5 rounded-xl border font-bold transition whitespace-nowrap touch-manipulation cursor-pointer ${
              selectedRealm === 'realm-beta'
                ? 'border-amber-400 bg-amber-950 text-amber-200'
                : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            FORJA INDUSTRIAL (BETA)
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setSelectedRealm('realm-gamma');
              setSelectedPoint(null);
            }}
            className={`px-3 py-1.5 rounded-xl border font-bold transition whitespace-nowrap touch-manipulation cursor-pointer ${
              selectedRealm === 'realm-gamma'
                ? 'border-fuchsia-400 bg-fuchsia-950 text-fuchsia-200'
                : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            FENDA DE VÓRTICE (GAMMA)
          </button>
        </div>

        {/* Main Grid: Tactical Radar View + Decoder Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Tactical Sector Radar Map (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            {/* Radar Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
            
            {/* Top Radar Status */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 relative z-10">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Radar className="w-4 h-4 animate-spin text-emerald-400" />
                <span>RADAR TÁTICO DE SUPERFÍCIE (VARREDURA ATIVA)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">COORDS: X/Y SCAN</span>
            </div>

            {/* Radar Map Canvas Representation with POI Pins */}
            <div className="relative flex-1 w-full bg-slate-950/70 border border-slate-800 rounded-xl min-h-[260px] flex items-center justify-center overflow-hidden my-2">
              {/* Radar circular sweeps */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 sm:w-64 h-48 sm:h-64 rounded-full border border-emerald-500/20" />
                <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border border-emerald-500/20" />
                <div className="w-full h-[1px] bg-emerald-500/15" />
                <div className="h-full w-[1px] bg-emerald-500/15" />
              </div>

              {/* Interactive POI Nodes on Radar */}
              {realmPoints.map(point => {
                const isSelected = selectedPoint?.id === point.id;
                return (
                  <button
                    key={point.id}
                    onClick={() => {
                      audio.playClick();
                      setSelectedPoint(point);
                      setTuningFreq(500);
                      setTuningMsg(null);
                    }}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border transition touch-manipulation cursor-pointer group ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950 shadow-lg shadow-cyan-400/50 scale-125 z-20'
                        : point.solved
                        ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
                        : point.discovered
                        ? 'border-amber-400 bg-amber-950/80 text-amber-300 animate-pulse'
                        : 'border-slate-700 bg-slate-900 text-slate-500 hover:border-slate-400'
                    }`}
                  >
                    {point.solved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : point.type === 'terminal' ? (
                      <Terminal className="w-4 h-4" />
                    ) : point.type === 'shrine' ? (
                      <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    ) : (
                      <Cpu className="w-4 h-4 text-amber-400" />
                    )}

                    {/* Tooltip on hover */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[9px] text-white whitespace-nowrap z-30">
                      {point.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom POI mini list for convenience */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[10px]">
              {realmPoints.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    audio.playClick();
                    setSelectedPoint(p);
                    setTuningFreq(500);
                    setTuningMsg(null);
                  }}
                  className={`p-1.5 rounded-lg border text-left truncate transition touch-manipulation cursor-pointer ${
                    selectedPoint?.id === p.id
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.solved ? '✅ ' : p.discovered ? '📡 ' : '🔒 '} {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Decoder & Terminal Station (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col justify-between min-h-[380px]">
            {selectedPoint ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      {selectedPoint.sector}
                    </span>
                    {selectedPoint.solved && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DECIFRADO
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedPoint.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{selectedPoint.description}</p>
                </div>

                {/* Lore or Hazard info */}
                {selectedPoint.solved ? (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs text-emerald-200 italic leading-relaxed">
                    {selectedPoint.loreText}
                  </div>
                ) : selectedPoint.discovered ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-cyan-400" /> CALIBRAR FREQUÊNCIA:
                        </span>
                        <span className="font-bold text-cyan-300 font-mono">{tuningFreq} MHz</span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="1000"
                        step="10"
                        value={tuningFreq}
                        onChange={e => setTuningFreq(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>200 MHz</span>
                        <span>600 MHz</span>
                        <span>1000 MHz</span>
                      </div>
                    </div>

                    {tuningMsg && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center font-bold">
                        {tuningMsg}
                      </div>
                    )}

                    <button
                      onClick={handleTune}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-cyan-600/30 transition touch-manipulation cursor-pointer"
                    >
                      SINCRONIZAR HARMÔNICA
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
                      <Radio className="w-6 h-6 text-cyan-400 mx-auto mb-2 animate-pulse" />
                      Sinal criptografado detectado no perímetro. Inicie a varredura sensorial para isolar a frequência.
                    </div>
                    <button
                      onClick={() => handleScan(selectedPoint)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-emerald-600/30 transition touch-manipulation cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>INICIAR VARREDURA DO SINAL</span>
                    </button>
                  </div>
                )}

                {/* Rewards preview */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>ESPÓLIO DO PONTO:</span>
                  <span className="text-amber-300 font-bold">
                    +{selectedPoint.reward.credits} CR • +{selectedPoint.reward.fragments} FRAG • +{selectedPoint.reward.matrixCells} CÉL
                  </span>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center p-6 space-y-2 text-slate-400 text-xs">
                <Compass className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-bold text-white">NENHUM PONTO SELECIONADO</p>
                <p>Clique em um dos nós no radar tático à esquerda para iniciar o reconhecimento do setor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
