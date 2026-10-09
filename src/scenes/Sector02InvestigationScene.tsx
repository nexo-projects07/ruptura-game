import React, { useState } from 'react';
import { Terminal as TerminalIcon, Zap, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

export const Sector02InvestigationScene: React.FC<{
  player: PlayerState;
  onFinishInvestigation: (expGained: number, creditsGained: number) => void;
}> = ({ player, onFinishInvestigation }) => {
  const [inspectedPoints, setInspectedPoints] = useState<Record<string, boolean>>({
    terminal: false,
    machine: false,
    door: false,
  });
  const [investigationLog, setInvestigationLog] = useState<string>(
    'Inicie a varredura interagindo com as instalações da fábrica abandonada.'
  );

  const handleInspectPoint = (pointKey: 'terminal' | 'machine' | 'door', text: string) => {
    audio.playScan();
    setInspectedPoints(prev => ({ ...prev, [pointKey]: true }));
    setInvestigationLog(text);
  };

  const inspectedCount = Object.values(inspectedPoints).filter(Boolean).length;

  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden p-6 h-full">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} />

      <div className="relative z-10 max-w-3xl mx-auto my-auto w-full bg-slate-900/90 border border-cyan-500/40 p-6 md:p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white">INVESTIGAÇÃO DO DISTRITO INDUSTRIAL</h3>
            <p className="text-xs text-slate-400 font-mono">OBJETIVO: INVESTIGAR A ORIGEM DO SINAL ({inspectedCount}/3 PONTOS)</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
            STATUS DA BUSCA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <button
            onClick={() =>
              handleInspectPoint(
                'terminal',
                'TERMINAL DE SEGURANÇA:\n"REGISTRO CORROMPIDO. Última atividade detectada: 03:17."'
              )
            }
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-32 ${
              inspectedPoints.terminal
                ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50 text-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <TerminalIcon className="w-6 h-6 text-cyan-400" />
              {inspectedPoints.terminal && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <span className="text-xs font-bold">1. TERMINAL DE SEGURANÇA</span>
          </button>

          <button
            onClick={() =>
              handleInspectPoint(
                'machine',
                'MÁQUINA INDUSTRIAL:\n"A máquina está funcionando. Não há fonte de energia identificada."'
              )
            }
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-32 ${
              inspectedPoints.machine
                ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50 text-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <Zap className="w-6 h-6 text-amber-400" />
              {inspectedPoints.machine && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <span className="text-xs font-bold">2. MÁQUINA INDUSTRIAL</span>
          </button>

          <button
            onClick={() =>
              handleInspectPoint(
                'door',
                'PORTA DE CONTENÇÃO:\n"CONTENÇÃO DIMENSIONAL. NÍVEL DE ACESSO: OMEGA."'
              )
            }
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-32 ${
              inspectedPoints.door
                ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50 text-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <Lock className="w-6 h-6 text-fuchsia-400" />
              {inspectedPoints.door && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <span className="text-xs font-bold">3. PORTA DE CONTENÇÃO</span>
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-300 min-h-[90px] whitespace-pre-line leading-relaxed">
          &gt; {investigationLog}
        </div>

        <div className="flex justify-end font-mono">
          <button
            onClick={() => {
              audio.playClick();
              onFinishInvestigation(inspectedCount === 3 ? 100 : 0, inspectedCount === 3 ? 40 : 0);
            }}
            className="py-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
          >
            <span>VOLTAR AO MAPA DE NOVA ARCÁDIA</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};