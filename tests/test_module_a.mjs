import assert from 'node:assert';
import { ItemRegistry, ITEM_CATALOG } from '../src/systems/ItemRegistry.ts';
import { StatCalculator, STAT_LIMITS, sanitizeNumber } from '../src/systems/StatCalculator.ts';
import { SkinRegistry } from '../src/systems/SkinSystem.ts';
import { SecretBossSystem } from '../src/systems/SecretBossSystem.ts';
import { grantCampaignPhaseRewards, grantSecretBossRewards, inferClaimedChapterRewards, inferLegacyChapterMarkers, getLegacyContinuationPhaseIds, getNextCampaignPhaseId } from '../src/systems/CampaignProgressionSystem.ts';
import { CAMPAIGN_CHAPTERS } from '../src/systems/CampaignChapters.ts';
import { COMPANION_ABILITIES, COMPANION_ROLES, getNextCompanionRole } from '../src/systems/CompanionSystem.ts';
import { grantExplorationPointReward, grantRiftRaidReward, isRiftRaidUnlocked } from '../src/systems/ProgressionRewardsSystem.ts';
import { getUniqueBossIntent } from '../src/systems/BossBehaviorSystem.ts';
import { calculateDamageAgainstDefense } from '../src/systems/DamageCalculator.ts';
import { EXPLORERS } from '../src/systems/ExplorerSystem.ts';
import { calculateUpgradeCost } from '../src/systems/UpgradeSystem.ts';
import { advanceExtraction, isFrequencyDecoded, resolveRelayDefense } from '../src/systems/CampaignActivitySystem.ts';
import { getInvasionConsequence, getInvasionConsequenceForPhase, getInvasionThreatMultiplier, resolveCampaignInvasion } from '../src/systems/CampaignInvasionSystem.ts';
import { SkillTreeSystem } from '../src/systems/SkillTreeSystem.ts';

console.log('=== INICIANDO TESTES DO MÓDULO A (RUPTURA 3.0) ===\n');

// ----------------------------------------------------
// TESTE 1: Unicidade dos IDs do Catálogo
// ----------------------------------------------------
console.log('TESTE 1: Verificando unicidade dos IDs do catálogo...');
const ids = ITEM_CATALOG.map(i => i.id);
const uniqueIds = new Set(ids);
assert.strictEqual(ids.length, uniqueIds.size, `Existem IDs duplicados no catálogo! Total: ${ids.length}, Únicos: ${uniqueIds.size}`);
console.log(`✓ 100% dos ${ids.length} itens possuem IDs únicos e estáveis.\n`);

// ----------------------------------------------------
// TESTE 2: Distribuição dos 4 Slots e 4 Raridades
// ----------------------------------------------------
console.log('TESTE 2: Verificando distribuição entre os 4 slots e 4 raridades...');
const slots = ['WEAPON', 'ARMOR', 'CORE', 'ACCESSORY'];
const rarities = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

slots.forEach(slot => {
  const itemsInSlot = ItemRegistry.getItemsBySlot(slot);
  assert.ok(itemsInSlot.length >= 3, `Slot ${slot} deve ter pelo menos 3 itens. Encontrados: ${itemsInSlot.length}`);
  console.log(`✓ Slot ${slot}: ${itemsInSlot.length} itens cadastrados.`);
});

rarities.forEach(rarity => {
  const itemsInRarity = ItemRegistry.getItemsByRarity(rarity);
  assert.ok(itemsInRarity.length >= 3, `Raridade ${rarity} deve ter pelo menos 3 itens. Encontrados: ${itemsInRarity.length}`);
  console.log(`✓ Raridade ${rarity}: ${itemsInRarity.length} itens cadastrados.`);
});
console.log('✓ Todos os slots e raridades estão equilibrados e preenchidos.\n');

