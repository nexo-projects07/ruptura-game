import type { CampaignInvasionDefinition, ExplorerId } from '../types/game';
import type { CampaignPhase } from '../scenes/CampaignMapScene';

export interface CampaignChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  loreIntro: string;
  recommendedLevel: number;
  unlockedByDefault: boolean;
  protagonistId: ExplorerId;
  legacyFinalPhaseId?: string;
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
    protagonistId: 'kael',
    legacyFinalPhaseId: 'fase-04',
    chapterBossReward: {
      skinId: 'skin-tactical',
      itemId: 'wpn-02',
      credits: 200,
      matrixCells: 3,
    },
    phases: [
      { id: 'fase-01', title: 'Primeiro Sinal', location: 'Perímetro de Impacto', summary: 'Kael detecta o primeiro pulso dimensional e enfrenta uma anomalia rasgadora.', enemy: 'Rasgador', hp: 75, atk: 14, def: 5 },
      { id: 'fase-02', title: 'Nova Arcádia', location: 'Distrito Central', summary: 'Investigue a metrópole isolada e rastreie a origem dos sinais anômalos.', enemy: 'Eco de Arcádia', hp: 95, atk: 16, def: 7, activityType: 'DECODE', activityObjective: 'Ajuste o receptor até sintonizar a frequência do primeiro pulso.', targetFrequency: 620 },
      { id: 'fase-03', title: 'O Rasgador Alfa', location: 'Fenda Norte', summary: 'A entidade que perseguiu Kael revela mandíbulas energéticas e alta velocidade.', enemy: 'Rasgador Alfa', hp: 120, atk: 19, def: 8, boss: true },
      { id: 'fase-04', title: 'Distrito Industrial', location: 'Complexo de Energia', summary: 'Reative os sistemas de contenção em uma zona de fábricas instáveis e sobreviva ao sentinela que protege o reator.', enemy: 'Sentinela Industrial', hp: 135, atk: 20, def: 10, boss: true, maxPhases: 2 },
      { id: 'fase-11', title: 'O Reator ainda Pulsa', location: 'Nível Inferior do Complexo', summary: 'A contenção falhou depois da queda do sentinela. Desative o núcleo auxiliar antes que a fábrica reative suas linhas de montagem.', enemy: 'Operário Reprogramado', hp: 155, atk: 21, def: 10 },
      { id: 'fase-12', title: 'Rastro de Antimatéria', location: 'Galeria de Resfriamento', summary: 'Siga os resíduos deixados pelo protótipo e sintonize a amostra antes que a radiação contamine o registro.', enemy: 'Parasita de Antimatéria', hp: 170, atk: 22, def: 11, activityType: 'DECODE', activityObjective: 'Isole a assinatura do parasita no espectro de antimatéria.', targetFrequency: 735 },
      { id: 'fase-13', title: 'Transmissão de Lyra', location: 'Torre de Controle', summary: 'Restabeleça o canal de Lyra e interrompa o sinal que está atraindo novas criaturas para a cidade.', enemy: 'Interferidor de Sinal', hp: 185, atk: 23, def: 12 },
      { id: 'fase-14', title: 'A Ala Lacrada', location: 'Abrigo Metropolitano', summary: 'Abra a ala médica sem comprometer as portas de pressão e evacue os pacientes pela rota segura.', enemy: 'Rasgador de Cerco', hp: 205, atk: 24, def: 13, activityType: 'EXTRACT', activityObjective: 'Retire a equipe médica pelos três pontos de evacuação na sequência correta.', activitySequence: ['A', 'C', 'D'] },
      { id: 'fase-15', title: 'O Último Turno', location: 'Linha de Montagem 7', summary: 'Recupere o registro da equipe desaparecida e sobreviva à máquina que continua executando o protocolo de defesa.', enemy: 'Autômato de Linha', hp: 225, atk: 25, def: 14 },
      { id: 'fase-16', title: 'Protocolo de Contenção', location: 'Câmara do Reator', summary: 'Enfrente o núcleo de comando da fábrica e estabilize o perímetro antes de avançar para o Setor Beta.', enemy: 'Núcleo de Contenção', hp: 270, atk: 28, def: 16, boss: true, maxPhases: 2, avatarType: 'containment_core' },
    ],
  },
  {
    id: 'chapter-02',
    chapterNumber: 2,
    title: 'A Expansão da Fenda',
    subtitle: 'As Instalações Perdidas e os Guardiões do Complexo Beta',
    loreIntro: 'Com o colapso dos setores externos, Lyra assume a exploração das estações profundas de transporte e pesquisa de Nova Arcádia; Kael mantém o canal de suporte enquanto ela rastreia os experimentos de dobra espacial.',
    recommendedLevel: 3,
    unlockedByDefault: false,
    protagonistId: 'lyra',
    legacyFinalPhaseId: 'fase-08',
    chapterBossReward: {
      skinId: 'skin-elite',
      itemId: 'arm-03',
      credits: 400,
      matrixCells: 5,
    },
    phases: [
      { id: 'fase-05', title: 'A Torre de Vigilância', location: 'Setor Elevado Beta', summary: 'Um autômato armado com canhão de feixe bloqueia a passagem aos laboratórios.', enemy: 'Vigia Industrial', hp: 155, atk: 22, def: 11 },
      { id: 'fase-06', title: 'Estação Abandonada', location: 'Estação Ômega', summary: 'Siga os registros deixados pela equipe desaparecida em túneis de hipermagnéticos.', enemy: 'Predador da Estação', hp: 180, atk: 25, def: 13, activityType: 'EXTRACT', activityObjective: 'Recupere os três registros na ordem indicada pelo rastreador.', activitySequence: ['B', 'D', 'A'] },
      { id: 'fase-07', title: 'Centro de Pesquisa', location: 'Laboratório de Contenção', summary: 'Descubra os experimentos secretos com antimatéria que antecederam o desastre.', enemy: 'Protótipo Instável', hp: 205, atk: 27, def: 14 },
      { id: 'fase-08', title: 'Guardião Industrial', location: 'Núcleo de Fabricação', summary: 'Enfrente o colossal robô guardião alimentado pelo reator do complexo industrial.', enemy: 'Guardião Industrial', hp: 250, atk: 30, def: 16, boss: true },
      { id: 'fase-17', title: 'Depois do Guardião', location: 'Câmara de Fabricação', summary: 'O guardião caiu, mas sua matriz ainda controla os drones do complexo. Desligue o enlace enquanto eles protegem o reator.', enemy: 'Drone de Matriz', hp: 290, atk: 31, def: 17 },
      { id: 'fase-18', title: 'Registros da Estação Ômega', location: 'Arquivo de Trânsito', summary: 'Recupere os dados da equipe desaparecida decodificando o último pacote antes de a estação reiniciar.', enemy: 'Eco de Ômega', hp: 315, atk: 33, def: 18, activityType: 'DECODE', activityObjective: 'Sintonize a chamada de socorro da equipe desaparecida.', targetFrequency: 810 },
      { id: 'fase-19', title: 'Ruptura no Trilho', location: 'Túnel Hipermagnético', summary: 'Interrompa o trem de carga desgovernado e vença a aberração que o conduz pelo túnel.', enemy: 'Condutor de Fenda', hp: 340, atk: 35, def: 19 },
      { id: 'fase-20', title: 'A Câmara de Testes', location: 'Laboratório Secundário', summary: 'Desative o ciclo de teste que transforma cada impacto recebido em energia para o protótipo.', enemy: 'Protótipo de Refringência', hp: 365, atk: 36, def: 20 },
      { id: 'fase-21', title: 'Fuga do Complexo', location: 'Elevador de Carga', summary: 'Proteja a subida do elevador contra as unidades de resposta que convergem para a saída.', enemy: 'Bastião de Carga', hp: 390, atk: 38, def: 21 },
      { id: 'fase-22', title: 'A Matriz de Épsilon', location: 'Núcleo de Fabricação', summary: 'Enfrente a consciência de defesa que sobreviveu ao guardião e feche a rota industrial para a fenda.', enemy: 'Sentinela de Épsilon', hp: 460, atk: 42, def: 24, boss: true, maxPhases: 2, bossType: 'GUARDIAN' },
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
    protagonistId: 'marcus',
    legacyFinalPhaseId: 'fase-10',
    chapterBossReward: {
      skinId: 'skin-ascendant',
      itemId: 'cor-04',
      credits: 800,
      matrixCells: 8,
    },
    phases: [
      { id: 'fase-09', title: 'A Grande Ruptura', location: 'Marco Zero', summary: 'Atravesse o vórtice onde tempo e espaço se desfazem em tempestades de táquions.', enemy: 'Avatar da Ruptura', hp: 320, atk: 35, def: 18, boss: true },
      { id: 'fase-10', title: 'O Arquiteto', location: 'Além do Véu Quântico', summary: 'Confronte a entidade primordial e decida o destino de todas as linhas temporais.', enemy: 'O Arquiteto', hp: 420, atk: 42, def: 22, boss: true },
      { id: 'fase-23', title: 'O Silêncio após a Convergência', location: 'Margem do Marco Zero', summary: 'A presença do Arquiteto desapareceu, mas o vórtice continua ativo. Extraia os registros antes que a margem temporal desabe.', enemy: 'Eco Residual', hp: 440, atk: 43, def: 24, activityType: 'EXTRACT', activityObjective: 'Recupere os fragmentos sem repetir um caminho temporal.', activitySequence: ['C', 'A', 'D'] },
      { id: 'fase-24', title: 'Fragmentos de uma Decisão', location: 'Campo de Linhas Temporais', summary: 'Recupere três fragmentos de memória sem deixar que as versões hostis de Kael se reagrupem.', enemy: 'Reflexo de Kael', hp: 465, atk: 45, def: 25 },
      { id: 'fase-25', title: 'O Mapa Impossível', location: 'Labirinto Recursivo', summary: 'Siga a única rota que não se repete e derrote o cartógrafo que tenta apagar a saída.', enemy: 'Cartógrafo Menor', hp: 490, atk: 47, def: 26 },
      { id: 'fase-26', title: 'Núcleo sem Origem', location: 'Poço de Antimatéria', summary: 'Mantenha o estabilizador ativo enquanto desconecta o núcleo da rede.', enemy: 'Guardião do Poço', hp: 515, atk: 49, def: 28, activityType: 'DEFEND', activityObjective: 'Segure o estabilizador por três ciclos usando bloqueio, interrupção e reparo.', activityRounds: 3 },
      { id: 'fase-27', title: 'O Pacto das Realidades', location: 'Confluência dos Portais', summary: 'Defenda o canal de negociação entre as realidades e impeça que uma facção sabote a trégua.', enemy: 'Duelista da Confluência', hp: 540, atk: 51, def: 29 },
      { id: 'fase-28', title: 'Caçada no Véu', location: 'Fronteira Quântica', summary: 'A criatura que atravessou o primeiro portal agora caça os sobreviventes. Use as janelas de vulnerabilidade para detê-la.', enemy: 'Rasgador do Véu', hp: 565, atk: 53, def: 30 },
      { id: 'fase-29', title: 'Último Fragmento', location: 'Observatório Primordial', summary: 'Recupere o fragmento que revela a origem do Nexus e vença o guardião que o mantém isolado.', enemy: 'Vigia Primordial', hp: 590, atk: 55, def: 31 },
      { id: 'fase-30', title: 'O Eco Primordial', location: 'Espelho Quântico', summary: 'Enfrente a cópia que preserva as escolhas descartadas durante a luta contra o Arquiteto.', enemy: 'O Eco Primordial', hp: 650, atk: 58, def: 34, boss: true, maxPhases: 3, bossType: 'ARCHITECT' },
    ],
  },
  {
    id: 'chapter-04',
    chapterNumber: 4,
    title: 'A Guerra das Dimensões',
    subtitle: 'As Frotas de Fenda e a Aliança que Não Devia Existir',
    loreIntro: 'A queda do Arquiteto não encerrou a Convergência: abriu rotas para facções de realidades incompatíveis. Kira lidera a retirada e precisa atravessar a frente de guerra antes que as frotas alcancem o Nexus.',
    recommendedLevel: 7,
    unlockedByDefault: false,
    protagonistId: 'kira',
    chapterBossReward: {
      skinId: 'skin-corrupted',
      itemId: 'acc-04',
      credits: 450,
      matrixCells: 5,
    },
    phases: [
      { id: 'fase-31', title: 'Sinal de Evacuação', location: 'Doca de Nova Arcádia', summary: 'Abra uma rota de retirada para civis enquanto uma criatura de fenda bloqueia o hangar.', enemy: 'Predador da Estação', hp: 360, atk: 38, def: 18 },
      { id: 'fase-32', title: 'Trégua Instável', location: 'Ponte de Salto', summary: 'Escolte uma equipe rival até o portal e identifique a frequência do caçador no casco.', enemy: 'Caçador de Fendas', hp: 390, atk: 40, def: 20, activityType: 'DECODE', activityObjective: 'Isole a frequência hostil antes que ela alcance o portal da trégua.', targetFrequency: 865 },
      { id: 'fase-33', title: 'Comboio sob Fogo', location: 'Cinturão de Destroços', summary: 'Desative as torres que rastreiam o comboio e impeça que os sobreviventes sejam cercados.', enemy: 'Artilheiro de Cerco', hp: 420, atk: 42, def: 21 },
      { id: 'fase-34', title: 'Ninho de Ecos', location: 'Colônia Espelhada', summary: 'Rastreie as transmissões duplicadas até a origem e interrompa a incubação dos ecos.', enemy: 'Eco de Batalha', hp: 455, atk: 44, def: 22 },
      { id: 'fase-35', title: 'O Comandante Vértice', location: 'Plataforma de Cerco', summary: 'Quebre a formação do comandante antes que ele alinhe os canhões da frota contra o portal civil.', enemy: 'Comandante Vértice', hp: 560, atk: 48, def: 26, boss: true, maxPhases: 2, avatarType: 'commander_vertex' },
      { id: 'fase-36', title: 'Pacto de Cinzas', location: 'Santuário de Basalto', summary: 'Retire os representantes pelos acessos de serviço enquanto o executor fecha as saídas principais.', enemy: 'Executor de Basalto', hp: 480, atk: 46, def: 24, activityType: 'EXTRACT', activityObjective: 'Conduza os representantes pelos três sinais de evacuação.', activitySequence: ['D', 'B', 'C'] },
      { id: 'fase-37', title: 'A Rota sem Retorno', location: 'Corredor de Dobra', summary: 'Atravesse o corredor instável e interrompa o bloqueio que separa a equipe de Lyra.', enemy: 'Sentinela de Dobra', hp: 510, atk: 48, def: 25 },
      { id: 'fase-38', title: 'Defesa do Farol', location: 'Farol de Épsilon', summary: 'Mantenha o farol ativo durante três investidas e impeça o aríete de quebrar a barreira.', enemy: 'Aríete Dimensional', hp: 540, atk: 50, def: 27, activityType: 'DEFEND', activityObjective: 'Proteja o farol por três investidas: interrompa as cargas, bloqueie impactos ou repare a barreira.', activityRounds: 3, invasion: { id: 'invasion-epsilon-farol', realmId: 'realm-epsilon', affectedPhaseId: 'fase-39', alert: 'Invasão dimensional detectada no Farol de Épsilon.', securedConsequence: 'O Farol mantém a muralha sincronizada; a ameaça seguinte chega enfraquecida.', breachedConsequence: 'A muralha perdeu sincronização; a ameaça seguinte chega reforçada.' } },
      { id: 'fase-39', title: 'A Última Linha', location: 'Muralha do Nexus', summary: 'Recupere os três emissores da muralha antes que o avanço inimigo alcance o centro de comando.', enemy: 'Arauto de Guerra', hp: 575, atk: 52, def: 29 },
      { id: 'fase-40', title: 'Almirante das Fendas', location: 'Nó de Convergência', summary: 'Enfrente a comandante que coordenou a invasão e escolha qual frota receberá o sinal de retirada.', enemy: 'Almirante das Fendas', hp: 680, atk: 56, def: 32, boss: true, maxPhases: 3, avatarType: 'rift_admiral' },
    ],
  },
  {
    id: 'chapter-05',
    chapterNumber: 5,
    title: 'O Colapso do Nexus',
    subtitle: 'O Centro de Comando e a Convergência Final',
    loreIntro: 'As rotas abertas pela guerra convergem para o Nexus. Sena, cartógrafa do núcleo, descobre que seus sistemas começaram a apagar realidades inteiras para sobreviver; ela precisa encontrar uma rota que preserve os mundos conectados.',
    recommendedLevel: 10,
    unlockedByDefault: false,
    protagonistId: 'sena',
    chapterBossReward: {
      skinId: 'skin-ascendant',
      itemId: 'cor-04',
      credits: 600,
      matrixCells: 7,
    },
    phases: [
      { id: 'fase-41', title: 'Alerta no Nexus', location: 'Anel Externo', summary: 'Responda ao protocolo de emergência e elimine o invasor antes que ele alcance os controles de tráfego.', enemy: 'Invasor de Fase', hp: 620, atk: 55, def: 30 },
      { id: 'fase-42', title: 'Três Núcleos', location: 'Galeria de Reatores', summary: 'Reative os três núcleos na ordem indicada pelos registros antes que a pressão destrua a galeria.', enemy: 'Autômato de Contenção', hp: 650, atk: 56, def: 31, activityType: 'DEFEND', activityObjective: 'Sustente a galeria durante três ciclos de ativação dos núcleos.', activityRounds: 3, invasion: { id: 'invasion-nexus-reactors', realmId: 'realm-omega', affectedPhaseId: 'fase-43', alert: 'Invasores estão sobrecarregando os três reatores do Nexus.', securedConsequence: 'Os reatores estabilizados reduzem a pressão do eco no Arquivo Vivo.', breachedConsequence: 'A sobrecarga se propaga ao Arquivo Vivo e fortalece o eco hostil.' } },
      { id: 'fase-43', title: 'Vozes no Arquivo', location: 'Arquivo Vivo', summary: 'Descubra quem alterou as rotas do Nexus decodificando o último registro preservado.', enemy: 'Eco do Arquivo', hp: 680, atk: 58, def: 32, activityType: 'DECODE', activityObjective: 'Reconstitua a frequência do registro antes que o eco sobrescreva o arquivo.', targetFrequency: 925 },
      { id: 'fase-44', title: 'A Câmara Invertida', location: 'Eixo Gravitacional', summary: 'Atravesse a câmara com a gravidade invertida e exponha o guardião que protege o mecanismo central.', enemy: 'Guardião Invertido', hp: 710, atk: 60, def: 34 },
      { id: 'fase-45', title: 'O Arauto do Colapso', location: 'Eclusa Dimensional', summary: 'Interrompa o ciclo de sobrecarga do arauto antes que ele transforme a eclusa em uma singularidade.', enemy: 'Arauto do Colapso', hp: 780, atk: 64, def: 36, boss: true, maxPhases: 2, avatarType: 'collapse_herald' },
      { id: 'fase-46', title: 'Linha de Suprimento', location: 'Mercado Suspenso', summary: 'Retire módulos médicos e técnicos por uma rota lateral antes que o mercado suspenso perca sustentação.', enemy: 'Ceifador de Suprimentos', hp: 740, atk: 62, def: 34, activityType: 'EXTRACT', activityObjective: 'Extraia os três pacotes médicos sem cruzar uma rota já colapsada.', activitySequence: ['B', 'A', 'D'] },
      { id: 'fase-47', title: 'O Conselho Partido', location: 'Câmara de Comando', summary: 'Desarme a defesa do conselho e confronte o agente que vendeu as coordenadas do Nexus.', enemy: 'Duelista do Conselho', hp: 770, atk: 64, def: 35 },
      { id: 'fase-48', title: 'Coração sob Ataque', location: 'Reator Primordial', summary: 'Segure o reator durante a janela de estabilização e sobreviva às descargas do núcleo exposto.', enemy: 'Parasita do Reator', hp: 800, atk: 66, def: 37 },
      { id: 'fase-49', title: 'O Último Portal', location: 'Véu Quântico', summary: 'Feche o portal de invasão pelo lado de dentro e abra espaço para a evacuação dos aliados.', enemy: 'Sentinela do Véu', hp: 840, atk: 68, def: 39 },
      { id: 'fase-50', title: 'Convergência Final', location: 'Núcleo do Nexus', summary: 'Confronte a inteligência que controla o núcleo e estabilize as realidades sem repetir a solução do Arquiteto.', enemy: 'Soberano da Convergência', hp: 980, atk: 74, def: 44, boss: true, maxPhases: 3, bossType: 'ARCHITECT', avatarType: 'convergence_sovereign' },
    ],
  },
];

export const CAMPAIGN_PHASES: CampaignPhase[] = CAMPAIGN_CHAPTERS.flatMap(chapter =>
  chapter.phases.map(phase => ({ ...phase, protagonistId: chapter.protagonistId }))
);
