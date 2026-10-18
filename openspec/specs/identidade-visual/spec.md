# identidade-visual Specification

## Purpose
Define como a marca SOLER aparece na aplicação e as regras de contraste e hierarquia visual do shell e do dashboard de obras.

## Requirements

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

### Requirement: Hierarquia de superfícies
O shell SHALL separar visualmente fundo da página, menu lateral, barra superior e cartões de conteúdo, de modo que cada área seja distinguível sem depender só de bordas finas. O vermelho MUST ficar restrito a acentos pontuais (item ativo, indicadores, ações), nunca a fundos extensos.

#### Scenario: Conteúdo destacado do fundo
- **WHEN** uma página de listagem ou o dashboard é exibido
- **THEN** cartões e tabelas aparecem em superfície clara sobre um fundo neutro mais escuro, com borda ou sombra mínima perceptível

#### Scenario: Item de menu ativo
- **WHEN** o usuário está em uma seção do menu
- **THEN** o item correspondente é destacado com acento vermelho pontual e contraste maior que os demais itens

### Requirement: Contraste de texto legível
Textos de corpo, rótulos e cabeçalhos de tabela SHALL ter razão de contraste de pelo menos 4,5:1 contra o fundo em que aparecem. Os itens do menu lateral MUST ter contraste de pelo menos 7:1 contra o fundo do próprio botão, e os títulos de seção do menu, de pelo menos 4,5:1.

#### Scenario: Cabeçalho de tabela
- **WHEN** uma tabela é exibida
- **THEN** o cabeçalho das colunas é distinguível das linhas de dados e atinge contraste mínimo de 4,5:1

#### Scenario: Itens do menu
- **WHEN** o menu lateral é exibido
- **THEN** os itens inativos aparecem em branco sobre o botão escuro, o item ativo em grafite sobre o botão branco, ambos com contraste mínimo de 7:1, e os títulos de seção com contraste mínimo de 4,5:1

### Requirement: Dashboard com indicadores no topo
O dashboard SHALL exibir no topo os totais numa faixa compacta, um único bloco neutro com os itens Obras, Colaboradores, Clientes, Restaurantes, Hospedagens e Centros de custo, cada um com ícone da seção, rótulo e número. No desktop a faixa MUST ocupar uma linha; no celular, 2 itens por linha. Logo abaixo, a seção "Obras" SHALL mostrar as 9 obras alteradas por último, com "Ver todas". Os itens MUST NOT usar faixa ou borda vermelha em repouso. Cada item MUST levar à listagem correspondente.

#### Scenario: Indicadores visíveis ao abrir
- **WHEN** o usuário abre o dashboard em tela de desktop
- **THEN** a faixa de totais aparece acima da seção "Obras", sem rolagem, com ícone, rótulo e número em cada item

#### Scenario: Obras na primeira tela no desktop
- **WHEN** o usuário abre o dashboard em 1366 × 900 px
- **THEN** a faixa de totais ocupa uma linha e a primeira fileira de cards de obra aparece sem rolagem

#### Scenario: Obras na primeira tela no celular
- **WHEN** o usuário abre o dashboard em 375 × 812 px
- **THEN** a faixa mostra os 6 totais em 3 linhas de 2, e o título "Obras" aparece sem rolagem

#### Scenario: Cartão em repouso
- **WHEN** o dashboard é exibido sem interação
- **THEN** nenhum item da faixa mostra faixa ou borda vermelha

#### Scenario: Navegação pelo indicador
- **WHEN** o usuário clica no item "Obras" da faixa
- **THEN** a aplicação abre a listagem de obras

### Requirement: Layout em telas pequenas
O shell SHALL funcionar em largura de celular sem rolagem horizontal da página. Tabelas largas MAY rolar horizontalmente dentro do próprio contêiner. Abaixo de 640 px, o menu MUST NOT aparecer empilhado acima do conteúdo: a página MUST começar com a barra do topo e, logo abaixo, o conteúdo.

#### Scenario: Celular
- **WHEN** a aplicação é aberta em tela de 375 px de largura
- **THEN** barra do topo e conteúdo cabem na largura sem rolagem horizontal da página
- **THEN** o título da página aparece na primeira tela, logo abaixo da barra, sem os itens do menu antes dele

#### Scenario: Desktop
- **WHEN** a aplicação é aberta em tela de 1366 px de largura
- **THEN** o menu lateral fixo e o cabeçalho com usuário e "Sair" aparecem como antes, sem a barra do celular

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