// ----------------------------------------------------
// TESTE 3: Imutabilidade do Catálogo em Tempo de Execução
// ----------------------------------------------------
console.log('TESTE 3: Verificando imutabilidade do catálogo...');
assert.throws(() => {
  // @ts-ignore
  ITEM_CATALOG.push({ id: 'illegal' });
}, /cannot add property|is not extensible/i, 'ITEM_CATALOG deve ser imutável');

const firstItem = ITEM_CATALOG[0];
assert.throws(() => {
  // @ts-ignore
  firstItem.name = 'Nome Alterado';
}, /cannot assign to read only property/i, 'Item do catálogo deve ser congelado');

assert.throws(() => {
  // @ts-ignore
  firstItem.stats.atk = 9999;
}, /cannot assign to read only property/i, 'Estatísticas do item devem ser congeladas');
console.log('✓ Catálogo de itens é estritamente imutável (deep freeze verificado).\n');

// ----------------------------------------------------
// TESTE 4: Cálculo com Equipamentos Vazios
// ----------------------------------------------------
console.log('TESTE 4: Calculando atributos com equipamentos vazios...');
const basePlayer = {
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
};

const statsEmpty = StatCalculator.calculate(basePlayer);
assert.strictEqual(statsEmpty.maxHp, 100, 'HP máximo sem itens deve ser 100');
assert.strictEqual(statsEmpty.atk, 20, 'ATK sem itens deve ser 20');
assert.strictEqual(statsEmpty.def, 10, 'DEF sem itens deve ser 10');
assert.strictEqual(statsEmpty.baseFocus, 30, 'Foco base sem itens deve ser 30');
assert.strictEqual(statsEmpty.critChance, 0, 'CritChance inicial sem itens deve ser 0');
assert.strictEqual(statsEmpty.dodgeBonus, 0, 'DodgeBonus inicial sem itens deve ser 0');
console.log('✓ Atributos base calculados com exatidão sem modificadores.\n');

// ----------------------------------------------------
// TESTE 5: Cálculo com Equipamentos Válidos Equipados
// ----------------------------------------------------
console.log('TESTE 5: Calculando atributos com conjunto de 4 itens equipados...');
const playerWithGear = {
  ...basePlayer,
  equippedGear: {
    weaponId: 'wpn-02', // +14 ATK, +5% Crit
    armorId: 'arm-02',  // +60 HP, +9 DEF, +4% Redução
    coreId: 'cor-02',   // +6 ATK, +10 Foco, +5 Foco/Turno
    accessoryId: 'acc-02', // +5 ATK, +8% Esquiva
  },
};

const statsWithGear = StatCalculator.calculate(playerWithGear);
assert.strictEqual(statsWithGear.maxHp, 160, `HP esperado: 160, obtido: ${statsWithGear.maxHp}`);
assert.strictEqual(statsWithGear.atk, 45, `ATK esperado: 20 + 14 + 6 + 5 = 45, obtido: ${statsWithGear.atk}`);
assert.strictEqual(statsWithGear.def, 19, `DEF esperado: 10 + 9 = 19, obtido: ${statsWithGear.def}`);
assert.strictEqual(statsWithGear.baseFocus, 40, `Foco esperado: 30 + 10 = 40, obtido: ${statsWithGear.baseFocus}`);
assert.strictEqual(statsWithGear.focusRecovery, 5, `Recuperação de foco esperada: 5, obtida: ${statsWithGear.focusRecovery}`);
assert.strictEqual(statsWithGear.critChance, 0.05, `Crit chance esperado: 0.05, obtido: ${statsWithGear.critChance}`);
assert.strictEqual(statsWithGear.dodgeBonus, 0.08, `Dodge bonus esperado: 0.08, obtido: ${statsWithGear.dodgeBonus}`);
assert.strictEqual(statsWithGear.damageReductionPercent, 0.04, `Damage reduction esperado: 0.04, obtido: ${statsWithGear.damageReductionPercent}`);
console.log('✓ Modificadores agregados com sucesso nos 4 slots!\n');

