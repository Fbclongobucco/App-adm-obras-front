# Proposal

## Why

O usuário pediu letras um pouco maiores no menu lateral e itens com cara de botão. Hoje cada item é uma linha de texto de 14 px e só o ativo tem fundo, então o menu parece uma lista e não um conjunto de ações clicáveis.

## What Changes

- Texto dos itens do menu de 14 px para 15 px, com ícones de 16 px para 18 px. Títulos de seção de 11 px para 12 px.
- Cada item vira um botão: bloco com cantos arredondados, fundo e borda sutis sobre o grafite, área de clique maior e espaçamento entre botões.
- No hover, o fundo e a borda do botão ficam mais claros.
- O item ativo vira um botão aceso: fundo branco, texto grafite em negrito e barra vermelha de 3 px à esquerda. O vermelho continua só como detalhe.
- Fora do escopo: logo, cartões do dashboard, barra superior e conteúdo.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `identidade-visual`: o requisito de contraste passa a cobrir o item ativo em grafite sobre branco, e entra um requisito novo para a forma de botão e o tamanho do texto do menu. A capability é criada por `melhorias-design-refeicoes-cadastros` e modificada por `ajuste-sidebar-logo-dashboard`. Esta change deve ser arquivada depois das duas.

## Impact

- `src/components/sidebar.tsx`: classes dos itens, dos títulos de seção e do espaçamento.
- Nenhum outro arquivo e nenhum impacto no backend.