### Requirement: Escala tipográfica legível
A interface SHALL usar escala base de 18 px. O texto de corpo e de tabelas MUST ter pelo menos 16 px, rótulos de campo e botões pelo menos 15 px e textos auxiliares (dicas, metadados) pelo menos 13 px. Tamanhos de fonte MUST ser relativos à escala base, para acompanhar o zoom do navegador.

#### Scenario: Tabela
- **WHEN** uma listagem é exibida com zoom de 100%
- **THEN** o texto das células tem pelo menos 16 px

#### Scenario: Formulário
- **WHEN** um formulário é exibido com zoom de 100%
- **THEN** os rótulos dos campos têm pelo menos 15 px e as dicas pelo menos 13 px

### Requirement: Conteúdo contido nos cards
Textos, selos e valores dos cards de indicador e de obra SHALL ficar inteiramente dentro da caixa do card em qualquer largura de janela de 375 px a 1920 px. Quando faltar espaço, a grade MUST reduzir o número de colunas, e a linha do card MUST quebrar, em vez de deixar o conteúdo vazar.

#### Scenario: Indicadores em larguras intermediárias
- **WHEN** o dashboard é aberto com janela de 640, 768, 1024, 1280, 1366, 1440, 1536, 1600 ou 1920 px
- **THEN** nenhum rótulo de indicador (incluindo COLABORADORES, RESTAURANTES e HOSPEDAGENS) ultrapassa a borda do card

#### Scenario: Card de obra estreito
- **WHEN** a lista de obras é exibida com janela de 640 ou 768 px
- **THEN** o selo de situação, as datas e o total ficam dentro do card, com a grade em uma coluna se necessário

#### Scenario: Celular
- **WHEN** o dashboard é aberto em 375 px
- **THEN** os cards ocupam a largura disponível sem rolagem horizontal da página

### Requirement: Navegação no celular
Abaixo de 640 px, o shell SHALL exibir uma barra fixa no topo com o botão "Abrir menu", a logo SOLER (que leva ao dashboard) e o botão "Sair". O botão de menu MUST abrir um painel lateral sobre o conteúdo com as mesmas seções e itens do menu do desktop, o item da página atual destacado e, no rodapé, o nome e o perfil do usuário e "Sair". O painel MUST fechar ao escolher um item, ao tocar fora dele, pelo botão "Fechar" e pela tecla Esc, e MUST manter o foco do teclado dentro dele enquanto aberto. A logo MUST seguir a regra da logo: sobre fundo claro e liso, sem alteração.

#### Scenario: Abrir e navegar
- **WHEN** o usuário, em 375 px, toca em "Abrir menu" e escolhe "Restaurantes"
- **THEN** a listagem de restaurantes abre, o painel fecha e "Restaurantes" aparece como item ativo na próxima abertura

#### Scenario: Fechar sem navegar
- **WHEN** o painel está aberto e o usuário toca fora dele ou pressiona Esc
- **THEN** o painel fecha e a página continua a mesma

#### Scenario: Sair sem abrir o menu
- **WHEN** o usuário, em 375 px, toca em "Sair" na barra do topo
- **THEN** a sessão é encerrada e a tela de login abre

#### Scenario: Mesmos itens do desktop
- **WHEN** o painel do celular e o menu lateral do desktop são comparados para um mesmo usuário
- **THEN** os dois mostram as mesmas seções e itens, na mesma ordem

### Requirement: Ações do cabeçalho no alto à direita
O cabeçalho das páginas SHALL exibir os botões de ação (por exemplo "Nova obra", "Editar", "Excluir") no alto, alinhados à direita, em qualquer largura de 375 px a 1920 px. Quando faltar espaço, o título MUST quebrar linha ao lado dos botões, ocupando pelo menos 40% da largura, e os botões MUST quebrar linha dentro da própria área, ainda à direita, sem descer para baixo do título nem para a esquerda.

#### Scenario: Listagem no celular
- **WHEN** o usuário abre a listagem de obras em 375 px
- **THEN** "Nova obra" aparece no alto, à direita do título

#### Scenario: Detalhe com várias ações no celular
- **WHEN** o administrador abre o detalhe de uma refeição em 375 px
- **THEN** o custo por dia, "Excluir" e "Editar" ficam no alto à direita, e o título ocupa pelo menos 40% da largura