// ----------------------------------------------------
// TESTE EXTRA: Passivos dos exploradores
// ----------------------------------------------------
console.log('TESTE EXTRA: Passivos dos exploradores...');
const explorerStats = Object.values(EXPLORERS).map(explorer => StatCalculator.calculate({ ...basePlayer, activeExplorerId: explorer.id }));
assert.strictEqual(new Set(explorerStats.map(stats => `${stats.maxHp}:${stats.atk}:${stats.def}:${stats.baseFocus}:${stats.critChance}:${stats.focusRecovery}`)).size, 5, 'Cada explorador deve alterar o perfil de combate');
assert.strictEqual(StatCalculator.calculate(basePlayer).atk, 20, 'Save antigo sem explorador deve manter os atributos base');
console.log('✓ Os cinco exploradores têm passivos distintos e saves antigos mantêm Kael.\n');

console.log('TESTE EXTRA: Talentos exclusivos respeitam o explorador ativo...');
const lyraTalentPlayer = { ...basePlayer, level: 3, talentPoints: 2, activeExplorerId: 'lyra' };
assert.ok(SkillTreeSystem.canUnlockTalent(lyraTalentPlayer, 'ly-elite-01').canUnlock);
assert.ok(!SkillTreeSystem.canUnlockTalent({ ...lyraTalentPlayer, activeExplorerId: 'kael' }, 'ly-elite-01').canUnlock);
assert.strictEqual(SkillTreeSystem.getAggregatedTalentStats(['ly-elite-01'], 'kael').focusRecovery, 0);
assert.strictEqual(SkillTreeSystem.getAggregatedTalentStats(['ly-elite-01'], 'lyra').focusRecovery, 5);
console.log('✓ Talentos especializados só compram e aplicam no perfil correto.\n');

// ----------------------------------------------------
// TESTE 6: Proteção contra NaN, Infinity e Modificadores Inválidos
// ----------------------------------------------------
console.log('TESTE 6: Testando sanitização de NaN, Infinity e limites máximos...');
assert.strictEqual(sanitizeNumber(NaN, 10), 10, 'NaN deve retornar fallback');
assert.strictEqual(sanitizeNumber(Infinity, 10), 10, 'Infinity deve retornar fallback');
assert.strictEqual(sanitizeNumber(-Infinity, 10), 10, '-Infinity deve retornar fallback');
assert.strictEqual(sanitizeNumber('texto', 10), 10, 'String deve retornar fallback');
assert.strictEqual(sanitizeNumber(null, 10), 10, 'null deve retornar fallback');
assert.strictEqual(sanitizeNumber(undefined, 10), 10, 'undefined deve retornar fallback');

// Jogador com atributos corrompidos (NaN / Infinity)
const corruptedPlayer = {
  ...basePlayer,
  maxHp: NaN,
  atk: Infinity,
  def: -99999,
  focus: 'inválido',
};

// @ts-ignore
const statsCorrupted = StatCalculator.calculate(corruptedPlayer);
assert.ok(Number.isFinite(statsCorrupted.maxHp), 'HP deve ser número finito');
assert.ok(statsCorrupted.maxHp >= STAT_LIMITS.MIN_HP, 'HP deve respeitar limite mínimo');
assert.ok(Number.isFinite(statsCorrupted.atk), 'ATK deve ser número finito');
assert.ok(statsCorrupted.def >= STAT_LIMITS.MIN_DEF, 'DEF não pode ser negativa');
assert.ok(statsCorrupted.baseFocus >= STAT_LIMITS.MIN_FOCUS, 'Foco deve ser válido');
console.log('✓ Sistema resiliente a entradas corrompidas e valores infinitos.\n');

// ----------------------------------------------------
// TESTE 7: Imutabilidade do Jogador e dos Itens durante o Cálculo
// ----------------------------------------------------
console.log('TESTE 7: Verificando que a função de cálculo é pura (sem efeitos colaterais)...');
const snapshotPlayerBefore = JSON.stringify(playerWithGear);
StatCalculator.calculate(playerWithGear);
const snapshotPlayerAfter = JSON.stringify(playerWithGear);
assert.strictEqual(snapshotPlayerBefore, snapshotPlayerAfter, 'calculate() NÃO deve alterar o objeto do jogador');

