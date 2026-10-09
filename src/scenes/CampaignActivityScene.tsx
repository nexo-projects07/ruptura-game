import React, { useState } from 'react';
import { Activity, ArrowLeft, CheckCircle2, Radio, RotateCcw, Shield, Signal, Zap } from 'lucide-react';
import type { CampaignPhase } from './CampaignMapScene';
import type { PlayerState } from '../types/game';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { StatCalculator } from '../systems/StatCalculator';
import { audio } from '../systems/AudioEngine';
import { advanceExtraction, isFrequencyDecoded, resolveRelayDefense } from '../systems/CampaignActivitySystem';

type ActivityStatus = 'ACTIVE' | 'FAILED';

interface CampaignActivitySceneProps {
  phase: CampaignPhase;
  player: PlayerState;
  onComplete: () => void;
  onAbandon: () => void;
}

export const CampaignActivityScene: React.FC<CampaignActivitySceneProps> = ({
  phase,
  player,
  onComplete,
  onAbandon,
}) => {
  const [status, setStatus] = useState<ActivityStatus>('ACTIVE');
  const [frequency, setFrequency] = useState(500);
  const [decodeAttempts, setDecodeAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [round, setRound] = useState(1);
  const [relayIntegrity, setRelayIntegrity] = useState(100);
  const [routeIndex, setRouteIndex] = useState(0);
  const [routeErrors, setRouteErrors] = useState(0);
  const sequence = phase.activitySequence ?? ['A', 'C', 'D'];
  const roundsRequired = phase.activityRounds ?? 3;
  const playerStats = StatCalculator.calculate(player);

  const resetActivity = () => {
    setStatus('ACTIVE');
    setFrequency(500);
    setDecodeAttempts(0);
    setFeedback('');
    setRound(1);
    setRelayIntegrity(100);
    setRouteIndex(0);
    setRouteErrors(0);
  };

  const complete = () => {
    audio.playSecretFound();
    onComplete();
  };

  const decodeSignal = () => {
    const target = phase.targetFrequency ?? 620;
    if (isFrequencyDecoded(frequency, target)) {
      complete();
      return;
    }

    const attempts = decodeAttempts + 1;
    setDecodeAttempts(attempts);
    audio.playDenied();
    if (attempts >= 4) {
      setStatus('FAILED');
      setFeedback('O ruído corrompeu o sinal. Recalibre e tente novamente.');
    } else {
      setFeedback(frequency < target ? 'Sinal abaixo da faixa. Aumente a frequência.' : 'Sinal acima da faixa. Reduza a frequência.');
    }
  };

  const defendRelay = (action: 'DISRUPT' | 'BRACE' | 'REPAIR') => {
    const result = resolveRelayDefense(relayIntegrity, playerStats.def, phase.atk, round, action);
    setRelayIntegrity(result.integrity);
    setFeedback(
      `${result.telegraphed ? 'Carga telegrafada' : 'Pulso de pressão'}: ${result.damage} de integridade perdida${result.repaired ? `, ${result.repaired} reparada` : ''}.`
    );
    if (result.integrity <= 0) {
      setStatus('FAILED');
      return;
    }
    if (round >= roundsRequired) {
      complete();
      return;
    }
    setRound(value => value + 1);
  };

  const routeToBeacon = (choice: string) => {
    const result = advanceExtraction(sequence, routeIndex, choice, routeErrors);
    if (!result.correct) {
      setRouteErrors(result.errors);
      audio.playDenied();
      if (result.failed) {
        setStatus('FAILED');
        setFeedback('A rota foi cercada. A equipe não conseguiu alcançar a extração.');
      } else {
        setFeedback('Esse acesso está bloqueado. O rastreador ainda indica outro sinal.');
      }
      return;
    }

    audio.playScan();
    setRouteIndex(result.nextIndex);
    setFeedback(`Sinal ${result.nextIndex}/${sequence.length} confirmado.`);
    if (result.nextIndex >= sequence.length) complete();
  };

  const activityName = phase.activityType === 'DECODE'
    ? 'SINTONIA DE SINAL'
    : phase.activityType === 'DEFEND'
    ? 'DEFESA DE RELÉ'
    : 'ROTA DE EXTRAÇÃO';

  return (
    <div className="relative flex-1 min-h-0 overflow-y-auto bg-slate-950 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} />
      <main className="relative z-10 max-w-4xl mx-auto w-full p-3 sm:p-5 md:p-8 space-y-5">
        <div className="flex items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <div>
            <p className="text-[10px] text-cyan-400 tracking-widest">{phase.location.toUpperCase()}</p>
            <h1 className="text-xl sm:text-2xl font-black text-white">{phase.title}</h1>
          </div>
          <button
            onClick={onAbandon}
            className="min-h-10 px-3 border border-slate-700 rounded-lg text-xs text-slate-300 hover:border-cyan-400 flex items-center gap-2"
          >
            <ArrowLeft size={15} /> MAPA
          </button>
        </div>

        <section className="border border-cyan-500/30 bg-slate-900/90 rounded-xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-cyan-300">
            {phase.activityType === 'DECODE' ? <Signal size={18} /> : phase.activityType === 'DEFEND' ? <Shield size={18} /> : <Activity size={18} />}
            <span className="text-xs font-bold tracking-wider">{activityName}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{phase.activityObjective ?? phase.summary}</p>
          {phase.invasion && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-200">
              <strong>{phase.invasion.alert}</strong>
              <p className="mt-1 text-slate-300">Se o relé cair, {phase.invasion.breachedConsequence.toLowerCase()}</p>
            </div>
          )}

          {status === 'FAILED' ? (
            <div className="border-t border-rose-500/30 pt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-rose-300">{feedback || 'O objetivo não foi concluído.'}</p>
              <div className="flex gap-2">
                <button onClick={resetActivity} className="min-h-10 px-3 rounded-lg bg-cyan-700 text-white text-xs font-bold flex items-center gap-2">
                  <RotateCcw size={14} /> TENTAR DE NOVO
                </button>
                <button onClick={onAbandon} className="min-h-10 px-3 rounded-lg border border-slate-700 text-slate-300 text-xs">SAIR</button>
              </div>
            </div>
          ) : phase.activityType === 'DECODE' ? (
            <div className="space-y-4 border-t border-slate-800 pt-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>FREQUÊNCIA DO RECEPTOR</span>
                <strong className="text-cyan-300">{frequency} Hz</strong>
              </div>
              <input
                type="range"
                min="350"
                max="1000"
                step="5"
                value={frequency}
                onChange={event => setFrequency(Number(event.target.value))}
                className="w-full accent-cyan-400"
                aria-label="Frequência do receptor"
              />
              <div className="flex justify-between text-[10px] text-slate-500"><span>350 Hz</span><span>1000 Hz</span></div>
              <button onClick={decodeSignal} className="min-h-11 w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2">
                <Radio size={15} /> SINTONIZAR SINAL
              </button>
              <p className="text-xs text-amber-300" aria-live="polite">{feedback || `${4 - decodeAttempts} tentativas antes da perda do sinal.`}</p>
            </div>
          ) : phase.activityType === 'DEFEND' ? (
            <div className="space-y-4 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">CICLO {round}/{roundsRequired} · {round % 2 === 1 ? 'CARGA TELEGRAFADA' : 'PULSO DE PRESSÃO'}</span>
                <strong className={relayIntegrity > 35 ? 'text-emerald-300' : 'text-rose-300'}>RELÉ {relayIntegrity}%</strong>
              </div>
              <div className="h-2 bg-slate-800 rounded overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${relayIntegrity}%` }} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button onClick={() => defendRelay('DISRUPT')} className="min-h-12 px-3 rounded-lg border border-rose-500/40 bg-rose-950/50 text-rose-200 text-xs font-bold flex justify-center items-center gap-2"><Zap size={14} /> INTERROMPER</button>
                <button onClick={() => defendRelay('BRACE')} className="min-h-12 px-3 rounded-lg border border-blue-500/40 bg-blue-950/50 text-blue-200 text-xs font-bold flex justify-center items-center gap-2"><Shield size={14} /> BLOQUEAR</button>
                <button onClick={() => defendRelay('REPAIR')} className="min-h-12 px-3 rounded-lg border border-emerald-500/40 bg-emerald-950/50 text-emerald-200 text-xs font-bold flex justify-center items-center gap-2"><Activity size={14} /> REPARAR</button>
              </div>
              <p className="text-xs text-amber-300" aria-live="polite">{feedback || 'Interromper é mais eficaz contra cargas telegrafadas; reparar recupera 20 de integridade.'}</p>
            </div>
          ) : (
            <div className="space-y-4 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>SINAIS CONFIRMADOS</span>
                <strong className="text-cyan-300">{routeIndex}/{sequence.length}</strong>
                <span className="text-rose-300">ERROS {routeErrors}/2</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['A', 'B', 'C', 'D'].map(beacon => (
                  <button key={beacon} onClick={() => routeToBeacon(beacon)} className="aspect-square rounded-lg border border-cyan-500/30 bg-slate-950 hover:bg-cyan-950 text-cyan-200 text-lg font-black">
                    {beacon}
                  </button>
                ))}
              </div>
              <p className="text-xs text-amber-300" aria-live="polite">{feedback || 'Siga a sequência de sinais do rastreador. Dois acessos incorretos encerram a tentativa.'}</p>
            </div>
          )}
        </section>

        {status === 'ACTIVE' && (
          <button onClick={onAbandon} className="text-xs text-slate-500 hover:text-slate-300">ABANDONAR ATIVIDADE</button>
        )}
      </main>
    </div>
  );
};