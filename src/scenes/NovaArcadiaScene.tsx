import React, { useState } from 'react';
import { Terminal, ShieldAlert, Radio, Activity, ChevronRight, Eye } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { KaelAvatar } from '../components/KaelAvatar';
import { FragmentadoAvatar } from '../components/FragmentadoAvatar';
import { InvestigationPoint } from '../components/InvestigationPoint';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface NovaArcadiaSceneProps {
  player: PlayerState;
  onStartCombat: () => void;
  onMenuClick: () => void;
}

export const NovaArcadiaScene: React.FC<NovaArcadiaSceneProps> = ({
  player,
  onStartCombat,
  onMenuClick,
}) => {
  const [inspectedPoints, setInspectedPoints] = useState<Record<string, boolean>>({
    terminal: false,
    debris: false,
    signal: false,
  });

  const [activeLog, setActiveLog] = useState<string>(
    'Selecione os pontos de interesse na área para escanear anomalias dimensionais.'
  );

  const [inFirstEncounter, setInFirstEncounter] = useState<boolean>(false);

  const inspectedCount = Object.values(inspectedPoints).filter(Boolean).length;
  const isInvestigationComplete = inspectedCount === 3;

  const handleInspect = (key: 'terminal' | 'debris' | 'signal', message: string) => {
    audio.playScan();
    setInspectedPoints(prev => ({ ...prev, [key]: true }));
    setActiveLog(message);
  };

  const handleAdvance = () => {
    audio.playClick();
    setInFirstEncounter(true);
  };

  return (
    <div className="relative w-full h-full min-h-dvh flex flex-col justify-between overflow-hidden select-none bg-slate-950 p-4 md:p-6">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onMenuClick={onMenuClick} />

      <main className="relative z-20 flex-1 max-w-6xl w-full mx-auto my-auto flex flex-col justify-center py-4">
        {!inFirstEncounter ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4 bg-slate-900/90 border border-cyan-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col items-center justify-between font-mono space-y-4">
              <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs">
                  <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
                  <span className="font-bold tracking-wider">UNIDADE DE RECONHECIMENTO</span>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                  NÍVEL {player.level}
                </span>
              </div>

              <div className="relative my-auto flex flex-col items-center">
                <KaelAvatar state="idle" />
                <div className="mt-2 text-center">
                  <h3 className="text-base font-black tracking-wider text-white">{player.name}</h3>
                  <p className="text-[10px] text-cyan-400 tracking-widest uppercase">
                    {player.role} // IMPLANTES QUÂNTICOS
                  </p>
                </div>
              </div>

              <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">HP:</span>
                  <span className="text-cyan-300 font-bold">{player.hp}/{player.maxHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ATK / DEF:</span>
                  <span className="text-cyan-300 font-bold">{player.atk} / {player.def}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">REGIAO:</span>
                  <span className="text-fuchsia-300 font-bold">NOVA ARCÁDIA</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900/90 border border-cyan-500/40 p-5 md:p-6 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col justify-between font-mono space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-black tracking-wide text-white">
                    SETOR 01 — PONTO DE IMPACTO
                  </h2>
                  <p className="text-xs text-slate-400">
                    VARREDURA DE ANOMALIAS NO PERÍMETRO URBANO
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-cyan-300 font-bold">
                    INVESTIGAÇÃO: <span className="text-white">{inspectedCount}/3</span>
                  </span>
                  <div className="w-20 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${(inspectedCount / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InvestigationPoint
                  id="terminal"
                  title="PONTO A — TERMINAL DE SEGURANÇA"
                  subtitle="ESTAÇÃO METROPOLITANA"
                  isInspected={inspectedPoints.terminal}
                  onClick={() =>
                    handleInspect('terminal', 'TERMINAL SEM ENERGIA. ÚLTIMO REGISTRO: 03:17.')
                  }
                  icon={<Terminal className="w-5 h-5" />}
                />

                <InvestigationPoint
                  id="debris"
                  title="PONTO B — DESTROÇOS DIMENSIONAIS"
                  subtitle="RESÍDUOS DE MATÉRIA"
                  isInspected={inspectedPoints.debris}
                  onClick={() =>
                    handleInspect('debris', 'RESÍDUO DIMENSIONAL DETECTADO. COMPOSIÇÃO DESCONHECIDA.')
                  }
                  icon={<ShieldAlert className="w-5 h-5 text-fuchsia-400" />}
                />

                <InvestigationPoint
                  id="signal"
                  title="PONTO C — SINAL DA RUPTURA"
                  subtitle="ANOMALIA NO HORIZONTE"
                  isInspected={inspectedPoints.signal}
                  onClick={() =>
                    handleInspect('signal', 'FONTE DE ENERGIA ANÔMALA DETECTADA. DISTÂNCIA: 184 METROS.')
                  }
                  icon={<Radio className="w-5 h-5 text-amber-400" />}
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 min-h-[80px] flex flex-col justify-center space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                  &gt; DIÁRIO DE BORDO DO EXPLORADOR
                </span>
                <p className="text-xs md:text-sm text-cyan-200 font-light leading-relaxed">
                  "{activeLog}"
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <div className="text-xs">
                  {isInvestigationComplete ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1.5 animate-pulse">
                      <ShieldAlert className="w-4 h-4" />
                      OBJETIVO ATUALIZADO: Uma presença hostil foi detectada.
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Escaneie os 3 pontos para liberar a rota de avanço.
                    </span>
                  )}
                </div>

                <button
                  disabled={!isInvestigationComplete}
                  onClick={handleAdvance}
                  className="w-full md:w-auto py-3 px-8 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:opacity-40 disabled:pointer-events-none text-white font-bold tracking-wider uppercase rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  <span>AVANÇAR</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto w-full bg-slate-900/95 border border-rose-500/60 p-6 md:p-8 rounded-2xl backdrop-blur-xl shadow-2xl shadow-rose-950/60 space-y-6 font-mono text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-bold tracking-widest uppercase animate-pulse">
              <ShieldAlert className="w-4 h-4" />
              [ ALERTA ] MOVIMENTO DETECTADO
            </div>

            <div className="space-y-2 text-left bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                "Kael percebe uma movimentação brusca entre os destroços de alta tensão."
              </p>
              <p className="text-rose-300 text-xs md:text-sm font-semibold leading-relaxed">
                "Algo do outro lado da Ruptura está observando seus passos."
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <FragmentadoAvatar state="idle" />
              <div className="mt-2">
                <h3 className="text-lg font-black text-rose-400 tracking-widest">RASGADOR</h3>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded font-bold">
                  ENTIDADE DA RUPTURA // CLASSE: FRAGMENTADO
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playClick();
                onStartCombat();
              }}
              className="w-full py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-fuchsia-600 hover:opacity-90 text-white font-black tracking-widest uppercase rounded-xl shadow-xl shadow-rose-600/40 transition flex items-center justify-center gap-2 text-xs md:text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>ENTRAR EM COMBATE</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};