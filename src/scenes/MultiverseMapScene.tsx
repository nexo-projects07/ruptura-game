import React, { useState } from 'react';
import {
  Orbit,
  ArrowLeft,
  Lock,
  Play,
  Sparkles,
  AlertTriangle,
  Compass,
  Radio,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState, RealmData } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface MultiverseMapSceneProps {
  player: PlayerState;
  completedPhases: string[];
  unlockedRealms: string[];
  onSelectRealm: (realm: RealmData) => void;
  onGoToCampaignPhase: (phaseId: string) => void;
  onGoToSpecialRealmCombat: (realm: RealmData) => void;
  onBackToNexus: () => void;
}

export const MULTIVERSE_REALMS: RealmData[] = [
  {
    id: 'realm-alpha',
    name: 'Realidade Alpha: Nova Arcádia',
    code: 'REALM-ALPHA',
    description: 'A metrópole tecnológica onde a Grande Convergência começou. Estruturas espelhadas colidindo com matéria estranha.',
    threatLevel: 'MODERADA',
    isUnlocked: true,
    icon: 'city',
    phases: ['fase-01', 'fase-02', 'fase-03', 'fase-04', 'fase-05'],
    ambientColor: 'cyan',
  },
  {
    id: 'realm-beta',
    name: 'Realidade Beta: Fenda Industrial',
    code: 'REALM-BETA',
    description: 'Complexos industriais e antigas linhas de trânsito magnético tomadas por aberrações cibernéticas e autômatos corrompidos.',
    threatLevel: 'ALTA',
    isUnlocked: false,
    icon: 'factory',
    phases: ['fase-06', 'fase-07', 'fase-08'],
    ambientColor: 'amber',
  },
  {
    id: 'realm-gamma',
    name: 'Realidade Gamma: O Marco Zero',
    code: 'REALM-GAMMA',
    description: 'O epicentro absoluto onde o espaço e o tempo colapsaram. Aqui repousam o Avatar da Ruptura e a inteligência do Arquiteto.',
    threatLevel: 'CRÍTICA',
    isUnlocked: false,
    icon: 'portal',
    phases: ['fase-09', 'fase-10'],
    ambientColor: 'fuchsia',
  },
  {
    id: 'realm-epsilon',
    name: 'Realidade Épsilon: Nexus Primordial',
    code: 'REALM-EPSILON',
    description: 'Dimensão pós-singularidade descoberta em RUPTURA 2.0. Rica em Células de Matriz e Núcleos de Éter, protegida por Guardiões Cósmicos.',
    threatLevel: 'EXTREMA',
    isUnlocked: false,
    icon: 'crystal',
    phases: ['exp-epsilon-01'],
    ambientColor: 'emerald',
  },
  {
    id: 'realm-omega',
    name: 'Realidade Ômega: Espelho Quântico',
    code: 'REALM-OMEGA',
    description: 'O labirinto de realidades recursivas. Desafio de sobrevivência dimensional contra ecos aperfeiçoados de todos os chefes.',
    threatLevel: 'APOCALÍPTICA',
    isUnlocked: false,
    icon: 'mirror',
    phases: ['exp-omega-boss'],
    ambientColor: 'rose',
  },
];

