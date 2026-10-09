import React, { useState, useEffect } from 'react';
import {
  Sword,
  Shield,
  Zap,
  Wind,
  Flame,
  Activity,
  AlertTriangle,
  Sparkles,
  Eye,
  RefreshCw,
  Radio,
  Layers,
  ChevronRight
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { KaelAvatar } from '../components/KaelAvatar';
import { FragmentadoAvatar } from '../components/FragmentadoAvatar';
import { PlayerState, EnemyState, EnemyIntent } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface FloatingMessage {
  id: number;
  text: string;
  type: 'damage' | 'heal' | 'dodge' | 'crit' | 'combo' | 'stagger';
  target: 'kael' | 'enemy';
}

export const CombatScene: React.FC<{
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  enemy: EnemyState;
  setEnemy: React.Dispatch<React.SetStateAction<EnemyState>>;
  onVictory: () => void;
  onDefeat: () => void;
  onNexusClick?: () => void;
}> = ({ player, setPlayer, enemy, setEnemy, onVictory, onDefeat, onNexusClick }) => {
  const [turn, setTurn] = useState<number>(1);
  const [focus, setFocus] = useState<number>(player.focus ?? 30);
  const [combo, setCombo] = useState<number>(0);
  const [isDefending, setIsDefending] = useState<boolean>(false);
  const [isDodging, setIsDodging] = useState<boolean>(false);
  const [cronoshieldActive, setCronoshieldActive] = useState<boolean>(false);

  // Skill Cooldowns
  const [quantumCooldown, setQuantumCooldown] = useState<number>(0);
  const [cronoCooldown, setCronoCooldown] = useState<number>(0);
  const [pulseCooldown, setPulseCooldown] = useState<number>(0);

  // Boss & Enemy Phase State
  const [enemyPhase, setEnemyPhase] = useState<number>(enemy.phase ?? 1);
  const [enemyMaxPhases, setEnemyMaxPhases] = useState<number>(() => {
    if (enemy.name.includes('ARQUITETO')) return 3;
    if (enemy.name.includes('AVATAR DA RUPTURA') || enemy.name.includes('GUARDIÃO INDUSTRIAL')) return 2;
    return 1;
  });
  const [phaseAnnounced, setPhaseAnnounced] = useState<string | null>(null);

  // Enemy Intent & Stagger
  const [enemyStagger, setEnemyStagger] = useState<number>(0);
  const [isEnemyStaggered, setIsEnemyStaggered] = useState<boolean>(false);
  const [enemyIntent, setEnemyIntent] = useState<EnemyIntent>({
    type: 'LIGHT_ATTACK',
    description: 'Investida rápida dimensional',
    power: enemy.atk,
  });

  const [combatLog, setCombatLog] = useState<string[]>([
    `Sistemas táticos de combate RUPTURA 2.0 engajados contra ${enemy.name}.`,
  ]);
  const [isEnemyTurn, setIsEnemyTurn] = useState<boolean>(false);
  const [kaelAnim, setKaelAnim] = useState<'idle' | 'attack' | 'defend' | 'hit'>('idle');
  const [enemyAnim, setEnemyAnim] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Generate next enemy intention based on boss status and phase
  const generateEnemyIntent = (currentTurn: number, currentPhase: number): EnemyIntent => {
    if (isEnemyStaggered) {
      return {
        type: 'LIGHT_ATTACK',
        description: 'Recuperando estabilidade de fase',
        power: Math.floor(enemy.atk * 0.5),
      };
    }

    const isBoss = enemyMaxPhases > 1;
    const r = Math.random();

    if (isBoss) {
      if (currentPhase === 3) {
        // Final Architect phase: devastating attacks
        return {
          type: 'HEAVY_TELEGRAPH',
          description: '⚡ SINGULARIDADE CÓSMICA (COLAPSO DE REALIDADE)',
          power: Math.floor(enemy.atk * 1.8),
        };
      }

      if (currentPhase === 2 && r < 0.45) {
        return {
          type: 'CHANNELING',
          description: '🌀 Canalizando Ruptura Multiversal (Interrompível!)',
          power: Math.floor(enemy.atk * 1.6),
        };
      }

      if (r < 0.35) {
        return {
          type: 'HEAVY_TELEGRAPH',
          description: '⚠️ Carga de Impacto Pesado Telegrafada!',
          power: Math.floor(enemy.atk * 1.5),
        };
      } else if (r < 0.6) {
        return {
          type: 'BARRIER',
          description: '🛡️ Matriz de Refrangência Espacial',
          power: Math.floor(enemy.atk * 0.7),
        };
      }
    } else {
      if (currentTurn % 3 === 0) {
        return {
          type: 'HEAVY_TELEGRAPH',
          description: '⚠️ Golpe Pesado Telegrafado!',
          power: Math.floor(enemy.atk * 1.4),
        };
      } else if (r < 0.25) {
        return {
          type: 'CHANNELING',
          description: '🌀 Acumulando anomalia instável',
          power: Math.floor(enemy.atk * 1.3),
        };
      }
    }

    return {
      type: 'LIGHT_ATTACK',
      description: 'Ataque frontal rápido',
      power: enemy.atk,
    };
  };

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 450);
  };

  const showFloating = (text: string, type: FloatingMessage['type'], target: 'kael' | 'enemy') => {
    const id = Date.now() + Math.random();
    setFloatingMessages(prev => [...prev, { id, text, type, target }]);
    setTimeout(() => {
      setFloatingMessages(prev => prev.filter(m => m.id !== id));
    }, 1200);
  };

  // Turn resolution for enemy
  const handleEnemyTurn = (currentKaelHp: number, defending: boolean, dodging: boolean, wasInterrupt: boolean = false) => {
    setIsEnemyTurn(true);

    if (isEnemyStaggered) {
      setCombatLog(prev => [`${enemy.name} está ATORDOADO e não pôde agir neste turno!`, ...prev]);
      setIsEnemyStaggered(false);
      setEnemyStagger(0);
      setIsEnemyTurn(false);
      setIsDefending(false);
      setIsDodging(false);
      setTurn(t => t + 1);
      setEnemyIntent(generateEnemyIntent(turn + 1, enemyPhase));
      return;
    }

    setEnemyAnim('attack');
    audio.playEnemyAttack();

    setTimeout(() => {
      setEnemyAnim('idle');

      // Check Perfect Dodge
      if (dodging) {
        if (enemyIntent.type === 'HEAVY_TELEGRAPH' || Math.random() < 0.65) {
          audio.playDodge();
          showFloating('ESQUIVA PERFEITA!', 'dodge', 'kael');
          setCombatLog(prev => [
            `⚡ KAEL executou ESQUIVA PERFEITA contra ${enemy.name}! Nenhum dano sofrido.`,
            ...prev,
          ]);

          // Counter-attack on perfect dodge
          const counterDmg = Math.floor(player.atk * 0.9);
          audio.playLaser();
          showFloating(`CONTRA-ATAQUE: -${counterDmg}`, 'crit', 'enemy');
          setEnemy(prev => {
            const nextHp = Math.max(0, prev.hp - counterDmg);
            if (nextHp <= 0) {
              checkVictoryOrNextPhase(nextHp);
            }
            return { ...prev, hp: nextHp };
          });
          setCombatLog(prev => [
            `⚔️ CONTRA-ATAQUE IMEDIATO! Kael desfere contra-golpe de ${counterDmg} de dano!`,
            ...prev,
          ]);

          endEnemyTurn(currentKaelHp);
          return;
        }
      }

      // Calculate incoming damage
      let rawDmg = enemyIntent.power;
      const defReduction = Math.floor(player.def * 0.5);
      let finalDamage = Math.max(3, rawDmg - defReduction);

      if (cronoshieldActive) {
        audio.playShield();
        const absorbed = Math.floor(finalDamage * 0.7);
        finalDamage = Math.max(1, finalDamage - absorbed);
        const healAmt = Math.floor(absorbed * 0.8);
        setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmt) }));
        showFloating(`CRONO-ESCUDO! +${healAmt} HP`, 'heal', 'kael');
        setCombatLog(prev => [
          `🛡️ CRONO-ESCUDO converteu ${absorbed} de impacto em ${healAmt} de regeneração de vida!`,
          ...prev,
        ]);
        setCronoshieldActive(false);
      } else if (defending) {
        finalDamage = Math.max(2, Math.floor(finalDamage * 0.35));
        showFloating(`DEFESA: -${finalDamage}`, 'damage', 'kael');
        setCombatLog(prev => [
          `🛡️ Matriz Defensiva absorveu a maior parte do impacto (${finalDamage} de dano recebido).`,
          ...prev,
        ]);
      } else {
        showFloating(`-${finalDamage}`, 'damage', 'kael');
        setCombatLog(prev => [`${enemy.name} atingiu KAEL com ${finalDamage} de dano.`, ...prev]);
        // Reset combo if unmitigated hit taken
        setCombo(0);
      }

      const nextHp = Math.max(0, currentKaelHp - finalDamage);
      setPlayer(prev => ({ ...prev, hp: nextHp }));
      setKaelAnim('hit');
      triggerShake();

      if (nextHp <= 0) {
        setTimeout(() => {
          onDefeat();
        }, 600);
      } else {
        endEnemyTurn(nextHp);
      }
    }, 600);
  };

  const endEnemyTurn = (_currentKaelHp: number) => {
    setTimeout(() => {
      setKaelAnim('idle');
      setIsEnemyTurn(false);
      setIsDefending(false);
      setIsDodging(false);
      setTurn(t => t + 1);

      // Focus natural recharge
      setFocus(f => Math.min(100, f + 15));

      // Reduce Skill Cooldowns
      if (quantumCooldown > 0) setQuantumCooldown(c => Math.max(0, c - 1));
      if (cronoCooldown > 0) setCronoCooldown(c => Math.max(0, c - 1));
      if (pulseCooldown > 0) setPulseCooldown(c => Math.max(0, c - 1));

      // Generate next enemy intent
      setEnemyIntent(generateEnemyIntent(turn + 1, enemyPhase));
    }, 450);
  };

  const checkVictoryOrNextPhase = (newEnemyHp: number) => {
    if (newEnemyHp <= 0) {
      if (enemyPhase < enemyMaxPhases) {
        // Transition to next phase of boss!
        const nextPhaseNum = enemyPhase + 1;
        setEnemyPhase(nextPhaseNum);
        audio.playBossPhase();
        triggerShake();

        let newPhaseName = 'SOBRECARGA DO REATOR';
        let newMaxHp = Math.floor(enemy.maxHp * 1.15);
        let newAtk = enemy.atk + 6;

        if (enemy.name.includes('ARQUITETO')) {
          if (nextPhaseNum === 2) {
            newPhaseName = 'FASE 2: TECELÃO DO ESPAÇO-TEMPO';
            newMaxHp = 220;
          } else {
            newPhaseName = 'FASE 3: COLAPSO DA SINGULARIDADE (FRENESI FINAL)';
            newMaxHp = 180;
            newAtk += 8;
          }
        } else if (enemy.name.includes('AVATAR')) {
          newPhaseName = 'FASE 2: DESDOBRAMENTO MULTIVERSAL';
          newMaxHp = 190;
          newAtk += 5;
        }

        setPhaseAnnounced(newPhaseName);
        setTimeout(() => setPhaseAnnounced(null), 3000);

        setEnemy(prev => ({
          ...prev,
          hp: newMaxHp,
          maxHp: newMaxHp,
          atk: newAtk,
          phase: nextPhaseNum,
        }));

        setCombatLog(prev => [
          `⚡ ALERTA DIMENSIONAL! ${enemy.name} iniciou ${newPhaseName}! Formas de ataque reconfiguradas!`,
          ...prev,
        ]);
      } else {
        // Victory!
        onVictory();
      }
    }
  };

  // 1. ATAQUE RÁPIDO (Corte de Plasma Ágil)
  const handleFastAttack = () => {
    if (isEnemyTurn) return;
    audio.playLaser();
    setKaelAnim('attack');

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    if (nextCombo >= 2) {
      audio.playCombo();
      showFloating(`COMBO x${nextCombo}!`, 'combo', 'kael');
    }

    const comboBonus = 1 + (nextCombo - 1) * 0.12;
    const baseDamage = Math.floor(player.atk * 0.85 * comboBonus);

    // Stagger build
    const nextStagger = Math.min(100, enemyStagger + 20);
    setEnemyStagger(nextStagger);

    let interrupted = false;
    if (enemyIntent.type === 'CHANNELING') {
      interrupted = true;
      showFloating('CANALIZAÇÃO INTERROMPIDA!', 'crit', 'enemy');
      setCombatLog(prev => [`⚡ INTERRUPÇÃO! Ataque rápido quebrou a canalização do inimigo!`, ...prev]);
    }

    setTimeout(() => {
      setKaelAnim('idle');
      const nextEnemyHp = Math.max(0, enemy.hp - baseDamage);
      setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
      setEnemyAnim('hit');
      showFloating(`-${baseDamage}`, 'damage', 'enemy');

      // Generate focus
      setFocus(f => Math.min(100, f + 20));

      setCombatLog(prev => [
        `🗡️ KAEL desferiu Ataque Rápido [Combo x${nextCombo}] causando ${baseDamage} de dano! (+20 Foco)`,
        ...prev,
      ]);

      setTimeout(() => {
        setEnemyAnim('idle');
        if (nextEnemyHp <= 0) {
          checkVictoryOrNextPhase(nextEnemyHp);
        } else {
          handleEnemyTurn(player.hp, false, false, interrupted);
        }
      }, 400);
    }, 280);
  };

  // 2. ATAQUE PESADO (Disparo de Ruptura)
  const handleHeavyAttack = () => {
    if (isEnemyTurn || focus < 25) return;
    audio.playHeavyHit();
    setKaelAnim('attack');
    triggerShake();

    const nextFocus = Math.max(0, focus - 25);
    setFocus(nextFocus);

    const comboBonus = 1 + combo * 0.15;
    const heavyDamage = Math.floor(player.atk * 1.65 * comboBonus);
    const nextStagger = Math.min(100, enemyStagger + 45);
    setEnemyStagger(nextStagger);

    let willStagger = nextStagger >= 100;
    if (willStagger) {
      setIsEnemyStaggered(true);
      showFloating('INIMIGO EM STAGGER!', 'stagger', 'enemy');
    }

    setTimeout(() => {
      setKaelAnim('idle');
      const nextEnemyHp = Math.max(0, enemy.hp - heavyDamage);
      setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
      setEnemyAnim('hit');
      showFloating(`-${heavyDamage} PESADO!`, 'crit', 'enemy');

      setCombatLog(prev => [
        `💥 IMPACTO PESADO! Kael desferiu Disparo de Ruptura causando ${heavyDamage} de dano massivo!`,
        ...prev,
      ]);

      setTimeout(() => {
        setEnemyAnim('idle');
        if (nextEnemyHp <= 0) {
          checkVictoryOrNextPhase(nextEnemyHp);
        } else {
          handleEnemyTurn(player.hp, false, false);
        }
      }, 400);
    }, 350);
  };

  // 3. ESQUIVA TÁTICA
  const handleDodge = () => {
    if (isEnemyTurn) return;
    audio.playDodge();
    setIsDodging(true);
    setKaelAnim('defend');
    setCombatLog(prev => ['💨 KAEL entrou em postura de Esquiva Tática! Preparado para desviar e contra-atacar.', ...prev]);

    setTimeout(() => {
      handleEnemyTurn(player.hp, false, true);
    }, 450);
  };

  // 4. DEFENDER (Matriz Defensiva)
  const handleDefend = () => {
    if (isEnemyTurn) return;
    audio.playShield();
    setIsDefending(true);
    setKaelAnim('defend');
    setFocus(f => Math.min(100, f + 15));
    setCombatLog(prev => ['🛡️ KAEL ativou Matriz Defensiva. Dano mitigado e +15 de Foco recuperado.', ...prev]);

    setTimeout(() => {
      handleEnemyTurn(player.hp, true, false);
    }, 450);
  };

  // 5. HABILIDADE 1: IMPACTO QUÂNTICO (Clássica RUPTURA)
  const handleQuantumImpact = () => {
    if (isEnemyTurn || quantumCooldown > 0 || focus < 35) return;
    audio.playQuantum();
    setKaelAnim('attack');
    triggerShake();

    setFocus(f => Math.max(0, f - 35));
    setQuantumCooldown(3);

    const damage = Math.floor(player.atk * 2.1) + 20;

    setTimeout(() => {
      setKaelAnim('idle');
      const nextEnemyHp = Math.max(0, enemy.hp - damage);
      setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
      setEnemyAnim('hit');
      showFloating(`-${damage} QUÂNTICO!`, 'crit', 'enemy');

      setCombatLog(prev => [
        `⚡ IMPACTO QUÂNTICO! Kael rasgou a malha espacial causando ${damage} de dano dimensional!`,
        ...prev,
      ]);

      setTimeout(() => {
        setEnemyAnim('idle');
        if (nextEnemyHp <= 0) {
          checkVictoryOrNextPhase(nextEnemyHp);
        } else {
          handleEnemyTurn(player.hp, false, false);
        }
      }, 400);
    }, 400);
  };

  // 6. HABILIDADE 2: BARREIRA DE CRONOFLUXO
  const handleCronoshield = () => {
    if (isEnemyTurn || cronoCooldown > 0 || focus < 40) return;
    audio.playShield();
    setFocus(f => Math.max(0, f - 40));
    setCronoCooldown(4);
    setCronoshieldActive(true);
    showFloating('CRONO-ESCUDO ATIVO!', 'heal', 'kael');
    setCombatLog(prev => [
      `⌛ BARREIRA DE CRONOFLUXO ativada! O próximo ataque absorverá o impacto e curará Kael.`,
      ...prev,
    ]);

    setTimeout(() => {
      handleEnemyTurn(player.hp, false, false);
    }, 450);
  };

  // 7. HABILIDADE 3: PULSO DE RUPTURA (Atordoamento)
  const handlePulseRupture = () => {
    if (isEnemyTurn || pulseCooldown > 0 || focus < 50) return;
    audio.playHeavyHit();
    triggerShake();
    setFocus(f => Math.max(0, f - 50));
    setPulseCooldown(4);
    setIsEnemyStaggered(true);
    setEnemyStagger(100);

    const pulseDmg = Math.floor(player.atk * 1.25);
    const nextEnemyHp = Math.max(0, enemy.hp - pulseDmg);
    setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
    showFloating(`-${pulseDmg} ATORDOR!`, 'stagger', 'enemy');

    setCombatLog(prev => [
      `🌀 PULSO DE RUPTURA! Onda de choque dimensional atordoou completamente ${enemy.name}!`,
      ...prev,
    ]);

    setTimeout(() => {
      if (nextEnemyHp <= 0) {
        checkVictoryOrNextPhase(nextEnemyHp);
      } else {
        handleEnemyTurn(player.hp, false, false);
      }
    }, 400);
  };

  // 8. HABILIDADE SUPREMA: SOBRECARGA DE MATRIZ
  const handleOverdrive = () => {
    if (isEnemyTurn || focus < 100) return;
    audio.playQuantum();
    audio.playHeavyHit();
    triggerShake();
    setFocus(0);

    const overdriveDmg = Math.floor(player.atk * 3.5) + 40;
    const nextEnemyHp = Math.max(0, enemy.hp - overdriveDmg);
    setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
    showFloating(`💥 SOBRECARGA: -${overdriveDmg}!!`, 'crit', 'enemy');

    setCombatLog(prev => [
      `🌟 SOBRECARGA DE MATRIZ 2.0! Kael canalizou o poder de todas as realidades liberando ${overdriveDmg} DE DANO TOTAL!`,
      ...prev,
    ]);

    setTimeout(() => {
      if (nextEnemyHp <= 0) {
        checkVictoryOrNextPhase(nextEnemyHp);
      } else {
        handleEnemyTurn(player.hp, false, false);
      }
    }, 500);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden h-full bg-slate-950">
      <AtmosphericCanvas screenShake={screenShake} />
      <ProgressionHUD player={player} onNexusClick={onNexusClick} />

      {/* Boss Phase Announcement Overlay */}
      {phaseAnnounced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-pulse pointer-events-none">
          <div className="text-center p-6 border-y-2 border-rose-500 w-full bg-rose-950/40">
            <span className="text-xs font-mono tracking-[0.4em] text-rose-400 uppercase">TRANSIÇÃO DE CHEFE</span>
            <h2 className="text-3xl md:text-5xl font-black text-rose-200 mt-2 tracking-widest">{phaseAnnounced}</h2>
            <p className="text-rose-300 text-xs mt-2 font-mono">Padrões de combate elevados ao nível máximo!</p>
          </div>
        </div>
      )}

      {/* Floating text messages */}
      {floatingMessages.map(msg => (
        <div
          key={msg.id}
          className={`fixed z-40 top-1/3 ${
            msg.target === 'kael' ? 'left-1/4' : 'right-1/4'
          } -translate-y-1/2 font-black text-xl md:text-3xl drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] font-mono animate-bounce ${
            msg.type === 'damage'
              ? 'text-rose-400'
              : msg.type === 'heal'
              ? 'text-emerald-400'
              : msg.type === 'dodge'
              ? 'text-cyan-300'
              : msg.type === 'combo'
              ? 'text-amber-300'
              : 'text-fuchsia-400'
          }`}
        >
          {msg.text}
        </div>
      ))}

      {/* Main Combat Arena */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-3 md:px-6 py-2 max-w-5xl mx-auto w-full">
        {/* Top Health and Status Bars */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 bg-slate-950/80 border border-slate-800 p-3 md:p-4 rounded-2xl backdrop-blur-md">
          {/* Kael Info */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-400 text-xs md:text-sm font-mono">{player.name}</span>
                {combo > 1 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold">
                    COMBO x{combo}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-300">{player.hp}/{player.maxHp} HP</span>
            </div>
            {/* HP Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${Math.max(0, (player.hp / player.maxHp) * 100)}%` }}
              />
            </div>
            {/* Focus Bar */}
            <div className="flex justify-between items-center text-[10px] text-fuchsia-300 font-mono mb-0.5">
              <span>FOCO QUÂNTICO</span>
              <span>{focus}/100</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-fuchsia-900/60">
              <div
                className="bg-gradient-to-r from-fuchsia-600 to-pink-500 h-full transition-all duration-200"
                style={{ width: `${focus}%` }}
              />
            </div>
          </div>

          {/* Enemy Info */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-400 text-xs md:text-sm font-mono truncate max-w-[140px] md:max-w-none">
                  {enemy.name}
                </span>
                {enemyMaxPhases > 1 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded font-bold">
                    FASE {enemyPhase}/{enemyMaxPhases}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-300">{enemy.hp}/{enemy.maxHp} HP</span>
            </div>
            {/* Enemy HP Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 mb-2">
              <div
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 h-full transition-all duration-300"
                style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              />
            </div>
            {/* Stagger Bar */}
            <div className="flex justify-between items-center text-[10px] text-amber-300 font-mono mb-0.5">
              <span>POSTURA / STAGGER</span>
              <span>{enemyStagger}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-amber-900/60">
              <div
                className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full transition-all duration-200"
                style={{ width: `${enemyStagger}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mid Arena: Avatars and Intent telegraph */}
        <div className="flex flex-col items-center my-auto py-2">
          {/* Enemy Intent Telegraph Pill */}
          <div className="mb-3 px-3 py-1 rounded-full border border-rose-500/40 bg-rose-950/60 backdrop-blur-md flex items-center gap-2 text-xs font-mono text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span className="font-bold">INTENÇÃO:</span>
            <span className="text-white">{enemyIntent.description}</span>
          </div>

          <div className="w-full flex items-center justify-between px-4 md:px-16 min-h-[190px]">
            {/* Kael Stance */}
            <div className="flex flex-col items-center">
              <KaelAvatar state={kaelAnim} />
              <div className="mt-2 flex flex-col items-center gap-1">
                <span className="text-[10px] md:text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {isDefending ? '🛡️ DEFESA ATIVA' : isDodging ? '💨 ESQUIVA PREPARADA' : cronoshieldActive ? '⌛ CRONO-ESCUDO' : 'SISTEMAS PRONTOS'}
                </span>
              </div>
            </div>

            {/* VS Badge and Turn Counter */}
            <div className="text-center font-mono">
              <span className="text-xl md:text-2xl font-black text-slate-600 tracking-widest">VS</span>
              <p className="text-[10px] text-slate-400 mt-1">TURNO {turn}</p>
              {isEnemyTurn && (
                <span className="inline-block mt-1 text-xs text-rose-400 font-bold animate-pulse">
                  EXECUTANDO...
                </span>
              )}
            </div>

            {/* Enemy Stance */}
            <div className="flex flex-col items-center">
              <FragmentadoAvatar state={enemyAnim} />
              <div className="mt-2 flex flex-col items-center gap-1">
                <span className="text-[10px] md:text-xs font-mono text-fuchsia-300 bg-fuchsia-950/80 px-2 py-0.5 rounded border border-fuchsia-500/30">
                  {isEnemyStaggered ? '💫 ATORDOADO' : enemyMaxPhases > 1 ? '👑 ENTIDADE CHEFE' : 'ENTIDADE ANÔMALA'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Actions & Battle Log Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 font-mono">
          {/* Action Buttons Panel */}
          <div className="md:col-span-8 flex flex-col gap-2">
            {/* Primary Actions (Fast, Heavy, Dodge, Defend) */}
            <div className="grid grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
              <button
                disabled={isEnemyTurn}
                onClick={handleFastAttack}
                className="py-2.5 px-2 bg-gradient-to-b from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-1 text-[11px]"
                title="Ataque ágil com sabre de plasma (+20 Foco, acumula combo)"
              >
                <Sword className="w-4 h-4" />
                <span>RÁPIDO</span>
                <span className="text-[9px] text-cyan-200 opacity-80">+20 Foco</span>
              </button>

              <button
                disabled={isEnemyTurn || focus < 25}
                onClick={handleHeavyAttack}
                className="py-2.5 px-2 bg-gradient-to-b from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-1 text-[11px]"
                title="Disparo de alta potência. Quebra postura (Custa 25 Foco)"
              >
                <Flame className="w-4 h-4 text-amber-200" />
                <span>PESADO</span>
                <span className="text-[9px] text-amber-200 opacity-80">25 Foco</span>
              </button>

              <button
                disabled={isEnemyTurn}
                onClick={handleDodge}
                className="py-2.5 px-2 bg-gradient-to-b from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-1 text-[11px]"
                title="Esquiva tática. Desvia de ataques pesados e aplica contra-ataque imediato!"
              >
                <Wind className="w-4 h-4 text-indigo-200" />
                <span>ESQUIVA</span>
                <span className="text-[9px] text-indigo-200 opacity-80">Contra-ataque</span>
              </button>

              <button
                disabled={isEnemyTurn}
                onClick={handleDefend}
                className="py-2.5 px-2 bg-gradient-to-b from-blue-700 to-slate-800 hover:from-blue-600 hover:to-slate-700 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-1 text-[11px]"
                title="Matriz de blindagem (Reduz dano em 65%, +15 Foco)"
              >
                <Shield className="w-4 h-4 text-blue-300" />
                <span>DEFESA</span>
                <span className="text-[9px] text-blue-200 opacity-80">+15 Foco</span>
              </button>
            </div>

            {/* Matrix Skills (Quantum Impact, Cronoshield, Pulse Rupture, Overdrive) */}
            <div className="grid grid-cols-4 gap-2 bg-slate-900/60 p-2 rounded-xl border border-fuchsia-900/30">
              {/* Skill 1 */}
              <button
                disabled={isEnemyTurn || quantumCooldown > 0 || focus < 35}
                onClick={handleQuantumImpact}
                className="py-1.5 px-2 bg-fuchsia-950/80 hover:bg-fuchsia-900 border border-fuchsia-500/40 disabled:opacity-40 text-white rounded-lg transition flex flex-col items-center justify-center text-[10px] relative overflow-hidden"
              >
                <div className="flex items-center gap-1 font-bold text-fuchsia-300">
                  <Zap className="w-3 h-3" />
                  <span>QUÂNTICO</span>
                </div>
                <span className="text-[9px] text-fuchsia-400">35 Foco</span>
                {quantumCooldown > 0 && (
                  <span className="absolute inset-0 bg-slate-950/90 flex items-center justify-center text-[9px] text-fuchsia-300 font-bold">
                    ({quantumCooldown}T)
                  </span>
                )}
              </button>

              {/* Skill 2 */}
              <button
                disabled={isEnemyTurn || cronoCooldown > 0 || focus < 40}
                onClick={handleCronoshield}
                className="py-1.5 px-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 disabled:opacity-40 text-white rounded-lg transition flex flex-col items-center justify-center text-[10px] relative overflow-hidden"
              >
                <div className="flex items-center gap-1 font-bold text-cyan-300">
                  <Activity className="w-3 h-3" />
                  <span>CRONO</span>
                </div>
                <span className="text-[9px] text-cyan-400">40 Foco</span>
                {cronoCooldown > 0 && (
                  <span className="absolute inset-0 bg-slate-950/90 flex items-center justify-center text-[9px] text-cyan-300 font-bold">
                    ({cronoCooldown}T)
                  </span>
                )}
              </button>

              {/* Skill 3 */}
              <button
                disabled={isEnemyTurn || pulseCooldown > 0 || focus < 50}
                onClick={handlePulseRupture}
                className="py-1.5 px-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 disabled:opacity-40 text-white rounded-lg transition flex flex-col items-center justify-center text-[10px] relative overflow-hidden"
              >
                <div className="flex items-center gap-1 font-bold text-purple-300">
                  <Sparkles className="w-3 h-3" />
                  <span>PULSO</span>
                </div>
                <span className="text-[9px] text-purple-400">50 Foco</span>
                {pulseCooldown > 0 && (
                  <span className="absolute inset-0 bg-slate-950/90 flex items-center justify-center text-[9px] text-purple-300 font-bold">
                    ({pulseCooldown}T)
                  </span>
                )}
              </button>

              {/* Ultimate Skill */}
              <button
                disabled={isEnemyTurn || focus < 100}
                onClick={handleOverdrive}
                className={`py-1.5 px-2 border rounded-lg transition flex flex-col items-center justify-center text-[10px] relative overflow-hidden ${
                  focus >= 100
                    ? 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 border-amber-400 text-white font-black animate-pulse shadow-lg shadow-fuchsia-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-500 opacity-50'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>OVERDRIVE</span>
                </div>
                <span className="text-[9px]">100% FOCO</span>
              </button>
            </div>
          </div>

          {/* Combat Log */}
          <div className="md:col-span-4 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl h-36 md:h-auto overflow-y-auto text-[11px] text-slate-300 space-y-1">
            <div className="text-[10px] text-cyan-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>LOG TÁTICO RUPTURA 2.0</span>
              <span className="text-[9px] text-slate-500">TURNO {turn}</span>
            </div>
            {combatLog.map((log, idx) => (
              <p key={idx} className={idx === 0 ? 'text-cyan-300 font-semibold leading-tight' : 'opacity-70 leading-tight text-[10px]'}>
                &gt; {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
