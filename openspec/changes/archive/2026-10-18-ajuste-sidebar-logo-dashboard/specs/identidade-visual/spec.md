# Spec Delta

## MODIFIED Requirements

### Requirement: Logo SOLER no shell e no login
A aplicação SHALL exibir a logo oficial da SOLER no topo do menu lateral e na tela de login, com texto alternativo "SOLER". O arquivo da logo MUST ter fundo transparente. A logo MUST ser exibida sem alteração de cor, sem distorção de proporção, sem sombra, brilho ou contorno e sobre fundo claro e liso. No menu grafite, esse fundo claro MUST ser um bloco compacto ao redor da logo, não uma faixa de largura total.

#### Scenario: Logo no menu lateral
- **WHEN** um usuário autenticado abre qualquer página da área logada
- **THEN** a logo SOLER aparece no topo do menu lateral, dentro de um bloco claro compacto sobre o grafite, e leva ao dashboard ao ser clicada

#### Scenario: Logo no login
- **WHEN** um usuário abre a tela de login
- **THEN** a logo SOLER aparece acima do formulário, com proporção original

#### Scenario: Arquivo sem fundo
- **WHEN** o arquivo da logo é aberto sobre um fundo colorido qualquer
- **THEN** a área fora da marca é transparente e nenhum retângulo branco aparece ao redor dela

### Requirement: Contraste de texto legível
Textos de corpo, rótulos e cabeçalhos de tabela SHALL ter razão de contraste de pelo menos 4,5:1 contra o fundo em que aparecem. Os itens do menu lateral MUST ter contraste de pelo menos 7:1 contra o fundo do menu, e os títulos de seção do menu, de pelo menos 4,5:1.

#### Scenario: Cabeçalho de tabela
- **WHEN** uma tabela é exibida
- **THEN** o cabeçalho das colunas é distinguível das linhas de dados e atinge contraste mínimo de 4,5:1

#### Scenario: Itens do menu
- **WHEN** o menu lateral é exibido
- **THEN** os itens aparecem em branco sobre o grafite, com contraste mínimo de 7:1, e os títulos de seção com contraste mínimo de 4,5:1

### Requirement: Dashboard com indicadores no topo
O dashboard SHALL exibir no topo os indicadores em cartões neutros, cada um com ícone da seção, rótulo e número em destaque, seguidos da lista das últimas obras atualizadas. Os cartões MUST NOT usar faixa ou borda vermelha em repouso. Cada indicador MUST levar à listagem correspondente.

#### Scenario: Indicadores visíveis ao abrir
- **WHEN** o usuário abre o dashboard em tela de desktop
- **THEN** os cartões de indicadores aparecem acima da lista de obras, sem rolagem, com ícone, rótulo e número

#### Scenario: Cartão em repouso
- **WHEN** o dashboard é exibido sem interação
- **THEN** nenhum cartão de indicador mostra faixa ou borda vermelha

#### Scenario: Navegação pelo indicador
- **WHEN** o usuário clica no indicador "Obras"
- **THEN** a aplicação abre a listagem de obras
