# RUPTURA — RPG Sci-Fi Dimensional

RPG de aventura dimensional feito com React, TypeScript, Vite e Tailwind CSS.

## Requisitos
- Node.js 20 ou superior
- npm

## Executar localmente
1. Extraia o ZIP.
2. Abra um terminal dentro da pasta `ruptura`.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Abra o endereço local mostrado pelo Vite.

## Testes e validação
```sh
npm run lint
./node_modules/.bin/tsx tests/test_module_a.mjs
npm run build
```

## Campanha integrada
O mapa possui 5 capítulos com 10 fases de combate cada. Concluir uma fase libera a próxima; o progresso e o estado do jogador são salvos no armazenamento local do navegador. Os capítulos atribuem protagonistas diferentes e preservam o progresso de saves anteriores.

As incursões usam companheiros controlados pelo jogo e funcionam localmente. Salas online não estão configuradas; isso exige transporte de rede e serviço de sinalização.
