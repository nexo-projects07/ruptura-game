import React, { useState } from 'react';
import { ShieldAlert, Zap, Compass, Swords, ArrowRight, MessageSquare, AlertTriangle, Shield, Award } from 'lucide-react';
import { FragmentadoAvatar } from './FragmentadoAvatar';
import { SecretBossConfig, PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

export interface TacticalChoice {
  id: string;
  label: string;
  flavorText: string;
  buffName: string;
  effectType: 'BONUS_DODGE' | 'INITIAL_DAMAGE' | 'INITIAL_STAGGER' | 'BONUS_DEF' | 'FOCUS_MAX';
  effectValue: number;
}

interface BossConfrontationModalProps {
  boss: SecretBossConfig;
  player: PlayerState;
  onConfirmBattle: (choice: TacticalChoice) => void;
  onCancel: () => void;
}

export const BossConfrontationModal: React.FC<BossConfrontationModalProps> = ({
  boss,
  player,
  onConfirmBattle,
  onCancel,
}) => {
  // Generate boss-specific dialogue and tactical options
  const isCartografo = boss.id === 'sb-cartografo';
  const isSentinela = boss.id === 'sb-sentinela';
  const isEco = boss.id === 'sb-eco-primordial';

  let bossSpeech = '“Sua linha do tempo é uma anomalia não autorizada. O Nexus requer o colapso desta variável.”';
  let choices: TacticalChoice[] = [];

  if (isCartografo) {
    bossSpeech =
      '“Eu tracei dez mil futuros para Nova Arcádia, Kael. Em nenhum deles você escapa da tesoura do Vazio. Permita que sua realidade se desdobre em pó cósmico.”';
    choices = [
      {
        id: 'carto-1',
        label: 'Calibrar Frequência Estelar com o Visor',
        flavorText: '“Seus saltos de fase obedecem a um padrão harmônico. Meus sensores já registraram suas coordenadas.”',
        buffName: '+20% Chance de Esquiva Perfeita',
        effectType: 'BONUS_DODGE',
        effectValue: 0.2,
      },
      {
        id: 'carto-2',
        label: 'Disparo de Pulso Quântico Imediato',
        flavorText: '“Menos cálculos, mais impacto. Golpeie antes que ele conclua o primeiro mapa dimensional.”',
        buffName: 'Chefe inicia com 60 de Dano de Ruptura',
        effectType: 'INITIAL_DAMAGE',
        effectValue: 60,
      },
      {
        id: 'carto-3',
        label: 'Sincronizar Traje com a Ressonância do Vazio',
        flavorText: '“Absorva a estática da fenda para sobrecarregar sua reserva de energia tática.”',
        buffName: 'Kael inicia com 100% de Foco Máximo',
        effectType: 'FOCUS_MAX',
        effectValue: 100,
      },
    ];
  } else if (isSentinela) {
    bossSpeech =
      '“PROTOCOLO DE CONTENÇÃO EPSILON ATIVADO. INTRUSO BIOLÓGICO NÃO AUTORIZADO. BLINDAGEM DE TITÂNIO E MATRIZ ANTIMATÉRIA REATIVAS EM CAPACIDADE MÁXIMA.”';
    choices = [
      {
        id: 'sent-1',
        label: 'Disparar PEM nas Placas de Blindagem',
        flavorText: '“Os capacitores laterais estão expostos. Provoque um curto-circuito na postura da máquina.”',
        buffName: 'Chefe inicia com 40% de Atordoamento (Stagger)',
        effectType: 'INITIAL_STAGGER',
        effectValue: 40,
      },
      {
        id: 'sent-2',
        label: 'Reforçar Armadura com Liga de Chumbo de Arcádia',
        flavorText: '“Os canhões da Sentinela disparam feixes de antimatéria pesada. É vital suportar o impacto.”',
        buffName: '+16 de Defesa em combate',
        effectType: 'BONUS_DEF',
        effectValue: 16,
      },
      {
        id: 'sent-3',
        label: 'Foco na Articulação Central do Reator',
        flavorText: '“Perfure a grelha de ventilação frontal para comprometer o reator antes do primeiro disparo.”',
        buffName: 'Chefe inicia com 75 de Dano de Ruptura',
        effectType: 'INITIAL_DAMAGE',
        effectValue: 75,
      },
    ];
  } else {
    // Eco Primordial
    bossSpeech =
      '“Eu sou a escolha que você não fez em 2147. Eu sou o Kael que fundiu a mente ao Arquiteto. Venha, encare o espelho que devorou todas as nossas esperanças.”';
    choices = [
      {
        id: 'eco-1',
        label: 'Aceitar as Memórias da Linha Temporal Original',
        flavorText: '“Não fuja do passado. Integre o choque dimensional para despertar a ressonância total do foco.”',
        buffName: 'Kael inicia com 100% de Foco e +15% Esquiva',
        effectType: 'BONUS_DODGE',
        effectValue: 0.15,
      },
      {
        id: 'eco-2',
        label: 'Sobrecarga de Matriz nas Lâminas Espelhadas',
        flavorText: '“Se o Eco usa as mesmas técnicas que eu, ele compartilhará da mesma vulnerabilidade de fase.”',
        buffName: 'Chefe inicia com 90 de Dano de Ruptura',
        effectType: 'INITIAL_DAMAGE',
        effectValue: 90,
      },
      {
        id: 'eco-3',
        label: 'Erguer Barreira de Refração Mental',
        flavorText: '“Isole a interface neural contra as interferências do Arquiteto.”',
        buffName: '+20 de Defesa e 30% Postura do Inimigo',
        effectType: 'INITIAL_STAGGER',
        effectValue: 30,
      },
    ];
  }

  const [selectedChoice, setSelectedChoice] = useState<TacticalChoice>(choices[0]);

  const handleSelectChoice = (c: TacticalChoice) => {
    audio.playClick();
    setSelectedChoice(c);
  };

  const handleConfirm = () => {
    audio.playBossPhase();
    onConfirmBattle(selectedChoice);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-300 font-mono">
      <div className="bg-slate-900 border-2 border-rose-500/50 p-4 sm:p-6 md:p-8 rounded-2xl max-w-3xl w-full shadow-2xl relative space-y-4 sm:space-y-6 max-h-[95vh] overflow-y-auto">
        {/* Top classified banner */}
        <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-bold tracking-wider">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>TRANSMISSÃO DIRETA • PROTOCOLO DE CONFRONTO</span>
          </div>
          <span className="text-[10px] sm:text-xs text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40 font-bold">
            AMEAÇA CLASSIFICADA
          </span>
        </div>

        {/* Boss presentation & Silhouette */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="md:col-span-4 flex justify-center py-2">
            <FragmentadoAvatar enemyName={boss.name} isBoss={true} bossPhase={1} state="telegraph" />
          </div>
          <div className="md:col-span-8 space-y-2">
            <span className="text-[10px] text-cyan-400 tracking-widest block font-bold">
              {boss.realmId.toUpperCase()} • {boss.title}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">{boss.name}</h2>
            <div className="p-3 bg-slate-900/90 border-l-4 border-rose-500 rounded text-xs text-slate-200 italic leading-relaxed">
              {bossSpeech}
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-300">
                Vida: {boss.enemyStats.hp} HP
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                Ataque: {boss.enemyStats.atk} ATK
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-fuchsia-300">
                Fases de Combate: {boss.enemyStats.maxPhases}
              </span>
            </div>
          </div>
        </div>

        {/* Strategic Choices Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-bold">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>ESCOLHA SUA RESPOSTA TÁTICA / MODIFICADOR DE COMBATE:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {choices.map(c => {
              const isSelected = selectedChoice.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectChoice(c)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[120px] touch-manipulation cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/70 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{c.label}</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 italic line-clamp-3 leading-snug">
                      {c.flavorText}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-cyan-300 font-bold">
                    ⚡ {c.buffName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Buff Feedback Box */}
        <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyan-300">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>VANTAGEM APLICADA: <strong>{selectedChoice.buffName}</strong></span>
          </div>
          <span className="text-[10px] text-slate-400">Ativa no 1º turno</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              audio.playClick();
              onCancel();
            }}
            className="flex-1 min-h-[44px] py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition touch-manipulation cursor-pointer"
          >
            RECUAR AO NEXUS
          </button>
          <button
            onClick={handleConfirm}
            className="flex-2 min-h-[44px] py-2.5 px-5 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 touch-manipulation cursor-pointer"
          >
            <Swords className="w-4 h-4" />
            <span>ENGATILHAR COMBATE TÁTICO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
