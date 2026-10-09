import React, { useState } from 'react';
import {
  Orbit,
  Map,
  Compass,
  Cpu,
  Database,
  ArrowLeft,
  Save,
  Radio,
  Zap,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  Coins
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface NexusHubSceneProps {
  player: PlayerState;
  completedPhases: string[];
  unlockedRealms: string[];
  onOpenMultiverseMap: () => void;
  onOpenCampaignMap: () => void;
  onOpenExploration: () => void;
  onOpenUpgrades: () => void;
  onOpenLoreArchives: () => void;
  onMenuClick: () => void;
  onSaveGame: () => void;
}

export const NexusHubScene: React.FC<NexusHubSceneProps> = ({
  player,
  completedPhases,
  unlockedRealms,
  onOpenMultiverseMap,
  onOpenCampaignMap,
  onOpenExploration,
  onOpenUpgrades,
  onOpenLoreArchives,
  onMenuClick,
  onSaveGame,
}) => {
  const [saveToast, setSaveToast] = useState(false);

  const handleManualSave = () => {
    audio.playClick();
    onSaveGame();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const completedCount = completedPhases.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 10) * 100));

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onMenuClick={onMenuClick} />

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto space-y-6 py-4">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950/80 border border-cyan-400/50 rounded-xl shadow-lg shadow-cyan-500/20">
              <Orbit className="w-7 h-7 text-cyan-300 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 uppercase">
                  ESTAÇÃO DE COMANDO QUANTICA
                </span>
                <span className="text-xs text-fuchsia-400 font-bold">PROTOCOLO RUPTURA 2.0</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 mt-1">
                HUB CENTRAL NEXUS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 hover:text-white flex items-center gap-2 text-xs transition shadow-md"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>SALVAR JOGO</span>
            </button>
            <button
              onClick={onMenuClick}
              className="px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>MENU</span>
            </button>
          </div>
        </div>

        {saveToast && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center justify-center gap-2 animate-bounce">
            <span>💾 PROGRESSO SINCRONIZADO E SALVO COM SUCESSO!</span>
          </div>
        )}

        {/* Global Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">CAMPANHA PRINCIPAL</span>
            <span className="text-base font-bold text-cyan-300">{completedCount} / 10 FASES</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">REALIDADES CONECTADAS</span>
            <span className="text-base font-bold text-fuchsia-300">{unlockedRealms.length} / 5 MUNDOS</span>
            <span className="text-[10px] text-slate-400 block mt-1">Portais Dimensional Ativos</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">STATUS DE KAEL</span>
            <span className="text-base font-bold text-emerald-300">NÍVEL {player.level} • {player.hp} HP</span>
            <span className="text-[10px] text-slate-400 block mt-1">ATK {player.atk} • DEF {player.def}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">MATRIZ DE RECURSOS</span>
            <span className="text-base font-bold text-amber-300">{player.credits} CR • {player.fragments} FRAG</span>
            <span className="text-[10px] text-cyan-400 block mt-1">{player.matrixCells ?? 0} Células de Matriz</span>
          </div>
        </div>

        {/* Nexus Navigation Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: Campanha 10 Fases */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenCampaignMap();
            }}
            className="group p-5 rounded-2xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-cyan-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-cyan-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-cyan-950 border border-cyan-500/40 rounded-lg text-cyan-400 group-hover:scale-110 transition">
                  <Map className="w-5 h-5" />
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  10 FASES ORIGINAIS
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                MAPA DA CAMPANHA
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Acesse a progressão clássica com todas as 10 fases encadeadas, desde o Primeiro Sinal até O Arquiteto.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold pt-3 border-t border-slate-800">
              <span>{completedCount}/10 Concluídas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 2: Mapa Multiversal e Portais */}
          <button
            onClick={() => {
              audio.playPortal();
              onOpenMultiverseMap();
            }}
            className="group p-5 rounded-2xl border border-fuchsia-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-fuchsia-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-fuchsia-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-fuchsia-950 border border-fuchsia-500/40 rounded-lg text-fuchsia-400 group-hover:scale-110 transition">
                  <Orbit className="w-5 h-5 animate-spin" />
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  RUPTURA 2.0
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-fuchsia-300 transition">
                PORTAIS DO MULTIVERSO
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Navegue entre as 5 Realidades dimensionais (Alpha, Beta, Gamma, Nexus Primordial e Espelho Quântico).
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-fuchsia-400 font-bold pt-3 border-t border-slate-800">
              <span>Navegar Mundos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 3: Exploração de Fenda */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenExploration();
            }}
            className="group p-5 rounded-2xl border border-emerald-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-emerald-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-emerald-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-emerald-950 border border-emerald-500/40 rounded-lg text-emerald-400 group-hover:scale-110 transition">
                  <Compass className="w-5 h-5" />
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RECONHECIMENTO
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                EXPLORAÇÃO & SEGREDOS
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Investigue pontos de anomalia, decodifique quebra-cabeças de frequência e recupere arcas de recursos.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold pt-3 border-t border-slate-800">
              <span>Iniciar Investigação</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 4: Laboratório de Aprimoramentos */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenUpgrades();
            }}
            className="group p-5 rounded-2xl border border-amber-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-amber-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-amber-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-amber-950 border border-amber-500/40 rounded-lg text-amber-400 group-hover:scale-110 transition">
                  <Cpu className="w-5 h-5" />
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PROGRESSÃO
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                UPGRADES DE KAEL
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Aprimore o Nanotraje (HP), Condensador de Plasma (ATK), Escudo Reativo (DEF) e Geradores de Foco.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold pt-3 border-t border-slate-800">
              <span>Melhorar Atributos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 5: Arquivo de Registros e Lore */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenLoreArchives();
            }}
            className="group p-5 rounded-2xl border border-blue-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-blue-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-blue-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-blue-950 border border-blue-500/40 rounded-lg text-blue-400 group-hover:scale-110 transition">
                  <Database className="w-5 h-5" />
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  DADOS CLASSIFICADOS
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                ARQUIVOS DE LORE
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Consulte relatórios científicos de Nova Arcádia, registros de campo de Kael e segredos da Grande Convergência.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-blue-400 font-bold pt-3 border-t border-slate-800">
              <span>Acessar Arquivos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 6: Guia de Sistemas 2.0 */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between min-h-[170px]">
            <div>
              <span className="text-[10px] text-cyan-400 tracking-widest uppercase block mb-1">
                MANUAL TÁTICO RUPTURA 2.0
              </span>
              <h3 className="text-sm font-bold text-white">RECURSOS DE COMBATE</h3>
              <ul className="text-[11px] text-slate-400 mt-2 space-y-1 list-disc list-inside">
                <li><strong className="text-cyan-300">Ataque Rápido:</strong> Constrói Foco e incrementa o multiplicador de Combo.</li>
                <li><strong className="text-amber-300">Ataque Pesado:</strong> Consome 25 Foco e quebra a postura do inimigo.</li>
                <li><strong className="text-indigo-300">Esquiva:</strong> Anula golpes telegrafados e desfere contra-ataque imediato.</li>
                <li><strong className="text-fuchsia-300">Chefes:</strong> Possuem múltiplas fases e padrões dinâmicos.</li>
              </ul>
            </div>
            <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              Sincronização com armazenamento local ativa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
