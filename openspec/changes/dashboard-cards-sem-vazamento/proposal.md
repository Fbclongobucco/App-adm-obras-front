# Proposal

## Why

O usuário relatou títulos vazando para fora dos cards do dashboard. A medição no navegador confirma dois casos:

```
Largura da janela	Elemento	Vazamento
640–1024 px e 1536–1600 px	Rótulo dos indicadores (COLABORADORES, RESTAURANTES, HOSPEDAGENS)	a palavra não cabe na coluna e passa da caixa
640 px	Card de obra: selo "Em andamento" e total	até 82 px para fora do card
768 px	Card de obra: total	18 px para fora do card
```

A causa é que as grades trocam o número de colunas pela largura da janela (`sm:`, `lg:`, `2xl:`), mas a sidebar ocupa cerca de 250 px. Em várias larguras, a coluna fica mais estreita do que o conteúdo mínimo. A fonte maior da change `cards-obra-progresso-fonte` agravou o problema.

## What Changes

- As grades de indicadores e de cards de obra passam a definir o número de colunas pela largura disponível para o conteúdo, com uma largura mínima por card, e não pela largura da janela.
- Proteções dentro dos cards:
  - o selo de situação e o total não encolhem;
  - a linha de datas e total pode quebrar;
  - o rótulo do indicador quebra entre palavras e nunca passa da caixa.
- Vale para o dashboard e para a listagem `/obras`, que usa a mesma grade de cards.
- Fora do escopo: tamanhos de fonte, cores e conteúdo dos cards.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `identidade-visual`: novo requisito de conteúdo contido nos cards (ADDED). A capability é criada por `melhorias-design-refeicoes-cadastros`.

## Impact

- `src/app/(app)/page.tsx`: grade e card de indicadores.
- `src/components/project-card.tsx`: grade e card de obra.
- Sem impacto no backend.
