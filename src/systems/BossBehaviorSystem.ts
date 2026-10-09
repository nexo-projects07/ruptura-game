import type { EnemyIntent, EnemyState } from '../types/game';

export function getUniqueBossIntent(
  enemy: EnemyState,
  turn: number,
  phase: number
): EnemyIntent | undefined {
  const light = (description: string): EnemyIntent => ({
    type: 'LIGHT_ATTACK',
    description,
    power: enemy.atk,
  });
  const telegraph = (description: string, multiplier: number): EnemyIntent => ({
    type: 'HEAVY_TELEGRAPH',
    description,
    power: Math.floor(enemy.atk * multiplier),
  });
  const channel = (description: string, multiplier: number): EnemyIntent => ({
    type: 'CHANNELING',
    description,
    power: Math.floor(enemy.atk * multiplier),
  });

  switch (enemy.avatarType) {
    case 'containment_core':
      return turn % 3 === 0
        ? telegraph('Sobrecarga do reator telegrafada: rompa o núcleo ou prepare a defesa.', 1.7)
        : light('Descarga de contenção do reator.');
    case 'commander_vertex':
      if (phase >= 2 && turn % 2 === 0) {
        return telegraph('Salva coordenada de artilharia: a formação do comandante está exposta.', 1.8);
      }
      return turn % 3 === 0
        ? channel('Comandante Vértice trava os canhões da frota; ataques rápidos interrompem a mira.', 1.6)
        : light('Disparo de cobertura da formação Vértice.');
    case 'rift_admiral':
      if (turn % 3 === 1) return channel('A almirante sincroniza a frota para uma descarga em cruz.', 1.7);
      if (turn % 3 === 2) return telegraph('Bombardeio de flanco telegrafado; a rota de fuga ainda está aberta.', 1.65);
      return light('Rajada de escolta dimensional.');
    case 'collapse_herald':
      if (phase >= 2 && turn % 2 === 0) {
        return telegraph('Colapso da eclusa: o arauto concentra a singularidade para um golpe pesado.', 1.9);
      }
      return turn % 2 === 0
        ? channel('O arauto canaliza gravidade reversa; interrompa antes da implosão.', 1.55)
        : light('Pulso gravitacional do arauto.');
    case 'convergence_sovereign':
      if (phase >= 3) return telegraph('Convergência total: o soberano colapsa três linhas temporais.', 1.9);
      if (phase === 2 && turn % 2 === 0) {
        return channel('O soberano reúne ecos de outras linhas; ataques rápidos interrompem o acúmulo.', 1.7);
      }
      return turn % 3 === 0
        ? telegraph('Lança de convergência telegrafada; prepare esquiva ou defesa.', 1.6)
        : light('Corte dimensional do soberano.');
    default:
      return undefined;
  }
}