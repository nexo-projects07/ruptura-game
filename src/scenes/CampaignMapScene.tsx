import React from 'react';
import { Lock, CheckCircle2, Play, Map, ArrowLeft, Radio, Orbit, Sparkles, Skull } from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';

export interface CampaignPhase {
  id: string;
  title: string;
  location: string;
  summary: string;
  enemy: string;
  hp: number;
  atk: number;
  def: number;
  boss?: boolean;
}

export const CAMPAIGN_PHASES: CampaignPhase[] = [
  { id: 'fase-01', title: 'Primeiro Sinal', location: 'Perímetro de Impacto', summary: 'Kael detecta o primeiro pulso dimensional e encontra uma entidade fragmentada.', enemy: 'Rasgador', hp: 60, atk: 12, def: 4 },
  { id: 'fase-02', title: 'Nova Arcádia', location: 'Distrito Central', summary: 'Investigue a metrópole isolada e rastreie a origem dos sinais anômalos.', enemy: 'Eco de Arcádia', hp: 72, atk: 14, def: 5 },
  { id: 'fase-03', title: 'O Rasgador', location: 'Fenda Norte', summary: 'A entidade que perseguiu Kael revela sua verdadeira força.', enemy: 'Rasgador Alfa', hp: 85, atk: 16, def: 6 },
  { id: 'fase-04', title: 'Distrito Industrial', location: 'Complexo de Energia', summary: 'Reative os sistemas de contenção em uma zona industrial instável.', enemy: 'Sentinela Industrial', hp: 90, atk: 17, def: 7 },
  { id: 'fase-05', title: 'O Vigia', location: 'Torre de Vigilância', summary: 'Um guardião observa os movimentos de Kael e bloqueia o avanço.', enemy: 'Vigia Industrial', hp: 95, atk: 18, def: 8 },
  { id: 'fase-06', title: 'Estação Abandonada', location: 'Estação Ômega', summary: 'Siga os registros deixados pela equipe desaparecida e sobreviva à emboscada.', enemy: 'Predador da Estação', hp: 115, atk: 20, def: 9 },
  { id: 'fase-07', title: 'Centro de Pesquisa', location: 'Laboratório de Contenção', summary: 'Descubra os experimentos que antecederam a Grande Ruptura.', enemy: 'Protótipo Instável', hp: 135, atk: 22, def: 10 },
  { id: 'fase-08', title: 'Guardião Industrial', location: 'Núcleo de Fabricação', summary: 'Enfrente a máquina de defesa que protege o núcleo energético.', enemy: 'Guardião Industrial', hp: 160, atk: 25, def: 12, boss: true },
  { id: 'fase-09', title: 'A Grande Ruptura', location: 'Marco Zero', summary: 'Atravesse o epicentro e enfrente a força que mantém as realidades sobrepostas.', enemy: 'Avatar da Ruptura', hp: 210, atk: 29, def: 14, boss: true },
  { id: 'fase-10', title: 'O Arquiteto', location: 'Além do Véu', summary: 'Chegue à origem da Convergência e confronte a inteligência por trás do colapso.', enemy: 'O Arquiteto', hp: 280, atk: 34, def: 18, boss: true },
];

