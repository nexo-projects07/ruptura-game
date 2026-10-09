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
  Coins,
  Sword,
  BookOpen,
  Skull,
  Download,
  Upload,
  Users,
  Wifi
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';
import { SaveEngine } from '../systems/SaveEngine';

interface NexusHubSceneProps {
  player: PlayerState;
  completedPhases: string[];
  unlockedRealms: string[];
  onOpenMultiverseMap: () => void;
  onOpenCampaignMap: () => void;
  onOpenExploration: () => void;
  onOpenUpgrades: () => void;
  onOpenLoreArchives: () => void;
  onOpenInventory: () => void;
  onOpenSkillTree: () => void;
  onOpenQuestLog: () => void;
  onOpenSecretBosses: () => void;
  onOpenRiftCoop: () => void;
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
  onOpenInventory,
  onOpenSkillTree,
  onOpenQuestLog,
  onOpenSecretBosses,
  onOpenRiftCoop,
  onMenuClick,
  onSaveGame,
}) => {
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');

  React.useEffect(() => {
    audio.playBGM('NEXUS');
    return () => {
      audio.stopBGM();
    };
  }, []);

  const handleManualSave = () => {
    audio.playClick();
    onSaveGame();
    setSaveToast('💾 PROGRESSO SINCRONIZADO E SALVO COM SUCESSO!');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleExport = () => {
    audio.playSecretFound();
    const saveStr = SaveEngine.exportSaveString();
    if (!saveStr) {
      setSaveToast('❌ Nenhum dado de salvamento para exportar.');
      setTimeout(() => setSaveToast(null), 2500);
      return;
    }

    const blob = new Blob([saveStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruptura_5.0_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setSaveToast('📥 Arquivo JSON de salvamento baixado com sucesso!');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const res = SaveEngine.importSaveString(importText);
    if (res.success) {
      audio.playUpgrade();
      setSaveToast('✅ Save importado com sucesso! Recarregando dados...');
      setImportModalOpen(false);
      setTimeout(() => window.location.reload(), 1200);
    } else {
      audio.playDenied();
      setSaveToast(`❌ Erro na importação: ${res.error}`);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const completedCount = completedPhases.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 10) * 100));

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD
        player={player}
        onMenuClick={onMenuClick}
        onInventoryClick={onOpenInventory}
        onSkillTreeClick={onOpenSkillTree}
        onQuestLogClick={onOpenQuestLog}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-cyan-500/30 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-3 bg-cyan-950/80 border border-cyan-400/50 rounded-xl shadow-lg shadow-cyan-500/20">
              <Orbit className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-300 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono">
                <span className="text-cyan-300 font-bold uppercase tracking-wider">ESTAÇÃO DE COMANDO</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-fuchsia-400 font-bold">RUPTURA</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-fuchsia-400 mt-0.5 sm:mt-1">
                HUB CENTRAL NEXUS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={handleManualSave}
              className="min-h-[38px] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-300 active:scale-95 text-cyan-300 hover:text-white flex items-center gap-1.5 text-xs transition shadow-md touch-manipulation cursor-pointer"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>SALVAR</span>
            </button>
            <button
              onClick={handleExport}
              className="min-h-[38px] px-3 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-400 active:scale-95 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs transition touch-manipulation cursor-pointer"
              title="Exportar Save como arquivo JSON"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">EXPORTAR</span>
            </button>
            <button
              onClick={() => setImportModalOpen(true)}
              className="min-h-[38px] px-3 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 active:scale-95 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs transition touch-manipulation cursor-pointer"
              title="Importar Save a partir de JSON"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">IMPORTAR</span>
            </button>
            <button
              onClick={() => {
                audio.playClick();
                onMenuClick();
              }}
              className="min-h-[38px] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 active:scale-95 text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 text-xs transition touch-manipulation cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>MENU</span>
            </button>
          </div>
        </div>

        {saveToast && (
          <div className="p-3 bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs rounded-xl flex items-center justify-center gap-2 animate-bounce">
            <span>{saveToast}</span>
          </div>
        )}

        {/* Global Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">CAMPANHA PRINCIPAL</span>
            <span className="text-base font-bold text-cyan-300">{completedCount} / 10 FASES</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">REALIDADES SINCRONIZADAS</span>
            <span className="text-base font-bold text-fuchsia-300">{unlockedRealms.length} / 5 MUNDOS</span>
            <span className="text-[10px] text-slate-400 block mt-1">Portais Dimensional Ativos</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">STATUS DE COMBATE</span>
            <span className="text-base font-bold text-emerald-300">NV {player.level} • {player.hp} HP</span>
            <span className="text-[10px] text-slate-400 block mt-1">ATK {player.atk} • DEF {player.def}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">RECURSOS DE FENDA</span>
            <span className="text-base font-bold text-amber-300">{player.credits} CR • {player.fragments} FRAG</span>
            <span className="text-[10px] text-cyan-400 block mt-1">{player.matrixCells ?? 0} Células • {player.talentPoints ?? 0} Talento(s)</span>
          </div>
        </div>

        {/* Nexus Navigation Modules Grid (9 Modules) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: Inventário e Equipamentos (RUPTURA 3.0) */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenInventory();
            }}
            className="group p-5 rounded-2xl border border-cyan-500/50 bg-slate-900/90 hover:bg-slate-850 hover:border-cyan-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-cyan-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-cyan-950 border border-cyan-500/40 rounded-xl text-cyan-400 group-hover:scale-110 transition">
                  <Sword className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  4 SLOTS ATIVOS
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                INVENTÁRIO & EQUIPAMENTOS
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Equipe armas, armaduras, núcleos e acessórios. Compare atributos em tempo real.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold pt-3 border-t border-slate-800">
              <span>Gerenciar Carga ({player.inventory?.length ?? 0} itens)</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 2: Árvore de Talentos (RUPTURA 3.0) */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenSkillTree();
            }}
            className="group p-5 rounded-2xl border border-fuchsia-500/50 bg-slate-900/90 hover:bg-slate-850 hover:border-fuchsia-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-fuchsia-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-fuchsia-950 border border-fuchsia-500/40 rounded-xl text-fuchsia-400 group-hover:scale-110 transition">
                  <Zap className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">
                  4 ESPECIALIZAÇÕES
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-fuchsia-300 transition">
                ÁRVORE DE TALENTOS
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Especialize Kael em Assalto Quântico, Guardião de Matriz, Manipulação Temporal ou Convergência.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-fuchsia-400 font-bold pt-3 border-t border-slate-800">
              <span>{player.talentPoints ?? 0} Pontos Disponíveis</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 3: Diário de Missões (RUPTURA 3.0) */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenQuestLog();
            }}
            className="group p-5 rounded-2xl border border-emerald-500/50 bg-slate-900/90 hover:bg-slate-850 hover:border-emerald-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-emerald-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400 group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  OBJETIVOS ATIVOS
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                DIÁRIO DE MISSÕES
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Acompanhe missões secundárias, resgate recompensas de itens e expanda a reputação no Nexus.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold pt-3 border-t border-slate-800">
              <span>{player.completedQuests?.length ?? 0} Missões Concluídas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 4: Chefes Secretos da Fenda (RUPTURA 3.0) */}
          <button
            onClick={() => {
              audio.playBossPhase();
              onOpenSecretBosses();
            }}
            className="group p-5 rounded-2xl border border-rose-500/50 bg-slate-900/90 hover:bg-slate-850 hover:border-rose-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-rose-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-rose-950 border border-rose-500/40 rounded-xl text-rose-400 group-hover:scale-110 transition">
                  <Skull className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                  3 ENTIDADES
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-rose-300 transition">
                CHEFES SECRETOS
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Desafie O Cartógrafo do Vazio, A Sentinela de Épsilon e O Eco Primordial por espólios lendários.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-rose-400 font-bold pt-3 border-t border-slate-800">
              <span>Confrontos Especiais</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module: Local Rift Raids */}
          <button
            onClick={() => {
              audio.playPortal();
              onOpenRiftCoop();
            }}
            className="group p-5 rounded-2xl border border-cyan-400/60 bg-gradient-to-b from-cyan-950/40 to-slate-900/95 hover:bg-slate-850 hover:border-cyan-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-xl shadow-cyan-950/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-cyan-950 border border-cyan-400/50 rounded-xl text-cyan-300 group-hover:scale-110 transition">
                  <Users className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1 uppercase tracking-wider">
                  INCURSÕES LOCAIS
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                INCURSÕES DA FENDA
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Combates com Kael e companheiros controlados pelo jogo. Salas online ainda não estão configuradas.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-cyan-300 font-bold pt-3 border-t border-slate-800">
              <span>{player.coopRaidsCompleted ?? 0} Incursões Concluídas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 5: Campanha 10 Fases */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenCampaignMap();
            }}
            className="group p-5 rounded-2xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-cyan-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-cyan-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-cyan-950 border border-cyan-500/40 rounded-xl text-cyan-400 group-hover:scale-110 transition">
                  <Map className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  10 FASES ORIGINAIS
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                MAPA DA CAMPANHA
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Acesse a progressão clássica completa: do Primeiro Sinal até o confronto final com O Arquiteto.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold pt-3 border-t border-slate-800">
              <span>{completedCount}/10 Fases Concluídas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 6: Portais do Multiverso */}
          <button
            onClick={() => {
              audio.playPortal();
              onOpenMultiverseMap();
            }}
            className="group p-5 rounded-2xl border border-fuchsia-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-fuchsia-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-fuchsia-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-fuchsia-950 border border-fuchsia-500/40 rounded-xl text-fuchsia-400 group-hover:scale-110 transition">
                  <Orbit className="w-5 h-5 animate-spin" />
                </span>
                <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">
                  5 REALIDADES
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-fuchsia-300 transition">
                PORTAIS DO MULTIVERSO
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Navegue pelas 5 Realidades dimensionais (Alpha, Beta, Gamma, Nexus Primordial e Espelho Quântico).
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-fuchsia-400 font-bold pt-3 border-t border-slate-800">
              <span>Navegar Realidades</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 7: Exploração & Segredos */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenExploration();
            }}
            className="group p-5 rounded-2xl border border-emerald-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-emerald-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-emerald-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400 group-hover:scale-110 transition">
                  <Compass className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  RECONHECIMENTO
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                EXPLORAÇÃO & SEGREDOS
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Investigue anomalias, calibre frequências de decodificação e recupere arcas de tecnologia.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold pt-3 border-t border-slate-800">
              <span>{player.discoveredSecrets?.length ?? 0} Segredos Descobertos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 8: Upgrades de Atributos */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenUpgrades();
            }}
            className="group p-5 rounded-2xl border border-amber-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-amber-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-amber-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-amber-950 border border-amber-500/40 rounded-xl text-amber-400 group-hover:scale-110 transition">
                  <Cpu className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  LABORATÓRIO
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                UPGRADES DE ATRIBUTOS
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Melhorias permanentes de Nanotraje (+HP), Lâmina (+ATK), Defletor (+DEF) e Baterias de Foco.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold pt-3 border-t border-slate-800">
              <span>Aprimorar Traje</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Module 9: Arquivos de Lore */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenLoreArchives();
            }}
            className="group p-5 rounded-2xl border border-blue-500/40 bg-slate-900/90 hover:bg-slate-850 hover:border-blue-300 transition text-left flex flex-col justify-between min-h-[170px] shadow-lg shadow-blue-950/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2.5 bg-blue-950 border border-blue-500/40 rounded-xl text-blue-400 group-hover:scale-110 transition">
                  <Database className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  ARQUIVOS SECRETOS
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                ARQUIVOS DE LORE
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Relatórios científicos de Nova Arcádia, biologia dos Rasgadores e segredos da Grande Convergência.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-blue-400 font-bold pt-3 border-t border-slate-800">
              <span>Consultar Dados</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>
      </div>

      {/* Import Save Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-cyan-500/50 p-6 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              <span>IMPORTAR ARQUIVO DE SALVAMENTO</span>
            </h3>
            <p className="text-xs text-slate-400">
              Cole o conteúdo JSON do seu arquivo de save abaixo para restaurar o progresso:
            </p>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder='Cole o JSON aqui (ex: { "player": { ... } })'
              rows={6}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase"
              >
                Restaurar Progresso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
