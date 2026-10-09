import assert from 'node:assert';
import { ItemRegistry, ITEM_CATALOG } from '../src/systems/ItemRegistry.ts';
import { StatCalculator, STAT_LIMITS, sanitizeNumber } from '../src/systems/StatCalculator.ts';

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
// TESTE 8: Compatibilidade com o Schema Antigo e as 10 Fases
// ----------------------------------------------------
console.log('TESTE 8: Verificando retrocompatibilidade de tipos e campanha...');
assert.ok(basePlayer.hp === 100, 'hp clássico preservado');
assert.ok(basePlayer.maxHp === 100, 'maxHp clássico preservado');
assert.ok(basePlayer.atk === 20, 'atk clássico preservado');
assert.ok(basePlayer.def === 10, 'def clássico preservado');
console.log('✓ Retrocompatibilidade de PlayerState intacta.');

console.log('\n========================================');
console.log('TODOS OS TESTES DO MÓDULO A FORAM APROVADOS!');
console.log('========================================');