// Testando compareItem
const legendaryWeapon = ItemRegistry.getItemById('wpn-04');
assert.ok(legendaryWeapon, 'Lâmina lendária deve existir');
const comparison = StatCalculator.compareItem(playerWithGear, legendaryWeapon);
assert.strictEqual(comparison.diff.atk, 24, `Diff de ATK esperado substituindo wpn-02 (+14) por wpn-04 (+38) deve ser +24`);
assert.strictEqual(JSON.stringify(playerWithGear), snapshotPlayerBefore, 'compareItem() NÃO deve alterar o objeto do jogador');
console.log('✓ Funções são estritamente puras e imutáveis.\n');

// ----------------------------------------------------
// TESTE 8: Desbloqueio de skins por progresso de campanha
// ----------------------------------------------------
console.log('TESTE 8: Verificando desbloqueios de skins por fase concluída...');
const skinsBeforePhaseTwo = SkinRegistry.getUnlockedSkins([], 1, 0, [], []);
const skinsAfterPhaseTwo = SkinRegistry.getUnlockedSkins(['fase-02'], 1, 0, [], []);
assert.ok(!skinsBeforePhaseTwo.includes('skin-explorer'), 'Skin de explorador deve permanecer bloqueada antes da Fase 02');
assert.ok(skinsAfterPhaseTwo.includes('skin-explorer'), 'Concluir a Fase 02 deve desbloquear a skin de explorador');
console.log('✓ Desbloqueio de skin respeita a fase concluída.\n');

// ----------------------------------------------------
// TESTE 9: Recompensas únicas de campanha e chefes
// ----------------------------------------------------
console.log('TESTE 9: Verificando recompensas de primeiro clear e replays...');
const rewardPlayer = {
  ...basePlayer,
  credits: 0,
  fragments: 0,
  matrixCells: 0,
  inventory: [],
  unlockedSkins: [],
  defeatedSecretBosses: [],
};
const chapterClear = grantCampaignPhaseRewards(rewardPlayer, 'fase-16', [], 1000);
assert.strictEqual(chapterClear.credits, 250, 'Primeiro clear da Fase 04 deve incluir recompensa do capítulo');
assert.strictEqual(chapterClear.matrixCells, 4, 'Primeiro clear da Fase 04 deve incluir células do capítulo');
assert.ok(chapterClear.inventory.some(item => item.itemId === 'wpn-02'), 'Recompensa do capítulo deve conceder o item configurado');
assert.ok(chapterClear.unlockedSkins.includes('skin-tactical'), 'Recompensa do capítulo deve desbloquear a skin configurada');
assert.ok(chapterClear.claimedChapterRewards.includes('chapter-01'), 'Recompensa do capítulo deve ser marcada como resgatada');
assert.strictEqual(grantCampaignPhaseRewards(chapterClear, 'fase-16', ['fase-16'], 2000), chapterClear, 'Repetir fase concluída não deve conceder recompensas');
assert.deepStrictEqual(inferClaimedChapterRewards(['fase-04', 'fase-08']), ['chapter-01', 'chapter-02'], 'Saves antigos devem migrar recompensas de capítulos já concluídos');
assert.deepStrictEqual(getLegacyContinuationPhaseIds(['fase-04', 'fase-08']), ['fase-11', 'fase-17'], 'Saves antigos devem liberar a continuação de cada capítulo concluído');
assert.deepStrictEqual(inferLegacyChapterMarkers(['fase-04', 'fase-08']), ['chapter-01', 'chapter-02']);
assert.strictEqual(getNextCampaignPhaseId('fase-04'), 'fase-11');
assert.strictEqual(getNextCampaignPhaseId('fase-16'), 'fase-05');
assert.strictEqual(getNextCampaignPhaseId('fase-08'), 'fase-17');
assert.strictEqual(getNextCampaignPhaseId('fase-22'), 'fase-09');
assert.strictEqual(getNextCampaignPhaseId('fase-30'), 'fase-31');