export const MultiverseMapScene: React.FC<MultiverseMapSceneProps> = ({
  player,
  completedPhases,
  unlockedRealms,
  onGoToCampaignPhase,
  onGoToSpecialRealmCombat,
  onBackToNexus,
}) => {
  const [selectedRealm, setSelectedRealm] = useState<RealmData>(MULTIVERSE_REALMS[0]);

  // Dynamic unlock rules
  const isBetaUnlocked = completedPhases.includes('fase-05') || unlockedRealms.includes('realm-beta');
  const isGammaUnlocked = completedPhases.includes('fase-08') || unlockedRealms.includes('realm-gamma');
  const isEpsilonUnlocked = completedPhases.includes('fase-07') || player.level >= 3 || unlockedRealms.includes('realm-epsilon');
  const isOmegaUnlocked = completedPhases.includes('fase-10') || unlockedRealms.includes('realm-omega');

  const checkUnlocked = (realmId: string) => {
    if (realmId === 'realm-alpha') return true;
    if (realmId === 'realm-beta') return isBetaUnlocked;
    if (realmId === 'realm-gamma') return isGammaUnlocked;
    if (realmId === 'realm-epsilon') return isEpsilonUnlocked;
    if (realmId === 'realm-omega') return isOmegaUnlocked;
    return false;
  };

  const handleSelect = (realm: RealmData) => {
    audio.playClick();
    setSelectedRealm(realm);
  };

  const handleEngage = (realm: RealmData) => {
    audio.playPortal();
    if (realm.id === 'realm-alpha') {
      onGoToCampaignPhase('fase-01');
    } else if (realm.id === 'realm-beta') {
      onGoToCampaignPhase('fase-06');
    } else if (realm.id === 'realm-gamma') {
      onGoToCampaignPhase('fase-09');
    } else {
      // Special 2.0 Realm combat
      onGoToSpecialRealmCombat(realm);
    }
  };

  const isCurrentUnlocked = checkUnlocked(selectedRealm.id);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto space-y-6 py-4">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <button
            onClick={onBackToNexus}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center gap-2 text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR AO NEXUS</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-fuchsia-300">
            <Orbit className="w-4 h-4 animate-spin text-fuchsia-400" />
            <span className="tracking-widest">MAPA INTERATIVO DE MULTIVERSOS</span>
          </div>
        </div>

        {/* Realities Selector Tabs / Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MULTIVERSE_REALMS.map((realm, idx) => {
            const unlocked = checkUnlocked(realm.id);
            const isSelected = selectedRealm.id === realm.id;

            return (
              <button
                key={realm.id}
                onClick={() => handleSelect(realm)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between min-h-[110px] relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/70 shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400'
                    : unlocked
                    ? 'border-slate-800 bg-slate-900/80 hover:border-slate-600 hover:bg-slate-850'
                    : 'border-slate-900 bg-slate-950/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] tracking-wider text-cyan-400">
                    SETOR 0{idx + 1}
                  </span>
                  {unlocked ? (
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <h3 className="font-bold text-xs text-white mt-1 leading-snug">
                  {realm.name.split(':')[1]?.trim() || realm.name}
                </h3>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded w-fit mt-2 ${
                    realm.threatLevel === 'MODERADA'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : realm.threatLevel === 'ALTA'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : realm.threatLevel === 'CRÍTICA'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}
                >
                  {realm.threatLevel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Reality Holographic Card */}
        <div className="bg-slate-900/90 border border-cyan-500/40 p-6 md:p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/40 font-bold uppercase">
                  {selectedRealm.code}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                    isCurrentUnlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isCurrentUnlocked ? 'PORTAL SINCRONIZADO' : 'PORTAL BLOQUEADO'}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                {selectedRealm.name}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {selectedRealm.description}
              </p>

              {/* Requirement pill */}
              {!isCurrentUnlocked && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    REQUISITO: Conclua as fases anteriores da campanha ou alcance nível suficiente para romper o bloqueio dimensional.
                  </span>
                </div>
              )}

              {/* Included Campaign phases */}
              {selectedRealm.phases.length > 0 && selectedRealm.phases[0].startsWith('fase-') && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">
                    FASES CONECTADAS NESTE MUNDO:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedRealm.phases.map(pId => {
                      const isDone = completedPhases.includes(pId);
                      return (
                        <button
                          key={pId}
                          onClick={() => onGoToCampaignPhase(pId)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition font-mono flex items-center gap-1.5 ${
                            isDone
                              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                              : 'bg-slate-950 border-cyan-500/30 text-cyan-300 hover:border-cyan-300'
                          }`}
                        >
                          <Play className="w-3 h-3" />
                          <span>{pId.toUpperCase()}</span>
                          {isDone && <span className="text-[9px] text-emerald-400 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Action Column */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/70 border border-slate-800 rounded-2xl text-center space-y-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center animate-spin">
                <Orbit className="w-10 h-10 text-cyan-400" />
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-300 block">ESTRUTURA DE FENDA</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Nível de Ameaça: <strong className="text-white">{selectedRealm.threatLevel}</strong>
                </span>
              </div>

              <button
                disabled={!isCurrentUnlocked}
                onClick={() => handleEngage(selectedRealm)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 text-xs md:text-sm shadow-xl ${
                  isCurrentUnlocked
                    ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:opacity-90 text-white shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                {isCurrentUnlocked ? (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>ATRAVESSAR PORTAL</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>PORTAL BLOQUEADO</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
