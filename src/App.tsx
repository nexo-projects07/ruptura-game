import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, Crosshair, MapPin, Orbit } from 'lucide-react';
import { CinematicPrologueScene } from './scenes/CinematicPrologueScene';
import { CampaignMapScene, CAMPAIGN_PHASES, CampaignPhase } from './scenes/CampaignMapScene';
import { CombatScene } from './scenes/CombatScene';
import { VictoryScene } from './scenes/VictoryScene';
import { DefeatScene } from './scenes/DefeatScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { NexusHubScene } from './scenes/NexusHubScene';
import { MultiverseMapScene, MULTIVERSE_REALMS } from './scenes/MultiverseMapScene';
import { ExplorationScene } from './scenes/ExplorationScene';
import { UpgradesScene } from './scenes/UpgradesScene';
import { LoreArchivesScene } from './scenes/LoreArchivesScene';
import { PlayerState, EnemyState, RealmData } from './types/game';
import { audio } from './systems/AudioEngine';
import { SaveEngine } from './systems/SaveEngine';

const INITIAL_PLAYER: PlayerState = {
  name: 'KAEL',
  role: 'Explorador Dimensional',
  level: 1,
  hp: 100,
  maxHp: 100,
  atk: 20,
  def: 10,
  exp: 0,
  maxExp: 300,
  credits: 50,
  fragments: 1,
  focus: 30,
  maxFocus: 100,
  matrixCells: 0,
  aetherCores: 0,
  upgradeLevels: { hp_suit: 0, plasma_blade: 0, kinetic_shield: 0, focus_cell: 0 },
  discoveredSecrets: [],
  unlockedRealms: ['realm-alpha'],
};

type Scene =
  | 'MENU'
  | 'PROLOGUE'
  | 'MAP'
  | 'BRIEFING'
  | 'COMBAT'
  | 'VICTORY'
  | 'DEFEAT'
  | 'NEXUS'
  | 'MULTIVERSE_MAP'
  | 'EXPLORATION'
  | 'UPGRADES'
  | 'LORE_ARCHIVES';

const initialEnemy = (phase: CampaignPhase): EnemyState => ({
  name: phase.enemy.toUpperCase(),
  hp: phase.hp,
  maxHp: phase.hp,
  atk: phase.atk,
  def: phase.def,
  boss: phase.boss ?? false,
  phase: 1,
  maxPhases: phase.enemy.includes('Arquiteto') ? 3 : phase.boss ? 2 : 1,
});

