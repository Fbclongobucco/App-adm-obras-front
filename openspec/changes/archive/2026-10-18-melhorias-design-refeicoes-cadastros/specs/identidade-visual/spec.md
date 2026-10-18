# Spec Delta

## Purpose

Define como a marca SOLER aparece na aplicação e as regras de contraste e hierarquia visual do shell e do dashboard de obras.

## ADDED Requirements

### Requirement: Logo SOLER no shell e no login
A aplicação SHALL exibir a logo oficial da SOLER no topo do menu lateral e na tela de login, com texto alternativo "SOLER". A logo MUST ser exibida sem alteração de cor, sem distorção de proporção, sem sombra, brilho ou contorno e sobre fundo claro e liso.

#### Scenario: Logo no menu lateral
- **WHEN** um usuário autenticado abre qualquer página da área logada
- **THEN** a logo SOLER aparece no topo do menu lateral e leva ao dashboard ao ser clicada

#### Scenario: Logo no login
- **WHEN** um usuário abre a tela de login
- **THEN** a logo SOLER aparece acima do formulário, com proporção original

### Requirement: Hierarquia de superfícies
O shell SHALL separar visualmente fundo da página, menu lateral, barra superior e cartões de conteúdo, de modo que cada área seja distinguível sem depender só de bordas finas. O vermelho MUST ficar restrito a acentos pontuais (item ativo, indicadores, ações), nunca a fundos extensos.

#### Scenario: Conteúdo destacado do fundo
- **WHEN** uma página de listagem ou o dashboard é exibido
- **THEN** cartões e tabelas aparecem em superfície clara sobre um fundo neutro mais escuro, com borda ou sombra mínima perceptível

#### Scenario: Item de menu ativo
- **WHEN** o usuário está em uma seção do menu
- **THEN** o item correspondente é destacado com acento vermelho pontual e contraste maior que os demais itens

### Requirement: Contraste de texto legível
Textos de corpo, rótulos e cabeçalhos de tabela SHALL ter razão de contraste de pelo menos 4,5:1 contra o fundo em que aparecem.

#### Scenario: Cabeçalho de tabela
- **WHEN** uma tabela é exibida
- **THEN** o cabeçalho das colunas é distinguível das linhas de dados e atinge contraste mínimo de 4,5:1

### Requirement: Dashboard com indicadores no topo
O dashboard SHALL exibir no topo os indicadores em cartões, com número em destaque e rótulo, seguidos da lista das últimas obras atualizadas. Cada indicador MUST levar à listagem correspondente.

#### Scenario: Indicadores visíveis ao abrir
- **WHEN** o usuário abre o dashboard em tela de desktop
- **THEN** os cartões de indicadores aparecem acima da lista de obras, sem rolagem

#### Scenario: Navegação pelo indicador
- **WHEN** o usuário clica no indicador "Obras"
- **THEN** a aplicação abre a listagem de obras

### Requirement: Layout em telas pequenas
O shell SHALL funcionar em largura de celular sem rolagem horizontal da página. Tabelas largas MAY rolar horizontalmente dentro do próprio contêiner.

#### Scenario: Celular
- **WHEN** a aplicação é aberta em tela de 375 px de largura
- **THEN** menu, cabeçalho e conteúdo cabem na largura sem rolagem horizontal da página
