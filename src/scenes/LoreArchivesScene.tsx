import React, { useState } from 'react';
import {
  Database,
  ArrowLeft,
  FileText,
  Radio,
  Sparkles,
  ShieldAlert,
  Terminal,
  Lock
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

interface LoreEntry {
  id: string;
  code: string;
  title: string;
  category: 'HISTÓRIA' | 'ANOMALIA' | 'PESQUISA';
  unlockedLevel: number;
  content: string;
}

const LORE_DATA: LoreEntry[] = [
  {
    id: 'lore-01',
    code: 'DOC-2147-ALPHA',
    title: 'A Gênese de Nova Arcádia',
    category: 'HISTÓRIA',
    unlockedLevel: 1,
    content:
      'Nova Arcádia foi erguida como o pináculo da civilização moderna. Seus reatores de fusão e condensadores táquionicos permitiam fornecimento ilimitado de energia para mais de 18 milhões de habitantes. O projeto Ruptura era inicialmente uma tentativa de extrair vácuo quântico para estabilizar a rede planetária.',
  },
  {
    id: 'lore-02',
    code: 'ENT-089-RASGADOR',
    title: 'Biologia das Criaturas Fragmentadas',
    category: 'ANOMALIA',
    unlockedLevel: 1,
    content:
      'As entidades denominadas "Rasgadores" não são formas de vida biológica convencionais. Trata-se de ecos de matéria carbonizada e geometria quântica animada por campos gravitacionais oscilantes. Elas atacam qualquer fonte de sinal neural estável, tentando assimilar consciência para evitar desintegração.',
  },
  {
    id: 'lore-03',
    code: 'LAB-SEC-04',
    title: 'Protocolo de Contenção Omega',
    category: 'PESQUISA',
    unlockedLevel: 2,
    content:
      'Quando os três reatores principais entraram em ressonância simultânea em 12 de Outubro de 2147, o tecido do continuum espaço-tempo se rompeu em uma fenda de 40 quilômetros cúbicos. Os pesquisadores de nível 4 descobriram que as realidades vizinhas estavam sendo puxadas para o mesmo ponto nodal.',
  },
  {
    id: 'lore-04',
    code: 'ARC-001-ARQUITETO',
    title: 'A Mente por trás da Convergência',
    category: 'ANOMALIA',
    unlockedLevel: 3,
    content:
      'Registros criptografados recuperados indicam que o Arquiteto não provocou a colisão das dimensões por malevolência. Sua tese postulava que todas as realidades estavam fadadas à morte térmica universal, e que a fusão forçada em um único ponto dimensional (o NEXUS) seria a única chance de sobrevivência eterna.',
  },
];

export const LoreArchivesScene: React.FC<{
  player: PlayerState;
  onBackToNexus: () => void;
}> = ({ player, onBackToNexus }) => {
  const [selectedLore, setSelectedLore] = useState<LoreEntry>(LORE_DATA[0]);

  const handleSelect = (lore: LoreEntry) => {
    audio.playClick();
    setSelectedLore(lore);
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-100 font-mono">
      <AtmosphericCanvas />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto space-y-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <button
            onClick={onBackToNexus}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center gap-2 text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR AO NEXUS</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="tracking-widest">BANCO DE DADOS CLASSIFICADO</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* List column */}
          <div className="md:col-span-5 space-y-2.5">
            {LORE_DATA.map(item => {
              const unlocked = player.level >= item.unlockedLevel;
              const isSelected = selectedLore.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => unlocked && handleSelect(item)}
                  className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-400 bg-blue-950/70 shadow-lg shadow-blue-500/20'
                      : unlocked
                      ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
                      : 'border-slate-900 bg-slate-950/60 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-blue-400 font-bold">{item.code}</span>
                    <h3 className="font-bold text-xs text-white">
                      {unlocked ? item.title : 'ARQUIVO CRIPTOGRAFADO'}
                    </h3>
                    <span className="text-[9px] text-slate-400">{item.category}</span>
                  </div>

                  {unlocked ? (
                    <FileText className="w-4 h-4 text-blue-300" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reader column */}
          <div className="md:col-span-7 bg-slate-900/90 border border-blue-500/30 p-6 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-blue-400 font-bold">{selectedLore.code}</span>
                <h2 className="text-lg font-black text-white mt-0.5">{selectedLore.title}</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {selectedLore.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {selectedLore.content}
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>RUPTURA 2.0 • PROTOCOLO DE DESCRIPTOGRAFIA</span>
              <span>AUTORIZADO: EXPLORADOR KAEL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