export default function App() {
  const [scene, setScene] = useState<Scene>('MENU');
  const [player, setPlayer] = useState<PlayerState>(INITIAL_PLAYER);
  const [unlockedPhases, setUnlockedPhases] = useState<string[]>(['fase-01']);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [unlockedRealms, setUnlockedRealms] = useState<string[]>(['realm-alpha']);
  const [phase, setPhase] = useState<CampaignPhase>(CAMPAIGN_PHASES[0]);
  const [enemy, setEnemy] = useState<EnemyState>(initialEnemy(CAMPAIGN_PHASES[0]));
  const [lastPhaseId, setLastPhaseId] = useState('fase-01');

  // Load save on mount with transparent v1 migration
  useEffect(() => {
    const saved = SaveEngine.getSave();
    if (!saved) return;
    try {
      if (saved.player) {
        setPlayer(prev => ({
          ...prev,
          ...saved.player,
          focus: saved.player.focus ?? prev.focus ?? 30,
          matrixCells: saved.player.matrixCells ?? prev.matrixCells ?? 0,
          aetherCores: saved.player.aetherCores ?? prev.aetherCores ?? 0,
          upgradeLevels: saved.player.upgradeLevels ?? prev.upgradeLevels,
        }));
      }
      if (Array.isArray(saved.unlockedPhases) && saved.unlockedPhases.length > 0) {
        setUnlockedPhases(saved.unlockedPhases);
      }
      if (Array.isArray(saved.completedPhases)) {
        setCompletedPhases(saved.completedPhases);
      }
      if (Array.isArray(saved.unlockedRealms) && saved.unlockedRealms.length > 0) {
        setUnlockedRealms(saved.unlockedRealms);
      }
      if (saved.lastPhaseId) {
        setLastPhaseId(saved.lastPhaseId);
        const found = CAMPAIGN_PHASES.find(p => p.id === saved.lastPhaseId);
        if (found) setPhase(found);
      }
    } catch {
      SaveEngine.clearSave();
    }
  }, []);

  // Sync auto-save whenever core progression updates
  useEffect(() => {
    SaveEngine.save(player, 'CAMPAIGN_MAP', unlockedPhases, completedPhases, {
      lastPhaseId,
      unlockedRealms,
    });
  }, [player, unlockedPhases, completedPhases, lastPhaseId, unlockedRealms]);

  // Start New Game (Classic flow with prologue)
  const newGame = () => {
    const p = { ...INITIAL_PLAYER };
    setPlayer(p);
    setUnlockedPhases(['fase-01']);
    setCompletedPhases([]);
    setUnlockedRealms(['realm-alpha']);
    setPhase(CAMPAIGN_PHASES[0]);
    setLastPhaseId('fase-01');
    setEnemy(initialEnemy(CAMPAIGN_PHASES[0]));
    setScene('PROLOGUE');
    audio.playClick();
  };

  // Continue Game
  const continueGame = () => {
    audio.playClick();
    setScene('MAP');
  };

  // Select Phase from Campaign Map
  const choosePhase = (selected: CampaignPhase) => {
    if (!unlockedPhases.includes(selected.id)) return;
    setPhase(selected);
    setLastPhaseId(selected.id);
    setScene('BRIEFING');
    audio.playClick();
  };

  // Jump from Multiverse Map to specific Campaign Phase
  const handleGoToCampaignPhase = (phaseId: string) => {
    const found = CAMPAIGN_PHASES.find(p => p.id === phaseId);
    if (found) {
      setPhase(found);
      setLastPhaseId(found.id);
      setScene('BRIEFING');
      audio.playClick();
    }
  };

  // Special 2.0 Realm challenge combat
  const handleGoToSpecialRealmCombat = (realm: RealmData) => {
    audio.playPortal();
    let challengeEnemy: EnemyState;

    if (realm.id === 'realm-epsilon') {
      challengeEnemy = {
        name: 'GUARDIÃO DO NEXUS PRIMORDIAL',
        hp: 320,
        maxHp: 320,
        atk: 32,
        def: 18,
        boss: true,
        phase: 1,
        maxPhases: 2,
      };
    } else {
      // Omega realm
      challengeEnemy = {
        name: 'ECO DO ARQUITETO (ESPELHO QUÂNTICO)',
        hp: 400,
        maxHp: 400,
        atk: 38,
        def: 22,
        boss: true,
        phase: 1,
        maxPhases: 3,
      };
    }

    setEnemy(challengeEnemy);
    setPlayer(p => ({ ...p, hp: p.maxHp }));
    setScene('COMBAT');
  };

  // Start Combat
  const startCombat = () => {
    setEnemy(initialEnemy(phase));
    setPlayer(p => ({ ...p, hp: p.maxHp }));
    setScene('COMBAT');
    audio.playClick();
  };

  // Handle Victory
  const handleVictory = () => {
    audio.playVictory();

    // Exp, credits, fragments and Matrix Cells calculation
    setPlayer(p => {
      let exp = p.exp + 120;
      let level = p.level;
      let maxExp = p.maxExp;
      let atk = p.atk;
      let maxHp = p.maxHp;

      if (exp >= maxExp) {
        exp -= maxExp;
        level += 1;
        maxExp = Math.floor(maxExp * 1.35);
        atk += 3;
        maxHp += 10;
      }

      return {
        ...p,
        exp,
        level,
        maxExp,
        atk,
        maxHp,
        hp: maxHp,
        credits: p.credits + 50,
        fragments: p.fragments + 1,
        matrixCells: (p.matrixCells ?? 0) + 1,
      };
    });

    // Mark completed
    setCompletedPhases(prev => (prev.includes(phase.id) ? prev : [...prev, phase.id]));

    // Unlock next phase in sequence
    const idx = CAMPAIGN_PHASES.findIndex(p => p.id === phase.id);
    if (idx >= 0 && idx < CAMPAIGN_PHASES.length - 1) {
      const nextId = CAMPAIGN_PHASES[idx + 1].id;
      setUnlockedPhases(prev => (prev.includes(nextId) ? prev : [...prev, nextId]));
    }

    // Unlock Realms based on milestone phases
    if (phase.id === 'fase-05' && !unlockedRealms.includes('realm-beta')) {
      setUnlockedRealms(prev => [...prev, 'realm-beta']);
    }
    if (phase.id === 'fase-08' && !unlockedRealms.includes('realm-gamma')) {
      setUnlockedRealms(prev => [...prev, 'realm-gamma']);
    }
    if (phase.id === 'fase-07' && !unlockedRealms.includes('realm-epsilon')) {
      setUnlockedRealms(prev => [...prev, 'realm-epsilon']);
    }
    if (phase.id === 'fase-10' && !unlockedRealms.includes('realm-omega')) {
      setUnlockedRealms(prev => [...prev, 'realm-omega']);
    }

    setScene('VICTORY');
  };

  // Retry combat
  const retry = () => {
    setPlayer(p => ({ ...p, hp: p.maxHp }));
    setEnemy(initialEnemy(phase));
    setScene('COMBAT');
  };

  // Debug unlock all 10 phases for test validation
  const handleUnlockAllDebug = () => {
    const allIds = CAMPAIGN_PHASES.map(p => p.id);
    setUnlockedPhases(allIds);
    setUnlockedRealms(['realm-alpha', 'realm-beta', 'realm-gamma', 'realm-epsilon', 'realm-omega']);
    audio.playClick();
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-50 overflow-hidden flex flex-col select-none">
      {/* 1. MAIN MENU */}
      {scene === 'MENU' && (
        <MainMenuScene
          onStartNewGame={newGame}
          onContinueGame={continueGame}
          onOpenNexus={() => setScene('NEXUS')}
        />
      )}

      {/* 2. CINEMATIC PROLOGUE */}
      {scene === 'PROLOGUE' && (
        <CinematicPrologueScene onComplete={() => setScene('MAP')} />
      )}

      {/* 3. CAMPAIGN MAP (10 PHASES) */}
      {scene === 'MAP' && (
        <CampaignMapScene
          player={player}
          unlockedPhases={unlockedPhases}
          completedPhases={completedPhases}
          onSelectPhase={choosePhase}
          onMenuClick={() => setScene('MENU')}
          onNexusClick={() => setScene('NEXUS')}
          onUnlockAllDebug={handleUnlockAllDebug}
        />
      )}

      {/* 4. PHASE BRIEFING */}
      {scene === 'BRIEFING' && (
        <div className="relative flex-1 flex items-center justify-center p-4 overflow-auto font-mono">
          <div className="absolute inset-0 opacity-70">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950 via-slate-950 to-black" />
          </div>
          <div className="relative z-10 max-w-xl w-full border border-cyan-500/40 bg-slate-900/95 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setScene('MAP')}
                className="text-xs text-slate-400 flex items-center gap-1.5 hover:text-white transition"
              >
                <ArrowLeft size={15} /> VOLTAR AO MAPA
              </button>
              <button
                onClick={() => setScene('NEXUS')}
                className="text-xs text-cyan-400 flex items-center gap-1.5 hover:text-cyan-200 transition"
              >
                <Orbit size={15} /> NEXUS
              </button>
            </div>

            <div className="flex items-center gap-2 text-cyan-300">
              <MapPin size={17} />
              <span className="text-xs tracking-[.25em]">{phase.location.toUpperCase()}</span>
            </div>

            <div>
              <p className="text-[10px] text-cyan-500 tracking-[.3em]">
                MISSÃO {phase.id.replace('fase-', '').toUpperCase()}
              </p>
              <h1 className="text-2xl md:text-3xl font-black mt-1 text-white">{phase.title}</h1>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">{phase.summary}</p>

            <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <AlertTriangle size={17} /> AMEAÇA DETECTADA
              </div>
              <p className="mt-2 text-sm font-bold text-white">{phase.enemy}</p>
              <p className="text-xs text-slate-400 mt-1">
                HP {phase.hp} • ATK {phase.atk} • DEF {phase.def}
                {phase.boss ? ' • [ENTIDADE CHEFE]' : ''}
              </p>
            </div>

            <button
              onClick={startCombat}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-bold tracking-widest uppercase flex items-center justify-center gap-2 text-white shadow-lg shadow-cyan-600/30 transition text-sm"
            >
              <Crosshair size={18} /> INICIAR COMBATE RUPTURA 2.0
            </button>
          </div>
        </div>
      )}

      {/* 5. DYNAMIC COMBAT 2.0 */}
      {scene === 'COMBAT' && (
        <CombatScene
          player={player}
          setPlayer={setPlayer}
          enemy={enemy}
          setEnemy={setEnemy}
          onVictory={handleVictory}
          onDefeat={() => setScene('DEFEAT')}
          onNexusClick={() => setScene('NEXUS')}
        />
      )}

      {/* 6. VICTORY */}
      {scene === 'VICTORY' && (
        <VictoryScene
          phaseTitle={phase.title}
          enemyName={enemy.name}
          onContinue={() => setScene('MAP')}
          onGoToNexus={() => setScene('NEXUS')}
        />
      )}

      {/* 7. DEFEAT */}
      {scene === 'DEFEAT' && (
        <DefeatScene
          onRetry={retry}
          onReturnToMap={() => setScene('MAP')}
          onGoToNexus={() => setScene('NEXUS')}
        />
      )}

      {/* 8. NEXUS HUB 2.0 */}
      {scene === 'NEXUS' && (
        <NexusHubScene
          player={player}
          completedPhases={completedPhases}
          unlockedRealms={unlockedRealms}
          onOpenMultiverseMap={() => setScene('MULTIVERSE_MAP')}
          onOpenCampaignMap={() => setScene('MAP')}
          onOpenExploration={() => setScene('EXPLORATION')}
          onOpenUpgrades={() => setScene('UPGRADES')}
          onOpenLoreArchives={() => setScene('LORE_ARCHIVES')}
          onMenuClick={() => setScene('MENU')}
          onSaveGame={() =>
            SaveEngine.save(player, 'NEXUS_HUB', unlockedPhases, completedPhases, {
              lastPhaseId,
              unlockedRealms,
            })
          }
        />
      )}

      {/* 9. MULTIVERSE MAP & PORTALS */}
      {scene === 'MULTIVERSE_MAP' && (
        <MultiverseMapScene
          player={player}
          completedPhases={completedPhases}
          unlockedRealms={unlockedRealms}
          onSelectRealm={() => {}}
          onGoToCampaignPhase={handleGoToCampaignPhase}
          onGoToSpecialRealmCombat={handleGoToSpecialRealmCombat}
          onBackToNexus={() => setScene('NEXUS')}
        />
      )}

      {/* 10. EXPLORATION & SECRETS */}
      {scene === 'EXPLORATION' && (
        <ExplorationScene
          player={player}
          setPlayer={setPlayer}
          onBackToNexus={() => setScene('NEXUS')}
        />
      )}

      {/* 11. UPGRADES LAB */}
      {scene === 'UPGRADES' && (
        <UpgradesScene
          player={player}
          setPlayer={setPlayer}
          onBackToNexus={() => setScene('NEXUS')}
        />
      )}

      {/* 12. LORE ARCHIVES */}
      {scene === 'LORE_ARCHIVES' && (
        <LoreArchivesScene player={player} onBackToNexus={() => setScene('NEXUS')} />
      )}
    </div>
  );
}