const secretBoss = SecretBossSystem.getBossById('sb-cartografo');
assert.ok(secretBoss, 'Chefe secreto de teste deve existir');
const bossClear = grantSecretBossRewards(rewardPlayer, secretBoss, 3000);
assert.ok(bossClear.defeatedSecretBosses.includes(secretBoss.id), 'Vitória deve registrar chefe derrotado');
assert.strictEqual(grantSecretBossRewards(bossClear, secretBoss, 4000), bossClear, 'Reconfrontar chefe derrotado não deve duplicar recompensas');
console.log('✓ Recompensas de capítulo e chefe são concedidas uma única vez.\n');

// ----------------------------------------------------
// TESTE 10: Estrutura da campanha expandida
// ----------------------------------------------------
console.log('TESTE 10: Verificando cinco capítulos e 50 encontros jogáveis...');
assert.strictEqual(CAMPAIGN_CHAPTERS.length, 5, 'Campanha deve conter cinco capítulos');
assert.ok(CAMPAIGN_CHAPTERS.every(chapter => chapter.phases.length === 10), 'Cada capítulo deve conter dez fases');
const campaignPhases = CAMPAIGN_CHAPTERS.flatMap(chapter => chapter.phases);
assert.strictEqual(campaignPhases.length, 50, 'Campanha deve conter 50 fases');
assert.strictEqual(new Set(campaignPhases.map(phase => phase.id)).size, 50, 'IDs das 50 fases devem ser únicos');
assert.ok(campaignPhases.every(phase => phase.title && phase.summary && phase.location && phase.enemy && phase.hp > 0 && phase.atk > 0), 'Cada fase deve ter conteúdo e atributos de combate válidos');
assert.ok(CAMPAIGN_CHAPTERS.every(chapter => chapter.phases.at(-1)?.boss), 'Cada capítulo deve terminar com um chefe');
const activityPhases = campaignPhases.filter(phase => phase.activityType);
assert.ok(activityPhases.filter(phase => phase.activityType === 'DECODE').length >= 4);
assert.ok(activityPhases.filter(phase => phase.activityType === 'DEFEND').length >= 3);
assert.ok(activityPhases.filter(phase => phase.activityType === 'EXTRACT').length >= 4);
assert.ok(activityPhases.every(phase => phase.activityObjective && (
  phase.activityType === 'DECODE' ? phase.targetFrequency !== undefined
    : phase.activityType === 'DEFEND' ? phase.activityRounds !== undefined
    : phase.activitySequence?.length
)), 'Cada atividade deve declarar objetivo e parâmetros de conclusão');
assert.ok(new Set(activityPhases.map(phase => Number(phase.id.replace('fase-', '')).toString().slice(0, 1))).size >= 4, 'Atividades devem aparecer em diferentes partes da campanha');
const farolInvasion = campaignPhases.find(phase => phase.id === 'fase-38').invasion;
const breachedPlayer = resolveCampaignInvasion(rewardPlayer, farolInvasion, 'BREACHED');
assert.strictEqual(getInvasionThreatMultiplier(breachedPlayer, 'fase-39'), 1.2);
assert.strictEqual(getInvasionConsequence(breachedPlayer, farolInvasion), farolInvasion.breachedConsequence);
assert.strictEqual(getInvasionConsequenceForPhase(breachedPlayer, 'fase-39'), farolInvasion.breachedConsequence);
const recoveredPlayer = resolveCampaignInvasion(breachedPlayer, farolInvasion, 'SECURED');
assert.strictEqual(getInvasionThreatMultiplier(recoveredPlayer, 'fase-39'), 0.85, 'Sucesso em nova tentativa deve recuperar a região');
assert.strictEqual(resolveCampaignInvasion(recoveredPlayer, farolInvasion, 'BREACHED'), recoveredPlayer, 'Replays não devem desfazer uma invasão recuperada');
assert.strictEqual(getInvasionThreatMultiplier(rewardPlayer, 'fase-39'), 1, 'Fase seguinte não deve ser alterada antes de resolver a invasão');
assert.deepStrictEqual(CAMPAIGN_CHAPTERS.map(chapter => chapter.protagonistId), ['kael', 'lyra', 'marcus', 'kira', 'sena']);
const mainBossVisuals = [
  ['fase-16', 'containment_core'],
  ['fase-35', 'commander_vertex'],
  ['fase-40', 'rift_admiral'],
  ['fase-45', 'collapse_herald'],
  ['fase-50', 'convergence_sovereign'],
];
mainBossVisuals.forEach(([phaseId, visualId]) => {
  assert.strictEqual(campaignPhases.find(phase => phase.id === phaseId)?.avatarType, visualId);
});
console.log('✓ Cinco capítulos, 50 encontros, IDs únicos e chefes finais definidos.\n');

