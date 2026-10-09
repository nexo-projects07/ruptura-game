import React, { useState } from 'react';
import { Compass, Radio, CheckCircle2, Flame, Lock, AlertTriangle } from 'lucide-react';
import { TacticalMapCanvas } from '../components/TacticalMapCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { NodeData, PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

const mapNodes: NodeData[] = [
  {
    id: 'setor-01',
    name: 'SETOR 01 — PONTO DE IMPACTO',
    code: 'SEC-01',
    status: 'CONCLUÍDO',
    x: 25,
    y: 65,
    description: 'Local onde a primeira anomalia dimensional se manifestou em Nova Arcádia.'
  },
  {
    id: 'setor-02',
    name: 'SETOR 02 — DISTRITO INDUSTRIAL',
    code: 'SEC-02',
    status: 'DISPONÍVEL',
    x: 48,
    y: 40,
    description: 'Complexo de produção abandonado transmitindo pulsos de energia desconhecidos.'
  },
  {
    id: 'arena',
    name: 'ARENA NOVA ARCÁDIA',
    code: 'ARN-01',
    status: 'DISPONÍVEL',
    x: 32,
    y: 25,
    description: 'Zona de combate tático para engajar remanescentes das forças Fragmentadas.'
  },
  {
    id: 'setor-03',
    name: 'SETOR 03 — ESTAÇÃO ABANDONADA',
    code: 'SEC-03',
    status: 'BLOQUEADO',
    x: 70,
    y: 60,
    description: 'Antiga malha de transporte magnético. Bloqueada por interferência dimensional.'
  },
  {
    id: 'setor-04',
    name: 'SETOR 04 — CENTRO DE PESQUISA',
    code: 'SEC-04',
    status: 'BLOQUEADO',
    x: 75,
    y: 30,
    description: 'Laboratório de física quântica. Protocolos de contenção ativados.'
  },
  {
    id: 'grande-ruptura',
    name: '🌀 GRANDE RUPTURA',
    code: 'ANOMALY-ALPHA',
    status: 'BLOQUEADO',
    x: 82,
    y: 18,
    description: 'Epicentro da fenda dimensional. Requer estabilização regional para acesso.'
  }
];

export const TacticalMapScene: React.FC<{
  player: PlayerState;
  onSelectSector01: () => void;
  onSelectSector02: () => void;
  onSelectArena: () => void;
  onMenuClick: () => void;
}> = ({ player, onSelectSector01, onSelectSector02, onSelectArena, onMenuClick }) => {
  const [lockedModalText, setLockedModalText] = useState<string | null>(null);

  const handleNodeClick = (node: NodeData) => {
    audio.playClick();
    if (node.status === 'BLOQUEADO') {
      audio.playDenied();
      setLockedModalText(
        node.id === 'grande-ruptura'
          ? 'ACESSO NEGADO\n\nEstabilidade dimensional insuficiente. Complete mais investigações para estabilizar a região.'
          : `ACESSO RESTRITO (${node.code})\n\nEste nó do mapa está bloqueado temporariamente. Continue explorando Setores ativos.`
      );
      return;
    }

    if (node.id === 'setor-02') {
      onSelectSector02();
    } else if (node.id === 'arena') {
      onSelectArena();
    } else if (node.id === 'setor-01') {
      onSelectSector01();
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden h-full">
      <TacticalMapCanvas />
      <ProgressionHUD player={player} onMenuClick={onMenuClick} />

      <div className="relative z-10 px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl md:text-2xl font-black text-white tracking-widest">MAPA DE NOVA ARCÁDIA</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">SELECIONE UM NÓ DE SETOR PARA NAVEGAR</p>
        </div>
        <div className="bg-slate-900/80 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>ESTABILIDADE DA REGIÃO: 14%</span>
        </div>
      </div>

      <div className="relative z-20 flex-1 my-4 max-w-5xl mx-auto w-full px-4">
        <div className="relative w-full h-full min-h-[380px] bg-slate-950/40 border border-cyan-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="25%" y1="65%" x2="48%" y2="40%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="65%" x2="32%" y2="25%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4" />
            <line x1="48%" y1="40%" x2="70%" y2="60%" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="2" strokeDasharray="4" />
            <line x1="48%" y1="40%" x2="75%" y2="30%" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="2" strokeDasharray="4" />
            <line x1="75%" y1="30%" x2="82%" y2="18%" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="2" strokeDasharray="2" />
          </svg>

          {mapNodes.map((node) => {
            const isCompleted = node.status === 'CONCLUÍDO';
            const isAvailable = node.status === 'DISPONÍVEL';
            const isLocked = node.status === 'BLOQUEADO';

            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isCompleted
                        ? 'bg-slate-900 border-slate-500 text-slate-400'
                        : isAvailable
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-cyan-500/50 scale-110 animate-pulse hover:scale-125'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isAvailable && <Flame className="w-5 h-5 text-cyan-400" />}
                    {isLocked && <Lock className="w-5 h-5 text-slate-600" />}
                  </div>

                  <div className="mt-2 bg-slate-900/90 border border-slate-800 group-hover:border-cyan-500/50 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-mono font-bold whitespace-nowrap shadow-md text-slate-200">
                    {node.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lockedModalText && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 p-6 rounded-2xl max-w-md w-full font-mono text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <div className="text-xs text-rose-300 whitespace-pre-line leading-relaxed">
              {lockedModalText}
            </div>
            <button
              onClick={() => {
                audio.playClick();
                setLockedModalText(null);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs"
            >
              COMPREENDIDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};