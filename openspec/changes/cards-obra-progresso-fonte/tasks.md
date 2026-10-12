# Tasks

> O front não tem suíte de testes. O cálculo de D1 é verificado por um script Node no scratchpad que importa `src/lib/progress.ts` (via `npx tsx`), e a interface por capturas do Playwright no scratchpad, com o `next dev` reiniciado.

## 1. Cálculo de prazo

- [x] 1.1 Criar `src/lib/progress.ts` com `projectProgress(project, today)` conforme D1 (estados, dias corridos UTC, término = início). Verificar com script no scratchpad os cenários da spec: 01/10–31/10 em 16/10 dá 50% e 15 de 30; início futuro dá upcoming e 0%; término 05/10 em 12/10 dá late e 7 dias; concluída dá done; sem término dá open
- [x] 1.2 Criar `src/lib/today.ts` (`await connection()` + data em America/Sao_Paulo, D2) e verificar com `npx tsc --noEmit`

## 2. Barra e card

- [x] 2.1 Criar `src/components/project-progress.tsx` (D3: cores por estado, atributos ARIA, textos da spec) e `src/components/project-card.tsx` (conteúdo e link de D3). Verificar com `npm run lint` e `npx tsc --noEmit`
- [x] 2.2 Dashboard: buscar 6 obras e trocar a tabela pela grade de cards (D4). Verificar por captura em 1366 px que aparecem até 6 cards com barra e que clicar num card abre o detalhe
- [x] 2.3 `/obras`: grade de cards com paginação mantida e "Atualizada em" no rodapé (D4). Verificar por captura em 1366 px e 375 px (uma coluna, sem rolagem horizontal) e que a paginação continua presente
- [x] 2.4 Detalhe da obra: barra de prazo abaixo do cabeçalho (D4). Verificar por captura numa obra em andamento, numa sem término e numa concluída (o seed tem as três)
- [x] 2.5 Verificar no navegador os atributos `role="progressbar"`, `aria-valuenow` e `aria-valuetext` de uma barra

## 3. Fonte maior

- [x] 3.1 Definir a escala base de 112,5% em `src/app/globals.css` (D5) e verificar por `getComputedStyle` no navegador que `html` tem 18 px
- [x] 3.2 Converter todos os `text-[NNpx]` de `src/` para rem conforme D5 e verificar que `grep -rn "text-\[[0-9]*px\]" src` não retorna nada
- [x] 3.3 Medir no navegador: texto de célula de tabela ≥ 16 px, rótulo de campo ≥ 15 px e dica ≥ 13 px. Capturar dashboard, uma listagem e um formulário em 1366 px e 375 px sem rolagem horizontal da página

## 4. Integração

- [x] 4.1 Rodar `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros (o build valida o uso de data com Cache Components)

## Workflow follow-up

- Pedir ao usuário que confira com atualização forçada (Ctrl+Shift+R).
- Arquivar depois de `melhorias-design-refeicoes-cadastros`, que cria a capability `identidade-visual`.