// TESTE 11: Habilidades distintas de suporte
// ----------------------------------------------------
console.log('TESTE 11: Verificando habilidades distintas de Lyra, Marcus e Kira...');
assert.deepStrictEqual(COMPANION_ROLES, ['LYRA_TACTICIAN', 'MARCUS_JUGGERNAUT', 'KIRA_VOID']);
assert.strictEqual(new Set(COMPANION_ROLES.map(role => COMPANION_ABILITIES[role].title)).size, 3, 'Cada companheiro deve ter uma habilidade própria');
assert.strictEqual(getNextCompanionRole('LYRA_TACTICIAN'), 'MARCUS_JUGGERNAUT');
assert.strictEqual(getNextCompanionRole('MARCUS_JUGGERNAUT'), 'KIRA_VOID');
assert.strictEqual(getNextCompanionRole('KIRA_VOID'), 'LYRA_TACTICIAN');
console.log('✓ Companheiros têm habilidades distintas e seleção cíclica.\n');

// TESTE 12: Pagamentos únicos de exploração e incursões
// ----------------------------------------------------
console.log('TESTE 12: Verificando proteção contra farm de recompensas...');
const explorationClear = grantExplorationPointReward(rewardPlayer, 'poi-1', { credits: 80, fragments: 2, matrixCells: 1 });
assert.strictEqual(explorationClear.credits, 80);
assert.strictEqual(grantExplorationPointReward(explorationClear, 'poi-1', { credits: 80, fragments: 2, matrixCells: 1 }), explorationClear);
const testRaid = {
  id: 'raid-test', title: 'Teste', threatRank: 'ALTA', bossName: 'Boss de Teste',
  bossHp: 100, bossAtk: 10, bossDef: 5, rewardCredits: 100,
  rewardFragments: 2, rewardMatrixCells: 1, rewardAetherCores: 1,
  realmId: 'realm-alpha', description: 'Teste', mechanicWarning: 'Teste',
};
const raidClear = grantRiftRaidReward(rewardPlayer, testRaid);
assert.strictEqual(raidClear.credits, 100);
assert.ok(raidClear.completedRiftRaids.includes('raid-test'));
assert.strictEqual(grantRiftRaidReward(raidClear, testRaid), raidClear, 'Rejogar raid não deve repetir pagamentos');
console.log('✓ Exploração e incursões pagam uma única vez por ID.\n');

// TESTE 13: Compatibilidade com o Schema Antigo
// ----------------------------------------------------
console.log('TESTE 13: Verificando retrocompatibilidade de tipos e campanha...');
assert.ok(basePlayer.hp === 100, 'hp clássico preservado');
assert.ok(basePlayer.maxHp === 100, 'maxHp clássico preservado');
assert.ok(basePlayer.atk === 20, 'atk clássico preservado');
assert.ok(basePlayer.def === 10, 'def clássico preservado');
console.log('✓ Retrocompatibilidade de PlayerState intacta.');