export const CampaignMapScene: React.FC<{
  player: PlayerState;
  unlockedPhases: string[];
  completedPhases: string[];
  onSelectPhase: (phase: CampaignPhase) => void;
  onMenuClick: () => void;
  onNexusClick?: () => void;
  onUnlockAllDebug?: () => void;
}> = ({
  player,
  unlockedPhases,
  completedPhases,
  onSelectPhase,
  onMenuClick,
  onNexusClick,
  onUnlockAllDebug,
}) => (
  <div className="relative flex-1 min-h-0 overflow-y-auto bg-slate-950 p-4 md:p-8 font-mono">
    <AtmosphericCanvas />
    <div className="relative z-10 max-w-5xl mx-auto space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white flex items-center gap-2 text-xs transition"
          >
            <ArrowLeft size={15} /> MENU
          </button>
          {onNexusClick && (
            <button
              onClick={onNexusClick}
              className="px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-white flex items-center gap-1.5 text-xs transition font-bold shadow-md shadow-cyan-950/40"
            >
              <Orbit size={15} className="animate-spin text-cyan-400" />
              <span>NEXUS HUB</span>
            </button>
          )}
        </div>
        <span className="text-xs tracking-[.25em] text-cyan-300 flex items-center gap-2">
          <Radio size={15} /> CAMPANHA // 10 FASES INTEGRADAS
        </span>
      </div>

      <ProgressionHUD player={player} onNexusClick={onNexusClick} onMenuClick={onMenuClick} />

      {/* Header */}
      <header className="text-center py-2">
        <p className="text-cyan-400 text-xs tracking-[.35em]">2147 // NOVA ARCÁDIA</p>
        <h1 className="text-3xl md:text-5xl font-black tracking-widest mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400">
          RUPTURA 2.0
        </h1>
        <p className="text-slate-400 text-sm mt-1">Capítulo I — A origem do colapso dimensional</p>
        <div className="w-full max-w-sm mx-auto h-2 rounded-full bg-slate-800 mt-4 overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${(completedPhases.length / 10) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-3 mt-2">
          <p className="text-xs text-slate-400 font-bold">
            {completedPhases.length} / 10 fases concluídas
          </p>
          {onUnlockAllDebug && completedPhases.length < 10 && (
            <button
              onClick={onUnlockAllDebug}
              className="text-[10px] text-cyan-400 hover:text-cyan-200 underline opacity-70 hover:opacity-100 transition"
              title="Desbloquear todas as 10 fases para testes imediatos"
            >
              [Desbloquear todas para teste]
            </button>
          )}
        </div>
      </header>

      {/* Grid of 10 Phases */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CAMPAIGN_PHASES.map((ph, i) => {
          const unlocked = unlockedPhases.includes(ph.id);
          const done = completedPhases.includes(ph.id);
          const isBoss = ph.boss;

          return (
            <button
              key={ph.id}
              disabled={!unlocked}
              onClick={() => onSelectPhase(ph)}
              className={`text-left p-4 rounded-xl border transition min-h-36 relative overflow-hidden flex flex-col justify-between ${
                done
                  ? 'border-emerald-500/60 bg-emerald-950/30 hover:border-emerald-400'
                  : unlocked
                  ? isBoss
                    ? 'border-rose-500/60 bg-slate-900/90 hover:border-rose-400 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                    : 'border-cyan-500/50 bg-slate-900/90 hover:border-cyan-300 hover:bg-slate-850 shadow-md shadow-cyan-950/30'
                  : 'border-slate-850 bg-slate-900/40 opacity-50 cursor-not-allowed'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] tracking-widest text-cyan-400 font-bold">
                      FASE {String(i + 1).padStart(2, '0')}
                    </span>
                    {isBoss && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                        <Skull size={11} /> CHEFE
                      </span>
                    )}
                  </div>
                  {done ? (
                    <CheckCircle2 className="text-emerald-400" size={18} />
                  ) : unlocked ? (
                    <Play className="text-cyan-300" size={17} />
                  ) : (
                    <Lock className="text-slate-500" size={17} />
                  )}
                </div>

                <h2 className="font-bold text-white text-base mt-2.5">{ph.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{ph.location}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{ph.summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Inimigo: <strong className="text-slate-300">{ph.enemy}</strong></span>
                <span className="text-cyan-400 font-bold">HP {ph.hp}</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[10px] tracking-wider text-slate-500 pb-4">
        RUPTURA 2.0 • PROGRESSO SALVO NO NAVEGADOR • COMPATÍVEL COM V1
      </p>
    </div>
  </div>
);
