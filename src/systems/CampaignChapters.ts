import { CampaignPhase } from '../scenes/CampaignMapScene';

export interface CampaignChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  loreIntro: string;
  recommendedLevel: number;
  unlockedByDefault: boolean;
  phases: CampaignPhase[];
  chapterBossReward: {
    skinId?: string;
    itemId: string;
    credits: number;
    matrixCells: number;
  };
}

export const CAMPAIGN_CHAPTERS: CampaignChapter[] = [
  {
    id: 'chapter-01',
    chapterNumber: 1,
    title: 'A Origem da Ruptura',
    subtitle: 'O Primeiro Pulso Dimensional e a Queda de Nova Arcádia',
    loreIntro: 'Em 2147, os transmissores quânticos do Distrito Central entraram em ressonância destrutiva. O explorador Kael foi despachado para averiguar as primeiras anomalias na fronteira metropolitana.',
    recommendedLevel: 1,
    unlockedByDefault: true,
    chapterBossReward: {
      skinId: 'skin-tactical',
      itemId: 'wpn-02',
      credits: 200,
      matrixCells: 3,
    },
    phases: [
      { id: 'fase-01', title: 'Primeiro Sinal', location: 'Perímetro de Impacto', summary: 'Kael detecta o primeiro pulso dimensional e enfrenta uma anomalia rasgadora.', enemy: 'Rasgador', hp: 75, atk: 14, def: 5 },
      { id: 'fase-02', title: 'Nova Arcádia', location: 'Distrito Central', summary: 'Investigue a metrópole isolada e rastreie a origem dos sinais anômalos.', enemy: 'Eco de Arcádia', hp: 95, atk: 16, def: 7 },
      { id: 'fase-03', title: 'O Rasgador Alfa', location: 'Fenda Norte', summary: 'A entidade que perseguiu Kael revela mandíbulas energéticas e alta velocidade.', enemy: 'Rasgador Alfa', hp: 120, atk: 19, def: 8, boss: true },
      { id: 'fase-04', title: 'Distrito Industrial', location: 'Complexo de Energia', summary: 'Reative os sistemas de contenção em uma zona de fábricas instáveis.', enemy: 'Sentinela Industrial', hp: 135, atk: 20, def: 10 },
    ],
  },
  {
    id: 'chapter-02',
    chapterNumber: 2,
    title: 'A Expansão da Fenda',
    subtitle: 'As Instalações Perdidas e os Guardiões do Complexo Beta',
    loreIntro: 'Com o colapso dos setores externos, Kael adentra as estações profundas de transporte e pesquisa de Nova Arcádia, onde cientistas tentaram domesticar matéria de dobra espacial.',
    recommendedLevel: 3,
    unlockedByDefault: false,
    chapterBossReward: {
      skinId: 'skin-elite',
      itemId: 'arm-03',
      credits: 400,
      matrixCells: 5,
    },
    phases: [
      { id: 'fase-05', title: 'A Torre de Vigilância', location: 'Setor Elevado Beta', summary: 'Um autômato armado com canhão de feixe bloqueia a passagem aos laboratórios.', enemy: 'Vigia Industrial', hp: 155, atk: 22, def: 11 },
      { id: 'fase-06', title: 'Estação Abandonada', location: 'Estação Ômega', summary: 'Siga os registros deixados pela equipe desaparecida em túneis de hipermagnéticos.', enemy: 'Predador da Estação', hp: 180, atk: 25, def: 13 },
      { id: 'fase-07', title: 'Centro de Pesquisa', location: 'Laboratório de Contenção', summary: 'Descubra os experimentos secretos com antimatéria que antecederam o desastre.', enemy: 'Protótipo Instável', hp: 205, atk: 27, def: 14 },
      { id: 'fase-08', title: 'Guardião Industrial', location: 'Núcleo de Fabricação', summary: 'Enfrente o colossal robô guardião alimentado pelo reator do complexo industrial.', enemy: 'Guardião Industrial', hp: 250, atk: 30, def: 16, boss: true },
    ],
  },
  {
    id: 'chapter-03',
    chapterNumber: 3,
    title: 'A Convergência Primordial',
    subtitle: 'O Marco Zero e a Consciência do Multiverso',
    loreIntro: 'Todas as realidades convergem para um único ponto de densidade infinita. Além do véu quântico, O Arquiteto aguarda para remodelar toda a existência sob sua vontade absoluta.',
    recommendedLevel: 5,
    unlockedByDefault: false,
    chapterBossReward: {
      skinId: 'skin-ascendant',
      itemId: 'cor-04',
      credits: 800,
      matrixCells: 8,
    },
    phases: [
      { id: 'fase-09', title: 'A Grande Ruptura', location: 'Marco Zero', summary: 'Atravesse o vórtice onde tempo e espaço se desfazem em tempestades de táquions.', enemy: 'Avatar da Ruptura', hp: 320, atk: 35, def: 18, boss: true },
      { id: 'fase-10', title: 'O Arquiteto', location: 'Além do Véu Quântico', summary: 'Confronte a entidade primordial e decida o destino de todas as linhas temporais.', enemy: 'O Arquiteto', hp: 420, atk: 42, def: 22, boss: true },
    ],
  },
];
