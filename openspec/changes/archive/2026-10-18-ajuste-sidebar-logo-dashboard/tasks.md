# Tasks

> Verificação com `npm run lint`, `npx tsc --noEmit` e capturas do navegador headless (Playwright no scratchpad), com o `next dev` reiniciado antes das capturas.

## 1. Logo sem fundo

- [x] 1.1 Gerar a nova `public/soler-logo.png` com "cor para alfa" a partir do branco (D1), usando `sharp` num script no scratchpad. Verificar que o arquivo tem canal alfa, que os cantos têm alfa 0 e que, composto sobre branco, difere do arquivo anterior em no máximo 2 por canal
- [x] 1.2 Verificar visualmente a logo composta sobre um fundo colorido de teste: sem retângulo branco e com o reflexo preservado

## 2. Sidebar grafite com texto branco

- [x] 2.1 Trocar a faixa branca do topo em `src/app/(app)/layout.tsx` por um bloco claro compacto só ao redor da logo, com o subtítulo em `text-white/70` sobre o grafite (D2). Verificar por captura que o bloco não ocupa a largura toda e que a logo leva a `/`
- [x] 2.2 Aplicar as cores de D3 em `src/components/sidebar.tsx` (itens brancos, seções `white/70`, ativo `white/15` + negrito + barra `accent`). Verificar por captura em 1366 px e 375 px e confirmar os contrastes de D3 (≥ 7:1 nos itens, ≥ 4,5:1 nas seções)

## 3. Indicadores do dashboard

- [x] 3.1 Refazer os cartões em `src/app/(app)/page.tsx` conforme D4 (ícone de `NAV`, rótulo, número, sem filete vermelho, hover com borda e sombra). Verificar por captura que nenhum cartão tem vermelho em repouso, que todos cabem acima da lista em 1366×768 e que clicar em "Obras" abre `/obras`

## 4. Integração

- [x] 4.1 Rodar `npm run lint` e `npx tsc --noEmit` sem erros, reiniciar o `next dev` e capturar dashboard, uma listagem e o login em 1366 px e 375 px, sem rolagem horizontal

## Workflow follow-up

- Pedir ao usuário que confira no navegador com atualização forçada (Ctrl+Shift+R).
- Arquivar `melhorias-design-refeicoes-cadastros` antes desta change: o delta MODIFIED de `identidade-visual` depende da spec criada por ela.
