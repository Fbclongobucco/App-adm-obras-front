# Design

## Context

- **Indicadores** (`src/app/(app)/page.tsx`):
  - grade `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6`;
  - card `flex items-center gap-4 px-4`, com ícone de 2,5 rem e rótulo `uppercase tracking-wide`;
  - "COLABORADORES" é uma palavra só e não quebra, então passa da coluna quando ela fica estreita (ver proposal.md).
- **Cards de obra** (`src/components/project-card.tsx`):
  - grade `sm:grid-cols-2 xl:grid-cols-3`;
  - a linha OS + selo e a linha datas + total são `flex` sem quebra, e selo e total encolhem até vazar.
- O conteúdo principal tem largura = janela − sidebar (`sm:w-56`/`lg:w-60` em rem, cerca de 250 a 270 px na escala de 18 px) − padding. Breakpoints da janela não refletem essa largura.
- Diagnóstico reproduzível: `scratchpad/pw/overflow.mjs` percorre de 375 a 1920 px e lista folhas de texto que passam da caixa do card.

## Goals / Non-Goals

**Goals:**
- Nenhum vazamento de 375 a 1920 px, verificado pelo script de diagnóstico.

**Non-Goals:**
- Reduzir fonte, encurtar rótulos ou mudar o conteúdo dos cards.

## Decisions

### D1. Grade pela largura disponível (`auto-fill` + `minmax`)
- Indicadores: `grid-cols-[repeat(auto-fill,minmax(min(14rem,100%),1fr))]`.
- Cards de obra: `grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))]`.
- O navegador coloca quantas colunas couberem com a largura mínima do card, então a sidebar já está descontada. `min(…, 100%)` impede que o mínimo passe da largura disponível no celular.
- Mínimos estimados na escala de 18 px:
  - **Indicador:** padding de 36 px, ícone de 45 px, gap de 18 px e "COLABORADORES" de cerca de 140 px, o que dá cerca de 240 px. O mínimo de 14 rem dá 252 px.
  - **Card de obra:** OS e selo lado a lado e total com datas, cerca de 330 px. O mínimo de 20 rem dá 360 px.
  - Se o diagnóstico ainda acusar vazamento, sobe-se o mínimo, sem mudar a abordagem.
- **Alternativa:** container queries do Tailwind (`@container` + `@md:`). Descartada porque continua com pontos de quebra fixos para ajustar à mão. O `auto-fill` resolve com uma regra só.
- **Alternativa:** reduzir a fonte do rótulo. Descartada porque o usuário pediu fonte maior na change anterior.

### D2. Proteções internas
- Indicador: o rótulo recebe `break-words`, que quebra a palavra só se ela sozinha não couber, e o bloco de texto mantém `min-w-0`.
- Card de obra:
  - o selo recebe `shrink-0`, e a OS, `min-w-0 truncate` (com `title` com a OS completa);
  - a linha de datas e total recebe `flex-wrap gap-y-1`, e o total, `shrink-0`.

## Risks / Trade-offs

- [Número de colunas diferente do atual em algumas larguras, por exemplo 5 indicadores em vez de 6 a 1536 px] → é o comportamento esperado: menos colunas quando não há espaço. O dashboard da spec exige indicadores acima da lista, não um número fixo de colunas.
- [OS muito longa truncada] → `title` mostra a OS completa ao passar o mouse, e o detalhe da obra mostra o valor inteiro.
