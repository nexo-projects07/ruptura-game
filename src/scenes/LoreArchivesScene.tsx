import React, { useState } from 'react';
import {
  Database,
  ArrowLeft,
  FileText,
  Radio,
  Sparkles,
  ShieldAlert,
  Terminal,
  Lock,
  Skull,
  Layers,
  BookOpen
} from 'lucide-react';
import { AtmosphericCanvas } from '../components/AtmosphericCanvas';
import { ProgressionHUD } from '../components/ProgressionHUD';
import { PlayerState } from '../types/game';
import { audio } from '../systems/AudioEngine';

export type LoreCategory = 'TODOS' | 'HISTÓRIA' | 'ANOMALIA' | 'PESQUISA' | 'CHEFES SECRETOS' | 'TRANSMISSÕES';

interface LoreEntry {
  id: string;
  code: string;
  title: string;
  category: 'HISTÓRIA' | 'ANOMALIA' | 'PESQUISA' | 'CHEFES SECRETOS' | 'TRANSMISSÕES';
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
      'Nova Arcádia foi erguida como o pináculo da civilização moderna. Seus reatores de fusão e condensadores táquionicos permitiam fornecimento ilimitado de energia para mais de 18 milhões de habitantes.\n\nO projeto Ruptura era inicialmente uma tentativa de extrair vácuo quântico para estabilizar a rede planetária, mas a frequência harmônica colapsou a constante de Planck, iniciando a sobreposição dimensional.',
  },
  {
    id: 'lore-02',
    code: 'ENT-089-RASGADOR',
    title: 'Biologia das Criaturas Fragmentadas',
    category: 'ANOMALIA',
    unlockedLevel: 1,
    content:
      'As entidades denominadas "Rasgadores" não são formas de vida biológica convencionais. Trata-se de ecos de matéria carbonizada e geometria quântica animada por campos gravitacionais oscilantes.\n\nElas atacam qualquer fonte de sinal neural estável, tentando assimilar consciência para evitar desintegração nos bolsões de entropia.',
  },
  {
    id: 'lore-03',
    code: 'LAB-SEC-04',
    title: 'Protocolo de Contenção Omega',
    category: 'PESQUISA',
    unlockedLevel: 2,
    content:
      'Quando os três reatores principais entraram em ressonância simultânea em 12 de Outubro de 2147, o tecido do continuum espaço-tempo se rompeu em uma fenda de 40 quilômetros cúbicos.\n\nOs pesquisadores de nível 4 descobriram que as realidades vizinhas estavam sendo puxadas para o mesmo ponto nodal — a gênese do que hoje chamamos de Nexus.',
  },
  {
    id: 'lore-04',
    code: 'ARC-001-ARQUITETO',
    title: 'A Mente por trás da Convergência',
    category: 'ANOMALIA',
    unlockedLevel: 3,
    content:
      'Registros criptografados recuperados indicam que o Arquiteto não provocou a colisão das dimensões por malevolência.\n\nSua tese postulava que todas as realidades estavam fadadas à morte térmica universal, e que a fusão forçada em um único ponto dimensional (o NEXUS) seria a única chance de sobrevivência eterna.',
  },
  {
    id: 'lore-05',
    code: 'SB-01-CARTOGRAFO',
    title: 'O Cartógrafo do Vazio — Coordenadas da Fenda Perdida',
    category: 'CHEFES SECRETOS',
    unlockedLevel: 2,
    content:
      'REGISTRO DA NAVE-EXPEDIÇÃO CÓSMICA:\n"Ele não possui carne, nem sangue. O Cartógrafo é uma inteligência autônoma gerada pelas primeiras ondas de choque da Ruptura.\n\nEle mapeia galáxias mortas e descarta as linhas do tempo que considera redundantes. Empunha lâminas estelares capazes de cortar a malha do espaço, saltando entre planos instantaneamente."',
  },
  {
    id: 'lore-06',
    code: 'SB-02-SENTINELA',
    title: 'A Sentinela de Épsilon — O Colosso de Antimatéria',
    category: 'CHEFES SECRETOS',
    unlockedLevel: 3,
    content:
      'RELATÓRIO DO ENGENHEIRO-CHEFE:\n"A Sentinela foi construída para guardar o cofre de antimatéria do Nexus Primordial. Composta por placas impenetráveis de titânio enriquecido e alimentada por um reator de fusão instável.\n\nSeus canhões cinéticos disparam pulsos de deslocamento gravitacional. Qualquer um que tente perfurar sua blindagem sem quebrar sua postura será esmagado pela onda de choque."',
  },
  {
    id: 'lore-07',
    code: 'SB-03-ECO',
    title: 'O Eco Primordial — O Paradoxo de Kael',
    category: 'CHEFES SECRETOS',
    unlockedLevel: 4,
    content:
      'TRANSMISSÃO DO ESPELHO QUÂNTICO (AUDIO RESTAURADO):\n"Kael, o que você vê no espelho não é um impostor. É você mesmo, na primeira iteração onde você aceitou o convite do Arquiteto.\n\nEle possui todas as suas disciplinas: o corte ágil da lâmina quântica, o crono-escudo e o pulso de deslocamento. Para derrotá-lo, você terá que superar o seu próprio reflexo."',
  },
  {
    id: 'lore-08',
    code: 'TRANS-LYRA-01',
    title: 'Transmissão de Lyra: O Segredo do Traje de Fase',
    category: 'TRANSMISSÕES',
    unlockedLevel: 1,
    content:
      'COMUNICAÇÃO DE LYRA (NAVIGATORA):\n"Kael, se você estiver ouvindo isso, seu traje de explorador contém um micro-reator de sincronização táquionica.\n\nAo executar uma esquiva no instante exato do golpe inimigo, os capacitores entram em fase reversa, concedendo uma fração de segundo de invulnerabilidade total. Use isso contra golpes pesados!"',
  },
  {
    id: 'lore-09',
    code: 'DIARIO-VANE-02',
    title: 'Diário do Dr. Vane: Os Cinco Reinos do Multiverso',
    category: 'TRANSMISSÕES',
    unlockedLevel: 2,
    content:
      'ANOTAÇÕES PESSOAIS DE VANE:\n"O Nexus não conecta o nada. Ele atua como âncora para cinco realidades fundamentais:\n1. Alpha (Nova Arcádia Urbana)\n2. Beta (Complexo Industrial Derretido)\n3. Gamma (Marco Zero da Fenda)\n4. Épsilon (O Berço de Antimatéria)\n5. Ômega (O Labirinto do Espelho Quântico)\n\nSe estabilizarmos os cinco núcleos, a humanidade sobreviverá à convergência."',
  },
];