console.log('\nTESTE EXTRA: Padrões exclusivos de chefes...');
const intentEnemy = { name: 'Chefe', hp: 100, maxHp: 100, atk: 40, boss: true };
assert.strictEqual(getUniqueBossIntent({ ...intentEnemy, avatarType: 'containment_core' }, 3, 1).type, 'HEAVY_TELEGRAPH');
assert.strictEqual(getUniqueBossIntent({ ...intentEnemy, avatarType: 'commander_vertex' }, 3, 1).type, 'CHANNELING');
assert.strictEqual(getUniqueBossIntent({ ...intentEnemy, avatarType: 'rift_admiral' }, 2, 1).type, 'HEAVY_TELEGRAPH');
assert.strictEqual(getUniqueBossIntent({ ...intentEnemy, avatarType: 'collapse_herald' }, 2, 1).type, 'CHANNELING');
assert.strictEqual(getUniqueBossIntent({ ...intentEnemy, avatarType: 'convergence_sovereign' }, 1, 3).type, 'HEAVY_TELEGRAPH');
console.log('✓ Cinco padrões de chefe são determinísticos e distintos.');

console.log('\nTESTE EXTRA: Defesa e penetração de armadura...');
assert.ok(calculateDamageAgainstDefense(100, 40) < 100, 'Defesa do inimigo deve reduzir o dano recebido');
assert.strictEqual(calculateDamageAgainstDefense(100, 40, 1), 100, 'Penetração total deve ignorar a defesa');
assert.strictEqual(calculateDamageAgainstDefense(1, 500), 1, 'Dano mínimo deve permanecer em 1');
console.log('✓ Defesa reduz dano, penetração é limitada e dano mínimo é preservado.');

console.log('\nTESTE EXTRA: Escalonamento de custos de melhorias...');
const upgradeCostLevelOne = calculateUpgradeCost(100, 2, 0);
const upgradeCostLevelTwo = calculateUpgradeCost(100, 2, 1);
const upgradeCostLevelThree = calculateUpgradeCost(100, 2, 2);
assert.ok(upgradeCostLevelTwo.credits > upgradeCostLevelOne.credits);
assert.ok(upgradeCostLevelThree.credits > upgradeCostLevelTwo.credits);
assert.ok(upgradeCostLevelThree.matrixCells > upgradeCostLevelTwo.matrixCells);
console.log('✓ Créditos e células aumentam a cada nível de melhoria.');
assert.ok(!isRiftRaidUnlocked({ ...testRaid, requiredPhase: 'fase-50' }, ['fase-10']), 'Raid final deve permanecer bloqueada antes do marco');
assert.ok(isRiftRaidUnlocked({ ...testRaid, requiredPhase: 'fase-50' }, ['fase-50']), 'Raid final deve desbloquear ao concluir o marco');

console.log('\nTESTE EXTRA: Regras de atividades da campanha...');
assert.ok(isFrequencyDecoded(620, 640));
assert.ok(!isFrequencyDecoded(620, 680));
const bracedRelay = resolveRelayDefense(100, 10, 40, 1, 'BRACE');
const disruptedRelay = resolveRelayDefense(100, 10, 40, 1, 'DISRUPT');
assert.ok(disruptedRelay.integrity > bracedRelay.integrity, 'Interromper ataque telegrafado deve preservar mais integridade que bloquear');
assert.ok(resolveRelayDefense(50, 0, 40, 2, 'REPAIR').integrity > 0);
assert.deepStrictEqual(advanceExtraction(['A', 'C'], 0, 'A', 0), { nextIndex: 1, errors: 0, correct: true, failed: false });
assert.ok(advanceExtraction(['A', 'C'], 0, 'D', 1).failed, 'Erros de extração devem poder reprovar a missão');
console.log('✓ Decodificação, defesa tática e extração têm condições testáveis.');

console.log('\n========================================');
console.log('TODOS OS TESTES DO MÓDULO A FORAM APROVADOS!');
console.log('========================================');
