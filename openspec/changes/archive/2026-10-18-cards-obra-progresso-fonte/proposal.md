# Proposal

## Why

As obras aparecem só em tabelas, sem nenhuma leitura visual de andamento: para saber quanto do prazo já passou é preciso comparar datas de cabeça. O usuário também acha a fonte pequena demais em todo o sistema: o corpo das tabelas tem 15 px, os rótulos 14 px e os textos auxiliares 12 px.

## What Changes

- **Barra de prazo decorrido por obra:** percentual do prazo já transcorrido entre início e término, calculado no front a partir das datas da obra e da data de hoje. Estados:
  - a iniciar (0%);
  - em andamento (percentual);
  - atrasada, vencida e não concluída (barra cheia em vermelho, com os dias de atraso);
  - concluída (barra cheia em neutro);
  - sem término (sem barra, com os dias decorridos).
  Não é avanço físico e o rótulo deixa isso explícito.
- **Cards de obra:** OS, descrição, cliente, situação, barra de prazo, início e término, e total. O card inteiro leva ao detalhe da obra.
  - Substituem a tabela em "Últimas obras atualizadas" do dashboard, com 6 cards, e na listagem `/obras`, que mantém a paginação.
  - O detalhe da obra passa a mostrar a mesma barra no cabeçalho.
  - As tabelas de obras dentro de cliente e de colaborador continuam como estão.
- **Fonte maior:** escala base da interface de 16 px para 18 px (+12,5%), aplicada a todo o sistema. Os tamanhos fixos em px passam a rem, para acompanhar a escala.
- Sem mudança no backend.

## Capabilities

### New Capabilities
- `progresso-obra`: cálculo e exibição do prazo decorrido da obra e o card de obra usado no dashboard e na listagem.

### Modified Capabilities
- `identidade-visual`: novo requisito de escala tipográfica mínima. A capability é criada por `melhorias-design-refeicoes-cadastros`, e esta change entra só com ADDED, sem depender de ordem de arquivamento além da criação.

## Impact

- **Novos arquivos:**
  - `src/lib/progress.ts`: cálculo puro do prazo decorrido;
  - `src/components/project-progress.tsx`: barra;
  - `src/components/project-card.tsx`: card;
  - `src/lib/today.ts`: data de hoje em America/Sao_Paulo, lida depois de `connection()`.
- **Alterados:**
  - `src/app/(app)/page.tsx` e `src/app/(app)/obras/page.tsx`: tabela vira grade de cards;
  - `src/app/(app)/obras/[id]/page.tsx`: barra no cabeçalho;
  - `src/app/globals.css`: escala base;
  - os arquivos com `text-[NNpx]`: conversão para rem.
- Se `sidebar-menu-botoes` for implementada antes, o `text-[15px]` dela também passa a rem nesta change.
