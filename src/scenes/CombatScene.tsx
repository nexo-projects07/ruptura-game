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
  ChevronRight,
  Award
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { KaelAvatar } from '../components/KaelAvatar';
import { FragmentadoAvatar, EnemyAnimState } from '../components/FragmentadoAvatar';
import { PlayerState, EnemyState, EnemyIntent } from '../types/game';
import { audio } from '../systems/AudioEngine';
import { StatCalculator } from '../systems/StatCalculator';
import { TacticalChoice } from '../components/BossConfrontationModal';

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
  tacticalChoice?: TacticalChoice;
  realm?: string;
}> = ({
  player,
  setPlayer,
  enemy,
  setEnemy,
  onVictory,
  onDefeat,
  onNexusClick,
  tacticalChoice,
  realm = 'realm-alpha',
}) => {
  const stats = StatCalculator.calculate(player);
  const [turn, setTurn] = useState<number>(1);
  const [focus, setFocus] = useState<number>(() => {
    if (tacticalChoice?.effectType === 'FOCUS_MAX') return 100;
    return player.focus ?? 30;
  });
  const [combo, setCombo] = useState<number>(0);
  const [isDefending, setIsDefending] = useState<boolean>(false);
  const [isDodging, setIsDodging] = useState<boolean>(false);
  const [cronoshieldActive, setCronoshieldActive] = useState<boolean>(false);

  // Skill Cooldowns
  const [quantumCooldown, setQuantumCooldown] = useState<number>(0);
  const [cronoCooldown, setCronoCooldown] = useState<number>(0);
  const [pulseCooldown, setPulseCooldown] = useState<number>(0);
  const [companionCooldown, setCompanionCooldown] = useState<number>(0);
  const [selectedCompanion, setSelectedCompanion] = useState<'LYRA' | 'MARCUS'>('LYRA');

  // Boss & Enemy Phase State
  const [enemyPhase, setEnemyPhase] = useState<number>(enemy.phase ?? 1);
  const [enemyMaxPhases, setEnemyMaxPhases] = useState<number>(() => {
    if (enemy.maxPhases && enemy.maxPhases > 1) return enemy.maxPhases;
    if (enemy.name.includes('ARQUITETO') || enemy.name.includes('ECO PRIMORDIAL')) return 3;
    if (
      enemy.name.includes('AVATAR DA RUPTURA') ||
      enemy.name.includes('GUARDIÃO INDUSTRIAL') ||
      enemy.name.includes('CARTÓGRAFO') ||
      enemy.name.includes('SENTINELA')
    ) {
      return 2;
    }
    return 1;
  });
  const [phaseAnnounced, setPhaseAnnounced] = useState<string | null>(null);

  // Enemy Intent & Stagger
  const [enemyStagger, setEnemyStagger] = useState<number>(() => {
    if (tacticalChoice?.effectType === 'INITIAL_STAGGER') return tacticalChoice.effectValue;
    return 0;
  });
  const [isEnemyStaggered, setIsEnemyStaggered] = useState<boolean>(false);
  const [enemyIntent, setEnemyIntent] = useState<EnemyIntent>({
    type: 'LIGHT_ATTACK',
    description: 'Investida rápida dimensional',
    power: enemy.atk,
  });

  const [combatLog, setCombatLog] = useState<string[]>(() => {
    const logs = [`Sistemas táticos de combate RUPTURA 4.0 engajados contra ${enemy.name}.`];
    if (tacticalChoice) {
      logs.unshift(`⚡ VANTAGEM TÁTICA ATIVA: ${tacticalChoice.label} (${tacticalChoice.buffName})`);
    }
    return logs;
  });

  const [isEnemyTurn, setIsEnemyTurn] = useState<boolean>(false);
  const [kaelAnim, setKaelAnim] = useState<'idle' | 'attack' | 'defend' | 'hit'>('idle');
  const [enemyAnim, setEnemyAnim] = useState<EnemyAnimState>('idle');
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Audio BGM loop integration
  useEffect(() => {
    const isBoss = enemyMaxPhases > 1 || Boolean(enemy.boss);
    audio.playBGM(isBoss ? 'BOSS' : 'COMBAT');
    return () => {
      audio.stopBGM();
    };
  }, [enemyMaxPhases, enemy.boss]);

  // Apply initial damage from tactical choice if present
  useEffect(() => {
    if (tacticalChoice?.effectType === 'INITIAL_DAMAGE') {
      const dmg = tacticalChoice.effectValue;
      setEnemy(prev => ({ ...prev, hp: Math.max(1, prev.hp - dmg) }));
      showFloating(`-${dmg} DANO INICIAL!`, 'crit', 'enemy');
      audio.playHeavyHit();
    }
  }, []);

  // Update enemy telegraph animation and sound on intent change
  useEffect(() => {
    if (enemyIntent.type === 'HEAVY_TELEGRAPH' || enemyIntent.type === 'CHANNELING') {
      setEnemyAnim('telegraph');
      audio.playTelegraphWarning();
    } else if (isEnemyStaggered) {
      setEnemyAnim('stagger');
    } else if (enemyAnim === 'telegraph') {
      setEnemyAnim('idle');
    }
  }, [enemyIntent, isEnemyStaggered]);

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
  const handleEnemyTurn = (currentKaelHp: number, defending: boolean, dodging: boolean) => {
    setIsEnemyTurn(true);

    if (isEnemyStaggered) {
      setCombatLog(prev => [`${enemy.name} está ATORDOADO e não pôde agir neste turno!`, ...prev]);
      setIsEnemyStaggered(false);
      setEnemyStagger(0);
      setIsEnemyTurn(false);
      setIsDefending(false);
      setIsDodging(false);
      setTurn(t => t + 1);
      setEnemyAnim('idle');
      setEnemyIntent(generateEnemyIntent(turn + 1, enemyPhase));
      return;
    }

    setEnemyAnim('attack');
    audio.playEnemyAttack();

    setTimeout(() => {
      setEnemyAnim('idle');

      // Check Perfect Dodge (including tactical choice bonus)
      const tacticalDodgeBonus = tacticalChoice?.effectType === 'BONUS_DODGE' ? tacticalChoice.effectValue : 0;
      if (dodging) {
        const dodgeChance = 0.65 + stats.dodgeBonus + tacticalDodgeBonus;
        if (enemyIntent.type === 'HEAVY_TELEGRAPH' || Math.random() < dodgeChance) {
          audio.playDodge();
          showFloating('ESQUIVA PERFEITA!', 'dodge', 'kael');
          setCombatLog(prev => [
            `⚡ KAEL executou ESQUIVA PERFEITA contra ${enemy.name}! Nenhum dano sofrido.`,
            ...prev,
          ]);

          // Counter-attack on perfect dodge
          const counterCrit = Math.random() < stats.critChance;
          const counterMultiplier = counterCrit ? 1.5 : 1.0;
          const counterDmg = Math.floor(stats.atk * 0.9 * counterMultiplier);
          audio.playLaser();
          showFloating(`CONTRA-ATAQUE: -${counterDmg}${counterCrit ? ' (CRÍTICO!)' : ''}`, 'crit', 'enemy');
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

      // Calculate incoming damage using stats.def + tacticalDefBonus
      const tacticalDefBonus = tacticalChoice?.effectType === 'BONUS_DEF' ? tacticalChoice.effectValue : 0;
      let rawDmg = enemyIntent.power;
      const defReduction = Math.floor((stats.def + tacticalDefBonus) * 0.5);
      let baseMitigated = Math.max(2, rawDmg - defReduction);
      const passiveAbsorption = Math.floor(baseMitigated * stats.damageReductionPercent);
      let finalDamage = Math.max(1, baseMitigated - passiveAbsorption);

      if (cronoshieldActive) {
        audio.playShield();
        const absorbed = Math.floor(finalDamage * 0.7);
        finalDamage = Math.max(1, finalDamage - absorbed);
        const healAmt = Math.floor(absorbed * 0.8);
        setPlayer(prev => ({ ...prev, hp: Math.min(stats.maxHp, prev.hp + healAmt) }));
        showFloating(`CRONO-ESCUDO! +${healAmt} HP`, 'heal', 'kael');
        setCombatLog(prev => [
          `🛡️ CRONO-ESCUDO converteu ${absorbed} de impacto em ${healAmt} de regeneração de vida!`,
          ...prev,
        ]);
        setCronoshieldActive(false);
      } else if (defending) {
        finalDamage = Math.max(1, Math.floor(finalDamage * 0.35));
        showFloating(`DEFESA: -${finalDamage}`, 'damage', 'kael');
        setCombatLog(prev => [
          `🛡️ Matriz Defensiva absorveu a maior parte do impacto (${finalDamage} de dano recebido).`,
          ...prev,
        ]);
      } else {
        showFloating(`-${finalDamage}`, 'damage', 'kael');
        setCombatLog(prev => [`${enemy.name} atingiu KAEL com ${finalDamage} de dano.`, ...prev]);
        setCombo(0);
      }

      const nextHp = Math.max(0, currentKaelHp - finalDamage);
      setPlayer(prev => ({ ...prev, hp: nextHp }));
      setKaelAnim('hit');
      triggerShake();

      if (nextHp <= 0) {
        audio.stopBGM();
        audio.playDefeat();
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
      if (companionCooldown > 0) setCompanionCooldown(c => Math.max(0, c - 1));

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
        setEnemyAnim('phaseTransition');
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
        } else if (enemy.name.includes('CARTÓGRAFO')) {
          newPhaseName = 'FASE 2: ALINHAMENTO DO VÁCUO ESTELAR';
          newMaxHp = Math.floor(enemy.maxHp * 1.2);
          newAtk += 6;
        } else if (enemy.name.includes('SENTINELA')) {
          newPhaseName = 'FASE 2: REATOR DE ANTIMATÉRIA DESENCADEADO';
          newMaxHp = Math.floor(enemy.maxHp * 1.25);
          newAtk += 7;
        } else if (enemy.name.includes('ECO PRIMORDIAL')) {
          if (nextPhaseNum === 2) {
            newPhaseName = 'FASE 2: DUPLICIDADE QUÂNTICA';
            newMaxHp = Math.floor(enemy.maxHp * 1.1);
          } else {
            newPhaseName = 'FASE 3: CONVERGÊNCIA DAS LINHAS TEMPORAIS';
            newMaxHp = Math.floor(enemy.maxHp * 1.15);
            newAtk += 8;
          }
        } else if (enemy.name.includes('AVATAR')) {
          newPhaseName = 'FASE 2: DESDOBRAMENTO MULTIVERSAL';
          newMaxHp = 190;
          newAtk += 5;
        }

        setPhaseAnnounced(newPhaseName);
        setTimeout(() => {
          setPhaseAnnounced(null);
          setEnemyAnim('idle');
        }, 2200);

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
        audio.stopBGM();
        audio.playVictory();
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
    const isCrit = Math.random() < stats.critChance;
    const critMultiplier = isCrit ? 1.6 : 1.0;
    const baseDamage = Math.floor(stats.atk * 0.85 * comboBonus * critMultiplier);

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
      showFloating(`-${baseDamage}${isCrit ? ' (CRÍTICO!)' : ''}`, isCrit ? 'crit' : 'damage', 'enemy');

      setTimeout(() => setEnemyAnim('idle'), 350);

      setCombatLog(prev => [
        `Kael desferiu Corte Ágil causando ${baseDamage} de dano${isCrit ? ' [CRÍTICO!]' : ''}${
          interrupted ? ' e interrompeu a canalização!' : ''
        }.`,
        ...prev,
      ]);

      if (nextEnemyHp <= 0) {
        checkVictoryOrNextPhase(nextEnemyHp);
      } else {
        if (nextStagger >= 100 && !isEnemyStaggered) {
          setIsEnemyStaggered(true);
          showFloating('RUPTURA DE POSTURA!', 'stagger', 'enemy');
          audio.playBossPhase();
        }
        setTimeout(() => handleEnemyTurn(player.hp, false, false), 450);
      }
    }, 300);
  };

  // 2. ATAQUE PESADO (Pulso de Ruptura Cinético)
  const handleHeavyAttack = () => {
    if (isEnemyTurn) return;
    audio.playHeavyHit();
    triggerShake();
    setKaelAnim('attack');

    const isCrit = Math.random() < stats.critChance;
    const critMultiplier = isCrit ? 1.7 : 1.0;
    const heavyDamage = Math.floor(stats.atk * 1.5 * critMultiplier);

    const nextStagger = Math.min(100, enemyStagger + 45);
    setEnemyStagger(nextStagger);

    setTimeout(() => {
      setKaelAnim('idle');
      const nextEnemyHp = Math.max(0, enemy.hp - heavyDamage);
      setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
      setEnemyAnim('hit');
      showFloating(`-${heavyDamage}${isCrit ? ' (CRÍTICO!)' : ''}`, isCrit ? 'crit' : 'damage', 'enemy');

      setTimeout(() => setEnemyAnim('idle'), 400);

      setCombatLog(prev => [
        `Kael desferiu IMPACTO PESADO causando ${heavyDamage} de dano${isCrit ? ' [CRÍTICO!]' : ''}!`,
        ...prev,
      ]);

      if (nextEnemyHp <= 0) {
        checkVictoryOrNextPhase(nextEnemyHp);
      } else {
        if (nextStagger >= 100 && !isEnemyStaggered) {
          setIsEnemyStaggered(true);
          showFloating('RUPTURA DE POSTURA!', 'stagger', 'enemy');
          audio.playBossPhase();
        }
        setTimeout(() => handleEnemyTurn(player.hp, false, false), 450);
      }
    }, 350);
  };

  // 3. DEFENDER (Matriz de Escudo Photon)
  const handleDefend = () => {
    if (isEnemyTurn) return;
    audio.playShield();
    setIsDefending(true);
    setKaelAnim('defend');
    setFocus(f => Math.min(100, f + 25));
    showFloating('+25 FOCO & ESCUDO ATIVO', 'heal', 'kael');
    setCombatLog(prev => [`Kael ativou Matriz Defensiva. Danos absorvidos em 65% neste turno.`, ...prev]);

    setTimeout(() => {
      handleEnemyTurn(player.hp, true, false);
    }, 450);
  };

  // 4. ESQUIVAR (Salto de Fase Dimensional)
  const handleDodge = () => {
    if (isEnemyTurn) return;
    audio.playDodge();
    setIsDodging(true);
    setFocus(f => Math.min(100, f + 10));
    showFloating('ESQUIVA PREPARADA', 'dodge', 'kael');
    setCombatLog(prev => [`Kael calibrou os propulsores para Esquiva Perfeita contra o golpe inimigo.`, ...prev]);

    setTimeout(() => {
      handleEnemyTurn(player.hp, false, true);
    }, 400);
  };

  // 5. HABILIDADE: LÂMINA QUÂNTICA
  const handleQuantumBlade = () => {
    if (isEnemyTurn || focus < 35 || quantumCooldown > 0) return;
    audio.playQuantum();
    triggerShake();
    setFocus(f => f - 35);
    setQuantumCooldown(2);
    setKaelAnim('attack');

    const skillDamage = Math.floor(stats.atk * 2.1);
    showFloating('LÂMINA QUÂNTICA!', 'crit', 'kael');

    setTimeout(() => {
      setKaelAnim('idle');
      const nextEnemyHp = Math.max(0, enemy.hp - skillDamage);
      setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
      setEnemyAnim('hit');
      showFloating(`-${skillDamage} (CORTE PURO)`, 'crit', 'enemy');
      setTimeout(() => setEnemyAnim('idle'), 350);

      setCombatLog(prev => [
        `⚡ HABILIDADE: Lâmina Quântica perfurou a integridade dimensional de ${enemy.name} causando ${skillDamage} de dano!`,
        ...prev,
      ]);

      if (nextEnemyHp <= 0) {
        checkVictoryOrNextPhase(nextEnemyHp);
      } else {
        setTimeout(() => handleEnemyTurn(player.hp, false, false), 450);
      }
    }, 300);
  };

  // 6. HABILIDADE: CRONO-ESCUDO
  const handleCronoShield = () => {
    if (isEnemyTurn || focus < 40 || cronoCooldown > 0) return;
    audio.playShield();
    setFocus(f => f - 40);
    setCronoCooldown(3);
    setCronoshieldActive(true);
    showFloating('CRONO-ESCUDO ATIVO!', 'heal', 'kael');
    setCombatLog(prev => [
      `⌛ HABILIDADE: Crono-Escudo ativo! O próximo dano será convertido em 80% de regeneração de vida!`,
      ...prev,
    ]);
  };

  // 7. HABILIDADE: PULSO DE DESLOCAMENTO
  const handleDisplacementPulse = () => {
    if (isEnemyTurn || focus < 50 || pulseCooldown > 0) return;
    audio.playQuantum();
    triggerShake();
    setFocus(f => f - 50);
    setPulseCooldown(3);
    setEnemyStagger(100);
    setIsEnemyStaggered(true);
    setEnemyAnim('stagger');
    showFloating('ATORDOAMENTO INSTANTÂNEO!', 'stagger', 'enemy');
    setCombatLog(prev => [
      `🌀 HABILIDADE: Pulso de Deslocamento quebrou instantaneamente a estabilidade de fase de ${enemy.name}!`,
      ...prev,
    ]);
  };

  // 8. HABILIDADE SUPREMA: OVERDRIVE DA MATRIZ
  const handleOverdrive = () => {
    if (isEnemyTurn || focus < 100) return;
    audio.playBossPhase();
    triggerShake();
    setFocus(0);
    setKaelAnim('attack');

    const ultimateDamage = Math.floor(stats.atk * 3.4);
    showFloating('🔥 OVERDRIVE TOTAL DA MATRIZ!', 'crit', 'kael');

    setTimeout(() => {
      setKaelAnim('idle');
      const nextEnemyHp = Math.max(0, enemy.hp - ultimateDamage);
      setEnemy(prev => ({ ...prev, hp: nextEnemyHp }));
      setEnemyAnim('hit');
      showFloating(`-${ultimateDamage} (CATACLISMO QUÂNTICO)`, 'crit', 'enemy');
      setTimeout(() => setEnemyAnim('idle'), 450);

      setCombatLog(prev => [
        `💥 SUPREMA: Kael desencadeou o OVERDRIVE DA MATRIZ causando ${ultimateDamage} de dano cósmico puro!`,
        ...prev,
      ]);

      if (nextEnemyHp <= 0) {
        checkVictoryOrNextPhase(nextEnemyHp);
      } else {
        setTimeout(() => handleEnemyTurn(player.hp, false, false), 500);
      }
    }, 400);
  };

  // 9. PROTOCOLO DE SUPORTE ALIADO (LYRA / MARCUS)
  const handleCompanionSupport = () => {
    if (isEnemyTurn || companionCooldown > 0) return;
    audio.playCompanionSupport();
    setCompanionCooldown(3);

    if (selectedCompanion === 'LYRA') {
      const healAmt = 45;
      setPlayer(p => ({ ...p, hp: Math.min(stats.maxHp, p.hp + healAmt) }));
      setFocus(f => Math.min(100, f + 30));
      showFloating(`+${healAmt} HP (LYRA)`, 'heal', 'kael');
      setCombatLog(prev => [
        `📡 SUPORTE TÁTICO: Lyra injetou nanites restauradores (+${healAmt} HP e +30 Foco)!`,
        ...prev,
      ]);
    } else {
      const staggerAmt = 40;
      setEnemyStagger(s => Math.min(100, s + staggerAmt));
      showFloating(`+${staggerAmt}% POSTURA QUEBRADA!`, 'stagger', 'enemy');
      setCombatLog(prev => [
        `🛡️ SUPORTE TÁTICO: Marcus disparou salva balística pesada (+${staggerAmt}% de Quebra de Postura)!`,
        ...prev,
      ]);
    }
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100 font-mono select-none">
      <AtmosphericCanvas realm={realm} screenShake={screenShake} />
      <ProgressionHUD player={player} onNexusClick={onNexusClick} />

      {/* Floating Damage / Combat Feedback Numbers */}
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
        {floatingMessages.map(msg => (
          <div
            key={msg.id}
            className={`absolute animate-bounce text-sm sm:text-base md:text-xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${
              msg.target === 'kael' ? 'left-8 sm:left-24 md:left-40' : 'right-8 sm:right-24 md:right-40'
            } ${
              msg.type === 'crit'
                ? 'text-amber-300 scale-125'
                : msg.type === 'heal'
                ? 'text-emerald-300'
                : msg.type === 'dodge'
                ? 'text-cyan-300'
                : msg.type === 'combo'
                ? 'text-fuchsia-300'
                : msg.type === 'stagger'
                ? 'text-rose-400 scale-125'
                : 'text-rose-400'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Phase Transition Alert Banner */}
      {phaseAnnounced && (
        <div className="absolute top-16 left-0 right-0 z-40 bg-gradient-to-r from-rose-600/90 via-fuchsia-600/90 to-purple-600/90 py-2 sm:py-3 text-center shadow-2xl backdrop-blur-md animate-pulse border-y border-white/30">
          <p className="text-white font-black tracking-widest text-xs sm:text-sm md:text-base uppercase flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 animate-spin" />
            <span>{phaseAnnounced}</span>
            <Zap className="w-4 h-4 animate-spin" />
          </p>
        </div>
      )}

      {/* Main Combat Arena Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-2 sm:px-4 md:px-6 py-2 max-w-5xl mx-auto w-full overflow-y-auto min-h-0">
        {/* Top Health and Status Bars */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 bg-slate-950/85 p-2 sm:p-3 md:p-4 rounded-xl border border-cyan-500/30 backdrop-blur-md shadow-xl shrink-0">
          {/* Kael Info */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-cyan-300 text-[11px] sm:text-xs md:text-sm font-mono truncate">
                {player.name} (LVL {player.level})
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-300">
                {player.hp}/{stats.maxHp} HP
              </span>
            </div>
            {/* Player HP Bar */}
            <div className="w-full bg-slate-800 h-2.5 sm:h-3 rounded-full overflow-hidden border border-slate-700 mb-1.5 sm:mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${Math.max(0, (player.hp / stats.maxHp) * 100)}%` }}
              />
            </div>
            {/* Focus Bar */}
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-fuchsia-300 font-mono mb-0.5">
              <span>FOCO QUÂNTICO</span>
              <span>{focus}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1 sm:h-1.5 rounded-full overflow-hidden border border-fuchsia-900/60">
              <div
                className="bg-gradient-to-r from-fuchsia-600 to-pink-500 h-full transition-all duration-200"
                style={{ width: `${focus}%` }}
              />
            </div>
          </div>

          {/* Enemy Info */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-rose-400 text-[11px] sm:text-xs md:text-sm font-mono truncate max-w-[100px] sm:max-w-[140px] md:max-w-none">
                  {enemy.name}
                </span>
                {enemyMaxPhases > 1 && (
                  <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded font-bold">
                    F{enemyPhase}/{enemyMaxPhases}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-slate-300">{enemy.hp}/{enemy.maxHp} HP</span>
            </div>
            {/* Enemy HP Bar */}
            <div className="w-full bg-slate-800 h-2.5 sm:h-3 rounded-full overflow-hidden border border-slate-700 mb-1.5 sm:mb-2">
              <div
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 h-full transition-all duration-300"
                style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              />
            </div>
            {/* Stagger Bar */}
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-amber-300 font-mono mb-0.5">
              <span>POSTURA</span>
              <span>{enemyStagger}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1 sm:h-1.5 rounded-full overflow-hidden border border-amber-900/60">
              <div
                className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full transition-all duration-200"
                style={{ width: `${enemyStagger}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mid Arena: Avatars, Intent telegraph & confrontation aura */}
        <div className="flex flex-col items-center my-auto py-1 sm:py-2 shrink-0">
          {/* Enemy Intent Telegraph Banner */}
          <div className="mb-2 sm:mb-3 px-3 py-1 rounded-xl border border-rose-500/40 bg-rose-950/70 backdrop-blur-md flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-rose-300 max-w-full truncate shadow-md shadow-rose-950/50">
            <AlertTriangle className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-pulse text-amber-400 shrink-0" />
            <span className="font-bold shrink-0">INTENÇÃO:</span>
            <span className="text-white truncate">{enemyIntent.description}</span>
          </div>

          <div className="w-full flex items-center justify-between px-2 sm:px-6 md:px-16 min-h-[140px] sm:min-h-[170px] md:min-h-[190px]">
            {/* Kael Stance */}
            <div className="flex flex-col items-center scale-90 sm:scale-100 transition-transform">
              <KaelAvatar
                state={kaelAnim}
                skinId={player.currentSkin || 'skin-default'}
                equippedGear={player.equippedGear}
              />
              <div className="mt-1 sm:mt-2 flex flex-col items-center gap-1">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-cyan-300 bg-cyan-950/80 px-1.5 sm:px-2 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                  {isDefending ? '🛡️ DEFESA ATIVA' : isDodging ? '💨 ESQUIVA PREPARADA' : cronoshieldActive ? '⌛ CRONO-ESCUDO' : 'SISTEMAS PRONTOS'}
                </span>
              </div>
            </div>

            {/* VS Badge and Turn Counter */}
            <div className="text-center font-mono shrink-0 px-1">
              <span className="text-base sm:text-xl md:text-2xl font-black text-slate-600 tracking-widest">VS</span>
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1">TURNO {turn}</p>
              {isEnemyTurn && (
                <span className="inline-block mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-rose-400 font-bold animate-pulse">
                  TURNO INIMIGO...
                </span>
              )}
            </div>

            {/* Enemy Stance with custom silhouette and state */}
            <div className="flex flex-col items-center scale-90 sm:scale-100 transition-transform">
              <FragmentadoAvatar
                state={enemyAnim}
                isBoss={enemyMaxPhases > 1 || Boolean(enemy.boss)}
                bossPhase={enemyPhase}
                bossType={enemy.bossType}
                enemyName={enemy.name}
              />
              <div className="mt-1 sm:mt-2 flex flex-col items-center gap-1">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-fuchsia-300 bg-fuchsia-950/80 px-1.5 sm:px-2 py-0.5 rounded border border-fuchsia-500/30 whitespace-nowrap">
                  {isEnemyStaggered ? '💫 ATORDOADO' : enemyMaxPhases > 1 ? '👑 ENTIDADE CHEFE' : 'ENTIDADE ANÔMALA'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Actions & Battle Log Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 font-mono shrink-0">
          {/* Action Buttons Panel */}
          <div className="md:col-span-8 flex flex-col gap-1.5 sm:gap-2">
            {/* Primary Actions (Fast, Heavy, Defend, Dodge) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 bg-slate-900/80 p-2 sm:p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
              <button
                disabled={isEnemyTurn}
                onClick={handleFastAttack}
                className="min-h-[48px] py-2 sm:py-2.5 px-1.5 sm:px-2 bg-gradient-to-b from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 active:scale-95 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] touch-manipulation cursor-pointer"
                title="Ataque ágil com sabre de plasma (+20 Foco, acumula combo)"
              >
                <Sword className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>RÁPIDO</span>
              </button>

              <button
                disabled={isEnemyTurn}
                onClick={handleHeavyAttack}
                className="min-h-[48px] py-2 sm:py-2.5 px-1.5 sm:px-2 bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] touch-manipulation cursor-pointer"
                title="Impacto pesado cinético (+45 atordoamento na postura inimiga)"
              >
                <Flame className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>PESADO</span>
              </button>

              <button
                disabled={isEnemyTurn}
                onClick={handleDefend}
                className="min-h-[48px] py-2 sm:py-2.5 px-1.5 sm:px-2 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-95 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] touch-manipulation cursor-pointer"
                title="Escudo de fótons (-65% dano recebido, recupera +25 foco)"
              >
                <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>DEFENDER</span>
              </button>

              <button
                disabled={isEnemyTurn}
                onClick={handleDodge}
                className="min-h-[48px] py-2 sm:py-2.5 px-1.5 sm:px-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 disabled:opacity-40 text-white font-bold rounded-lg shadow transition flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] touch-manipulation cursor-pointer"
                title="Salto dimensional de fase (Permite contra-ataque sem sofrer dano)"
              >
                <Wind className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>ESQUIVAR</span>
              </button>
            </div>

            {/* Matrix Skills (Quantum Blade, Crono-Shield, Displacement Pulse, Overdrive) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 bg-slate-900/80 p-2 sm:p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
              {/* Skill 1: Quantum Blade */}
              <button
                disabled={isEnemyTurn || focus < 35 || quantumCooldown > 0}
                onClick={handleQuantumBlade}
                className="min-h-[42px] py-1.5 px-1.5 sm:px-2 bg-cyan-950/80 hover:bg-cyan-900 active:scale-95 border border-cyan-500/40 disabled:opacity-40 text-white rounded-lg transition flex flex-col items-center justify-center text-[9px] sm:text-[10px] relative overflow-hidden touch-manipulation cursor-pointer"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-cyan-300">
                  <Zap className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span>LÂMINA</span>
                </div>
                <span className="text-[8px] sm:text-[9px] text-cyan-400">35 Foco</span>
                {quantumCooldown > 0 && (
                  <span className="absolute inset-0 bg-slate-950/90 flex items-center justify-center text-[9px] text-cyan-300 font-bold">
                    ({quantumCooldown}T)
                  </span>
                )}
              </button>

              {/* Skill 2: Crono-Shield */}
              <button
                disabled={isEnemyTurn || focus < 40 || cronoCooldown > 0}
                onClick={handleCronoShield}
                className="min-h-[42px] py-1.5 px-1.5 sm:px-2 bg-emerald-950/80 hover:bg-emerald-900 active:scale-95 border border-emerald-500/40 disabled:opacity-40 text-white rounded-lg transition flex flex-col items-center justify-center text-[9px] sm:text-[10px] relative overflow-hidden touch-manipulation cursor-pointer"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-emerald-300">
                  <Activity className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span>ESCUDO</span>
                </div>
                <span className="text-[8px] sm:text-[9px] text-emerald-400">40 Foco</span>
                {cronoCooldown > 0 && (
                  <span className="absolute inset-0 bg-slate-950/90 flex items-center justify-center text-[9px] text-emerald-300 font-bold">
                    ({cronoCooldown}T)
                  </span>
                )}
              </button>

              {/* Skill 3: Displacement Pulse */}
              <button
                disabled={isEnemyTurn || focus < 50 || pulseCooldown > 0}
                onClick={handleDisplacementPulse}
                className="min-h-[42px] py-1.5 px-1.5 sm:px-2 bg-purple-950/80 hover:bg-purple-900 active:scale-95 border border-purple-500/40 disabled:opacity-40 text-white rounded-lg transition flex flex-col items-center justify-center text-[9px] sm:text-[10px] relative overflow-hidden touch-manipulation cursor-pointer"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-purple-300">
                  <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span>PULSO</span>
                </div>
                <span className="text-[8px] sm:text-[9px] text-purple-400">50 Foco</span>
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
                className={`min-h-[42px] py-1.5 px-1.5 sm:px-2 border rounded-lg transition flex flex-col items-center justify-center text-[9px] sm:text-[10px] relative overflow-hidden touch-manipulation cursor-pointer active:scale-95 ${
                  focus >= 100
                    ? 'bg-gradient-to-r from-rose-600 via-fuchsia-600 to-amber-500 border-amber-400 text-white font-black animate-pulse shadow-lg shadow-fuchsia-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-500 opacity-50'
                }`}
              >
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span>OVERDRIVE</span>
                </div>
                <span className="text-[8px] sm:text-[9px]">100% FOCO</span>
              </button>
            </div>

            {/* Companion Support Protocol Banner */}
            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-slate-900/90 rounded-xl border border-emerald-500/30 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-slate-400">SUPORTE ALIADO:</span>
                <button
                  onClick={() => setSelectedCompanion(selectedCompanion === 'LYRA' ? 'MARCUS' : 'LYRA')}
                  className="font-bold text-emerald-300 hover:text-white transition underline cursor-pointer"
                  title="Clique para alternar aliado de suporte"
                >
                  {selectedCompanion === 'LYRA' ? 'LYRA (+45 HP)' : 'MARCUS (+40% STAGGER)'}
                </button>
              </div>
              <button
                disabled={isEnemyTurn || companionCooldown > 0}
                onClick={handleCompanionSupport}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase transition flex items-center gap-1 ${
                  companionCooldown === 0
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <span>CHAMAR SUPORTE</span>
                {companionCooldown > 0 && <span>({companionCooldown}T)</span>}
              </button>
            </div>
          </div>

          {/* Combat Log */}
          <div className="md:col-span-4 bg-slate-950/90 border border-slate-800 p-2 sm:p-2.5 rounded-xl h-24 sm:h-28 md:h-auto overflow-y-auto text-[10px] sm:text-[11px] text-slate-300 space-y-1">
            <div className="text-[9px] sm:text-[10px] text-cyan-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>LOG TÁTICO</span>
              <span className="text-[8px] sm:text-[9px] text-slate-500">TURNO {turn}</span>
            </div>
            {combatLog.map((log, idx) => (
              <p key={idx} className={idx === 0 ? 'text-cyan-300 font-semibold leading-tight' : 'opacity-70 leading-tight text-[9px] sm:text-[10px]'}>
                &gt; {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
