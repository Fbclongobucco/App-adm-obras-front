# Spec Delta

## MODIFIED Requirements

### Requirement: Layout em telas pequenas
O shell SHALL funcionar em largura de celular sem rolagem horizontal da página. Tabelas largas MAY rolar horizontalmente dentro do próprio contêiner. Abaixo de 640 px, o menu MUST NOT aparecer empilhado acima do conteúdo: a página MUST começar com a barra do topo e, logo abaixo, o conteúdo.

#### Scenario: Celular
- **WHEN** a aplicação é aberta em tela de 375 px de largura
- **THEN** barra do topo e conteúdo cabem na largura sem rolagem horizontal da página
- **THEN** o título da página aparece na primeira tela, logo abaixo da barra, sem os itens do menu antes dele

#### Scenario: Desktop
- **WHEN** a aplicação é aberta em tela de 1366 px de largura
- **THEN** o menu lateral fixo e o cabeçalho com usuário e "Sair" aparecem como antes, sem a barra do celular

## ADDED Requirements

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
