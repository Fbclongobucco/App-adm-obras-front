# Spec Delta

## MODIFIED Requirements

### Requirement: Dashboard com indicadores no topo
O dashboard SHALL exibir no topo os totais numa faixa compacta, um único bloco neutro com os itens Obras, Colaboradores, Clientes, Restaurantes, Hospedagens e Centros de custo, cada um com ícone da seção, rótulo e número. No desktop a faixa MUST ocupar uma linha; no celular, 2 itens por linha. Logo abaixo, a seção "Obras" SHALL mostrar as 9 obras alteradas por último, com "Ver todas". Os itens MUST NOT usar faixa ou borda vermelha em repouso. Cada item MUST levar à listagem correspondente.

#### Scenario: Obras na primeira tela no desktop
- **WHEN** o usuário abre o dashboard em 1366 × 900 px
- **THEN** a faixa de totais ocupa uma linha e a primeira fileira de cards de obra aparece sem rolagem

#### Scenario: Obras na primeira tela no celular
- **WHEN** o usuário abre o dashboard em 375 × 812 px
- **THEN** a faixa mostra os 6 totais em 3 linhas de 2, e o título "Obras" aparece sem rolagem

#### Scenario: Item em repouso
- **WHEN** o dashboard é exibido sem interação
- **THEN** nenhum item da faixa mostra faixa ou borda vermelha

#### Scenario: Navegação pelo item
- **WHEN** o usuário clica no item "Obras" da faixa
- **THEN** a aplicação abre a listagem de obras

## ADDED Requirements

### Requirement: Ações do cabeçalho no alto à direita
O cabeçalho das páginas SHALL exibir os botões de ação (por exemplo "Nova obra", "Editar", "Excluir") no alto, alinhados à direita, em qualquer largura de 375 px a 1920 px. Quando faltar espaço, o título MUST quebrar linha ao lado dos botões, ocupando pelo menos 40% da largura, e os botões MUST quebrar linha dentro da própria área, ainda à direita, sem descer para baixo do título nem para a esquerda.

#### Scenario: Listagem no celular
- **WHEN** o usuário abre a listagem de obras em 375 px
- **THEN** "Nova obra" aparece no alto, à direita do título

#### Scenario: Detalhe com várias ações no celular
- **WHEN** o administrador abre o detalhe de uma refeição em 375 px
- **THEN** o custo por dia, "Excluir" e "Editar" ficam no alto à direita, e o título ocupa pelo menos 40% da largura