export const LoreArchivesScene: React.FC<{
  player: PlayerState;
  onBackToNexus: () => void;
}> = ({ player, onBackToNexus }) => {
  const [selectedCategory, setSelectedCategory] = useState<LoreCategory>('TODOS');
  const [selectedLore, setSelectedLore] = useState<LoreEntry>(LORE_DATA[0]);

  const categories: LoreCategory[] = ['TODOS', 'HISTÓRIA', 'ANOMALIA', 'PESQUISA', 'CHEFES SECRETOS', 'TRANSMISSÕES'];

  const filteredLore = LORE_DATA.filter(item => {
    if (selectedCategory === 'TODOS') return true;
    return item.category === selectedCategory;
  });

  const handleSelect = (lore: LoreEntry) => {
    audio.playClick();
    setSelectedLore(lore);
  };

  const handleFilterChange = (cat: LoreCategory) => {
    audio.playClick();
    setSelectedCategory(cat);
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-y-auto bg-slate-950 text-slate-100 font-mono">
      <AtmosphericCanvas realm="realm-gamma" />
      <ProgressionHUD player={player} onNexusClick={onBackToNexus} />

      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/30 pb-3">
          <button
            onClick={onBackToNexus}
            className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-400 active:scale-95 text-slate-300 hover:text-white flex items-center gap-1.5 sm:gap-2 text-xs transition touch-manipulation cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR AO NEXUS</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="tracking-widest text-[11px] sm:text-xs">ARQUIVOS & TRANSMISSÕES DO NEXUS</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition whitespace-nowrap touch-manipulation cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* List column */}
          <div className="md:col-span-5 space-y-2 max-h-[360px] md:max-h-[460px] overflow-y-auto pr-1">
            {filteredLore.map(item => {
              const unlocked = player.level >= item.unlockedLevel;
              const isSelected = selectedLore.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => unlocked && handleSelect(item)}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border text-left transition flex items-center justify-between touch-manipulation cursor-pointer ${
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
                      {unlocked ? item.title : 'REGISTRO CRIPTOGRAFADO'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400">{item.category}</span>
                      {!unlocked && (
                        <span className="text-[9px] text-amber-400">Requer Nível {item.unlockedLevel}</span>
                      )}
                    </div>
                  </div>

                  {unlocked ? (
                    item.category === 'CHEFES SECRETOS' ? (
                      <Skull className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : item.category === 'TRANSMISSÕES' ? (
                      <Radio className="w-4 h-4 text-cyan-300 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-300 shrink-0" />
                    )
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reader column */}
          <div className="md:col-span-7 bg-slate-900/90 border border-blue-500/30 p-5 sm:p-6 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-blue-400 font-bold">{selectedLore.code}</span>
                <h2 className="text-base sm:text-lg font-black text-white mt-0.5">{selectedLore.title}</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {selectedLore.category}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light whitespace-pre-line max-h-[300px] overflow-y-auto">
              {selectedLore.content}
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>PROTOCOLO DE DESCRIPTOGRAFIA</span>
              <span>AUTORIZADO: EXPLORADOR KAEL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
