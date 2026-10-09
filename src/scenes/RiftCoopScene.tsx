import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Shield,
  Zap,
  Radio,
  ArrowLeft,
  Crosshair,
  Flame,
  Activity,
  Sparkles,
  AlertTriangle,
  Award,
  RefreshCw,
  MessageSquare,
  Copy,
  Check,
  ChevronRight,
  Wifi,
  Skull
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState, CoopSquadMember, RiftRaidMission, CompanionRole } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface RiftCoopSceneProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onBackToNexus: () => void;
}

const RAID_MISSIONS: RiftRaidMission[] = [
  {
    id: 'raid-01',
    title: 'Assalto ao Leviatã de Matriz',
    threatRank: 'ALTA',
    bossName: 'LEVIATÃ DA MATRIZ ABISSAL',
    bossHp: 850,
    bossAtk: 42,
    bossDef: 22,
    rewardCredits: 350,
    rewardFragments: 8,
    rewardMatrixCells: 5,
    rewardAetherCores: 2,
    realmId: 'realm-gamma',
    description: 'Uma anomalia biônica colossal que se alimenta da energia da fenda profunda.',
    mechanicWarning: 'Dispara ondas de pulso de vórtice. Coordene barreiras antes do colapso.',
  },
  {
    id: 'raid-02',
    title: 'Bastião do Colosso de Épsilon',
    threatRank: 'EXTREMA',
    bossName: 'COLOSSO BALUARTE DE ÉPSILON',
    bossHp: 1200,
    bossAtk: 55,
    bossDef: 35,
    rewardCredits: 550,
    rewardFragments: 14,
    rewardMatrixCells: 8,
    rewardAetherCores: 4,
    realmId: 'realm-epsilon',
    description: 'Armadura autônoma ancestral forjada em titânio e alimentada por antimatéria.',
    mechanicWarning: 'Blindagem reflexiva frontal. Requer flanqueamento e quebra de postura contínua.',
  },
  {
    id: 'raid-03',
    title: 'A Singularidade do Marco Zero',
    threatRank: 'SINGULARIDADE',
    bossName: 'CONVERGÊNCIA DAS LINHAS TEMPORAIS',
    bossHp: 1800,
    bossAtk: 68,
    bossDef: 40,
    rewardCredits: 900,
    rewardFragments: 25,
    rewardMatrixCells: 15,
    rewardAetherCores: 8,
    realmId: 'realm-omega',
    description: 'O epicentro onde realidades colapsam em uma única consciência devoradora.',
    mechanicWarning: 'Troca de fase a cada 33% de vida. O esquadrão deve carregar a Ressonância Dimensional rapidamente.',
  },
];

const INITIAL_SQUAD: CoopSquadMember[] = [
  {
    id: 'squad-1',
    name: 'Kael',
    roleTitle: 'Vanguarda Dimensional',
    role: 'KAEL_VANGUARD',
    level: 1,
    hp: 100,
    maxHp: 100,
    status: 'ONLINE',
    activeSkill: 'Corte de Plasma',
    avatarColor: 'border-cyan-400 text-cyan-300',
    isLocalPlayer: true,
  },
  {
    id: 'squad-2',
    name: 'Lyra',
    roleTitle: 'Operadora Tática',
    role: 'LYRA_TACTICIAN',
    level: 24,
    hp: 160,
    maxHp: 160,
    status: 'SYNCED',
    activeSkill: 'Pulso Nanítico',
    avatarColor: 'border-emerald-400 text-emerald-300',
  },
  {
    id: 'squad-3',
    name: 'Marcus',
    roleTitle: 'Baluarte de Titânio',
    role: 'MARCUS_JUGGERNAUT',
    level: 25,
    hp: 220,
    maxHp: 220,
    status: 'SYNCED',
    activeSkill: 'Barreira Égide',
    avatarColor: 'border-amber-400 text-amber-300',
  },
  {
    id: 'squad-4',
    name: 'Kira',
    roleTitle: 'Algoz do Vazio',
    role: 'KIRA_VOID',
    level: 26,
    hp: 140,
    maxHp: 140,
    status: 'SYNCED',
    activeSkill: 'Golpe Temporal',
    avatarColor: 'border-fuchsia-400 text-fuchsia-300',
  },
];

