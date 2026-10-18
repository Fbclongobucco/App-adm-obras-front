# Proposal

## Why

Os 6 totais do dashboard ocupam meia tela no desktop e a primeira tela inteira no celular. As obras, que são o assunto principal, ficam abaixo da dobra.

## What Changes

- Totais numa **faixa compacta**: um bloco só, com os 6 itens (ícone, rótulo e número), em uma linha no desktop e 2 por linha no celular. Cada item continua levando à listagem.
- **Obras em destaque** logo abaixo da faixa: seção "Obras" com as últimas alteradas, 9 cards em vez de 6, e "Ver todas".
- Critério da lista sem mudança (últimas atualizadas). Só front, sem mudança na API.
- **Pedido do usuário no teste:** botões de ação dos cabeçalhos de página sempre no alto, à direita, também no celular (antes, sem espaço, caíam abaixo do título, à esquerda). Vale para todas as telas, pelo `PageHeader`.
- Fora do escopo: contagem de obras por situação, filtro por situação e novos indicadores.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `identidade-visual`: "Dashboard com indicadores no topo" passa a exigir a faixa compacta e as obras na primeira tela (MODIFIED), e entra "Ações do cabeçalho no alto à direita" (ADDED). Criada por changes ainda não arquivadas; arquivar depois de `ajuste-sidebar-logo-dashboard` e `dashboard-cards-sem-vazamento`.

## Impact

- `src/app/(app)/page.tsx`;
- `src/components/page-header.tsx` (todas as telas com cabeçalho).
