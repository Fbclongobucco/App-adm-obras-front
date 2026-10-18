# Spec Delta

## ADDED Requirements

### Requirement: Itens do menu como botões
Cada item do menu lateral SHALL ser exibido como um botão: bloco com cantos arredondados, fundo e borda visíveis sobre o fundo do menu e espaçamento entre itens. O texto dos itens MUST ter 15 px e os títulos de seção, 12 px. O item ativo MUST se distinguir dos demais por fundo claro, texto escuro em negrito e acento vermelho pontual.

#### Scenario: Botões em repouso
- **WHEN** o menu lateral é exibido
- **THEN** cada item aparece como um bloco arredondado com fundo e borda próprios, separado dos vizinhos, com texto de 15 px

#### Scenario: Hover
- **WHEN** o usuário passa o mouse sobre um item inativo
- **THEN** o fundo e a borda desse botão ficam mais claros

#### Scenario: Item ativo
- **WHEN** o usuário está na página de um item do menu
- **THEN** o botão desse item aparece com fundo branco, texto grafite em negrito e barra vermelha à esquerda

## MODIFIED Requirements

### Requirement: Contraste de texto legível
Textos de corpo, rótulos e cabeçalhos de tabela SHALL ter razão de contraste de pelo menos 4,5:1 contra o fundo em que aparecem. Os itens do menu lateral MUST ter contraste de pelo menos 7:1 contra o fundo do próprio botão, e os títulos de seção do menu, de pelo menos 4,5:1.

#### Scenario: Cabeçalho de tabela
- **WHEN** uma tabela é exibida
- **THEN** o cabeçalho das colunas é distinguível das linhas de dados e atinge contraste mínimo de 4,5:1

#### Scenario: Itens do menu
- **WHEN** o menu lateral é exibido
- **THEN** os itens inativos aparecem em branco sobre o botão escuro, o item ativo em grafite sobre o botão branco, ambos com contraste mínimo de 7:1, e os títulos de seção com contraste mínimo de 4,5:1