export const RiftCoopScene: React.FC<RiftCoopSceneProps> = ({
  player,
  setPlayer,
  onBackToNexus,
}) => {
  const [subMode, setSubMode] = useState<'LOBBY' | 'COMBAT' | 'VICTORY'>('LOBBY');
  const [sessionCode, setSessionCode] = useState<string>('FENDA-DELTA-902');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedMission, setSelectedMission] = useState<RiftRaidMission>(RAID_MISSIONS[0]);
  const [squad, setSquad] = useState<CoopSquadMember[]>(() => {
    return INITIAL_SQUAD.map(m =>
      m.isLocalPlayer
        ? {
            ...m,
            level: player.level,
            hp: player.hp,
            maxHp: player.maxHp,
          }
        : m
    );
  });

  // Raid Combat States
  const [bossHp, setBossHp] = useState<number>(RAID_MISSIONS[0].bossHp);
  const [bossMaxHp, setBossMaxHp] = useState<number>(RAID_MISSIONS[0].bossHp);
  const [bossStagger, setBossStagger] = useState<number>(0);
  const [resonance, setResonance] = useState<number>(20);
  const [turn, setTurn] = useState<number>(1);
  const [isBossAction, setIsBossAction] = useState<boolean>(false);
  const [bossIntent, setBossIntent] = useState<string>('Preparando vórtice de matéria escura');
  const [commsLog, setCommsLog] = useState<string[]>([
    'TRANSMISSÃO: Link neural do esquadrão estabelecido.',
    'Lyra: "Sensores calibrados. Estou pronta para suporte nanítico."',
    'Marcus: "Minha barreira cinética está armada. Mantenham o foco no alvo."',
  ]);
  const [animTrigger, setAnimTrigger] = useState<string | null>(null);

  // Cross-tab real sync channel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('ruptura-rift-net');
        channel.onmessage = (event) => {
          if (event.data?.type === 'SQUAD_CHAT') {
            setCommsLog(prev => [event.data.text, ...prev.slice(0, 15)]);
          } else if (event.data?.type === 'RESONANCE_BOOST') {
            setResonance(r => Math.min(100, r + (event.data.amount || 15)));
          }
        };
      }
    } catch {}

    return () => {
      try {
        channel?.close();
      } catch {}
    };
  }, []);

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(sessionCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      audio.playClick();
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleStartRaid = (mission: RiftRaidMission) => {
    audio.playPortal();
    setSelectedMission(mission);
    setBossHp(mission.bossHp);
    setBossMaxHp(mission.bossHp);
    setBossStagger(0);
    setResonance(25);
    setTurn(1);
    setCommsLog([
      `ALERTA TÁTICO: Engajando ${mission.bossName}!`,
      `Lyra: "Cuidado com o pulso! Coordene a quebra de postura!"`,
      `Marcus: "Estou na linha de frente! Atacar sob minha cobertura!"`,
    ]);
    setSubMode('COMBAT');
  };

  // Turn Actions
  const handlePlayerAttack = () => {
    audio.playLaser();
    const dmg = Math.floor(player.atk * 1.8) + Math.floor(Math.random() * 10);
    const staggerGain = 18;
    const resGain = 15;

    setBossHp(prev => Math.max(0, prev - dmg));
    setBossStagger(prev => Math.min(100, prev + staggerGain));
    setResonance(prev => Math.min(100, prev + resGain));

    setCommsLog(prev => [
      `Kael executou Ataque de Vanguarda: ${dmg} de dano! (+${resGain}% Ressonância)`,
      ...prev.slice(0, 10),
    ]);

    // Check boss defeat
    if (bossHp - dmg <= 0) {
      handleRaidVictory();
      return;
    }

    triggerSquadFollowUp();
  };

  const handleSquadSkill = (role: CompanionRole) => {
    audio.playCompanionSupport();
    if (role === 'LYRA_TACTICIAN') {
      // Lyra Heals squad and boosts resonance
      setSquad(prev =>
        prev.map(m => ({
          ...m,
          hp: Math.min(m.maxHp, m.hp + 45),
        }))
      );
      setResonance(r => Math.min(100, r + 20));
      setCommsLog(prev => [
        'Lyra: "Injeção nanítica aplicada! HP do esquadrão restaurado (+45 HP)!"',
        ...prev.slice(0, 10),
      ]);
    } else if (role === 'MARCUS_JUGGERNAUT') {
      // Marcus Staggers boss
      setBossStagger(s => Math.min(100, s + 35));
      setResonance(r => Math.min(100, r + 15));
      setCommsLog(prev => [
        'Marcus: "Barreira de impacto acionada! O chefe perdeu postura defensiva!"',
        ...prev.slice(0, 10),
      ]);
    } else if (role === 'KIRA_VOID') {
      // Kira deals heavy void damage
      const critDmg = 95 + Math.floor(Math.random() * 30);
      setBossHp(prev => Math.max(0, prev - critDmg));
      setResonance(r => Math.min(100, r + 25));
      setCommsLog(prev => [
        `Kira: "Golpe dimensional nas costas do alvo: ${critDmg} de dano crítico!"`,
        ...prev.slice(0, 10),
      ]);
      if (bossHp - critDmg <= 0) {
        handleRaidVictory();
        return;
      }
    }

    triggerSquadFollowUp();
  };

  const triggerSquadFollowUp = () => {
    setIsBossAction(true);
    setTimeout(() => {
      // Boss counter-attack
      audio.playEnemyAttack();
      const bossDmg = Math.max(10, selectedMission.bossAtk - Math.floor(player.def * 0.4));
      
      // Damage distributed across squad
      setSquad(prev =>
        prev.map(m => {
          const targetDmg = m.isLocalPlayer ? bossDmg : Math.floor(bossDmg * 0.8);
          return {
            ...m,
            hp: Math.max(1, m.hp - targetDmg),
          };
        })
      );

      setCommsLog(prev => [
        `AMEAÇA: ${selectedMission.bossName} retaliou causando ${bossDmg} de dano ao esquadrão!`,
        ...prev.slice(0, 10),
      ]);

      setIsBossAction(false);
      setTurn(t => t + 1);

      // Random new boss intent
      const intents = [
        'Canalizando descarga gravitacional',
        'Invocando reflexo distorcido de fenda',
        'Sobrecarregando matriz quântica',
        'Investida titânica em área',
      ];
      setBossIntent(intents[Math.floor(Math.random() * intents.length)]);
    }, 1100);
  };

  const handleMultiverseResonanceStrike = () => {
    if (resonance < 100) return;
    audio.playResonanceCombo();
    setAnimTrigger('RESONANCE_BURST');

    const massiveDmg = 380 + Math.floor(Math.random() * 80);
    setBossHp(prev => Math.max(0, prev - massiveDmg));
    setBossStagger(100);
    setResonance(0);

    setCommsLog(prev => [
      `🌟 GOLPE DE RESSONÂNCIA MULTIVERSAL EXECUTADO: ${massiveDmg} DE DANO DEVASTADOR!`,
      'Todos os 4 Operadores sincronizaram frequências dimensionais!',
      ...prev.slice(0, 10),
    ]);

    setTimeout(() => {
      setAnimTrigger(null);
      if (bossHp - massiveDmg <= 0) {
        handleRaidVictory();
      }
    }, 1500);
  };

  const handleRaidVictory = () => {
    audio.playVictory();
    setSubMode('VICTORY');

    // Rewards
    setPlayer(p => ({
      ...p,
      credits: p.credits + selectedMission.rewardCredits,
      fragments: p.fragments + selectedMission.rewardFragments,
      matrixCells: (p.matrixCells ?? 0) + selectedMission.rewardMatrixCells,
      aetherCores: (p.aetherCores ?? 0) + selectedMission.rewardAetherCores,
      coopRaidsCompleted: (p.coopRaidsCompleted ?? 0) + 1,
      exp: p.exp + 350,
    }));
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 text-slate-100 font-mono">
      <AtmosphericCanvas realm={selectedMission.realmId} />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-cyan-950 border border-cyan-400/50 rounded-xl shadow-lg shadow-cyan-500/20">
              <Users className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold border border-cyan-500/40">
                  REDE MULTIPLAYER RUPTURA 5.0
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                  <Wifi className="w-3 h-3 animate-pulse" /> SINC: ATIVA
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">
                FENDAS SINCRONIZADAS — CO-OP MULTIPLAYER
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

        {/* --- VIEW 1: LOBBY & MISSION SELECTION --- */}
        {subMode === 'LOBBY' && (
          <div className="space-y-4">
            {/* Session Room Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <div>
                  <span className="text-[10px] text-slate-400 block">SALA DE SINCRONIZAÇÃO DA FENDA</span>
                  <span className="text-sm sm:text-base font-bold text-white tracking-widest">{sessionCode}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs text-cyan-300 flex items-center gap-1.5 transition touch-manipulation cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO'}</span>
                </button>
                <button
                  onClick={() => {
                    const newCode = `FENDA-${Math.floor(1000 + Math.random() * 9000)}`;
                    setSessionCode(newCode);
                    audio.playClick();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-center gap-1.5 transition touch-manipulation cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>GERAR NOVA SALA</span>
                </button>
              </div>
            </div>

            {/* Squad Members Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">ESQUADRÃO SINCRONIZADO (4 OPERADORES)</span>
                <span className="text-[11px] text-cyan-400 font-bold">100% PRONTO</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {squad.map(member => (
                  <div
                    key={member.id}
                    className={`p-3.5 rounded-2xl bg-slate-900/80 border ${member.avatarColor} backdrop-blur-md flex flex-col justify-between min-h-[110px]`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{member.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 font-bold">
                          NV {member.level}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{member.roleTitle}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">HAB: {member.activeSkill}</span>
                      <span className="text-emerald-400 font-bold">{member.hp}/{member.maxHp} HP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Raid Missions List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">INCURSÕES DE FENDA DISPONÍVEIS</span>
                <span className="text-[11px] text-amber-400 font-bold">ESPÓLIOS COLETIVOS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {RAID_MISSIONS.map(mission => (
                  <div
                    key={mission.id}
                    className={`p-5 rounded-2xl border transition flex flex-col justify-between min-h-[220px] ${
                      selectedMission.id === mission.id
                        ? 'border-cyan-400 bg-slate-900/95 shadow-xl shadow-cyan-950/40'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          {mission.threatRank}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{mission.bossHp} HP</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{mission.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">{mission.description}</p>
                      <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-amber-300 flex items-start gap-1.5 mb-3">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{mission.mechanicWarning}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 mb-3 flex items-center justify-between">
                        <span>RECOMPENSAS:</span>
                        <span className="text-cyan-300 font-bold">
                          {mission.rewardCredits} CR • {mission.rewardFragments} FRAG • {mission.rewardMatrixCells} CÉL
                        </span>
                      </div>
                      <button
                        onClick={() => handleStartRaid(mission)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-1.5 transition touch-manipulation cursor-pointer"
                      >
                        <Crosshair className="w-4 h-4" />
                        <span>INICIAR INCURSÃO</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: RAID COMBAT ARENA --- */}
        {subMode === 'COMBAT' && (
          <div className="space-y-4">
            {/* Boss HUD */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/40 shadow-2xl backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Skull className="w-5 h-5 text-rose-400 animate-pulse" />
                  <span className="text-base sm:text-lg font-black text-rose-400 tracking-wider">
                    {selectedMission.bossName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    INCURSÃO COOPERATIVA
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-300">{bossHp} / {bossMaxHp} HP</span>
              </div>

              {/* Boss HP Bar */}
              <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-rose-900/60 mb-2">
                <div
                  className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 h-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%` }}
                />
              </div>

              {/* Boss Intent & Stagger */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>INTENÇÃO: {bossIntent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">POSTURA:</span>
                  <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="bg-amber-400 h-full transition-all duration-200"
                      style={{ width: `${bossStagger}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">{bossStagger}%</span>
                </div>
              </div>
            </div>

            {/* Resonance Combo Bar (The Core Co-op Mechanic) */}
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900/80 to-fuchsia-950/80 border border-cyan-400/50 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                    RESSONÂNCIA DIMENSIONAL DO ESQUADRÃO
                  </span>
                </div>
                <span className="text-xs font-bold text-cyan-300">{resonance}% / 100%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-cyan-500/40 mb-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 h-full transition-all duration-300"
                  style={{ width: `${resonance}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Ações coordenadas de suporte carregam a ressonância. Aos 100%, libere o golpe definitivo!
                </span>
                <button
                  disabled={resonance < 100}
                  onClick={handleMultiverseResonanceStrike}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    resonance >= 100
                      ? 'bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-lg shadow-fuchsia-600/50 animate-bounce cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  ⚡ IMPACTO DE RESSONÂNCIA (100%)
                </button>
              </div>
            </div>

            {/* Squad Real-time Status and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column: Squad Members list */}
              <div className="space-y-2 lg:col-span-1">
                <span className="text-xs font-bold text-slate-400 block mb-1">MEMBROS DA EQUIPE</span>
                {squad.map(m => (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl border bg-slate-900/80 ${m.avatarColor} flex items-center justify-between text-xs`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{m.name}</span>
                        {m.isLocalPlayer && (
                          <span className="text-[9px] px-1 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-bold">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{m.roleTitle}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{m.hp} HP</span>
                      <span className="text-[10px] text-slate-400 block">{m.activeSkill}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Center & Right: Tactical Actions & Live Comms */}
              <div className="space-y-3 lg:col-span-2">
                {/* Tactical Actions Grid */}
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-2">ORDENS DE COMBATE COOPERATIVO</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      disabled={isBossAction}
                      onClick={handlePlayerAttack}
                      className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-300 text-left transition flex flex-col justify-between min-h-[75px] touch-manipulation cursor-pointer"
                    >
                      <span className="text-xs font-bold text-cyan-300">GOLPE DE VANGUARDA</span>
                      <span className="text-[10px] text-slate-400">Dano Kael +15% Ress</span>
                    </button>
                    <button
                      disabled={isBossAction}
                      onClick={() => handleSquadSkill('LYRA_TACTICIAN')}
                      className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 hover:border-emerald-300 text-left transition flex flex-col justify-between min-h-[75px] touch-manipulation cursor-pointer"
                    >
                      <span className="text-xs font-bold text-emerald-300">PULSO NANÍTICO (LYRA)</span>
                      <span className="text-[10px] text-slate-400">Cura Esquadrão +20% Ress</span>
                    </button>
                    <button
                      disabled={isBossAction}
                      onClick={() => handleSquadSkill('MARCUS_JUGGERNAUT')}
                      className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 hover:border-amber-300 text-left transition flex flex-col justify-between min-h-[75px] touch-manipulation cursor-pointer"
                    >
                      <span className="text-xs font-bold text-amber-300">BARREIRA ÉGIDE (MARCUS)</span>
                      <span className="text-[10px] text-slate-400">Stagger Chefe +15% Ress</span>
                    </button>
                    <button
                      disabled={isBossAction}
                      onClick={() => handleSquadSkill('KIRA_VOID')}
                      className="p-3 rounded-xl bg-fuchsia-950/80 border border-fuchsia-500/40 hover:border-fuchsia-300 text-left transition flex flex-col justify-between min-h-[75px] touch-manipulation cursor-pointer"
                    >
                      <span className="text-xs font-bold text-fuchsia-300">GOLPE DO VAZIO (KIRA)</span>
                      <span className="text-[10px] text-slate-400">Crítico Alto +25% Ress</span>
                    </button>
                  </div>
                </div>

                {/* Comms Log Panel */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 max-h-[140px] overflow-y-auto text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800 pb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>CANAL DE VOZ DO ESQUADRÃO (LOG EM TEMPO REAL)</span>
                  </div>
                  {commsLog.map((log, index) => (
                    <p
                      key={index}
                      className={`leading-relaxed ${
                        log.startsWith('🌟')
                          ? 'text-fuchsia-300 font-bold'
                          : log.startsWith('AMEAÇA')
                          ? 'text-rose-400'
                          : log.includes('Lyra')
                          ? 'text-emerald-300'
                          : log.includes('Marcus')
                          ? 'text-amber-300'
                          : log.includes('Kira')
                          ? 'text-fuchsia-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 3: RAID VICTORY REWARDS --- */}
        {subMode === 'VICTORY' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/95 border border-cyan-400/50 shadow-2xl backdrop-blur-md max-w-xl mx-auto text-center space-y-4">
            <div className="inline-flex p-3 bg-cyan-950/80 border border-cyan-400 rounded-2xl shadow-lg shadow-cyan-500/30">
              <Award className="w-8 h-8 text-cyan-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
              INCURSÃO COOPERATIVA CONCLUÍDA!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              O esquadrão neutralizou {selectedMission.bossName} com sincronização perfeita. Os espólios dimensionais foram transferidos para o inventário do Nexus.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">CRÉDITOS</span>
                <span className="text-base font-bold text-amber-300">+{selectedMission.rewardCredits}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">FRAGMENTOS</span>
                <span className="text-base font-bold text-cyan-300">+{selectedMission.rewardFragments}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CÉLULAS MATRIZ</span>
                <span className="text-base font-bold text-emerald-300">+{selectedMission.rewardMatrixCells}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NÚCLEOS ÉTER</span>
                <span className="text-base font-bold text-fuchsia-300">+{selectedMission.rewardAetherCores}</span>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playClick();
                setSubMode('LOBBY');
              }}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-cyan-600/30 transition touch-manipulation cursor-pointer"
            >
              RETORNAR AO LOBBY DE FENDAS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
