# Spec Delta

## Purpose

Mostra quanto do prazo de cada obra já transcorreu, com barra de progresso e estado da obra, e apresenta as obras em cards no dashboard e na listagem.

## ADDED Requirements

### Requirement: Prazo decorrido da obra
O sistema SHALL calcular o prazo decorrido de uma obra em dias corridos: (hoje − início) ÷ (término − início), limitado entre 0% e 100% e arredondado para inteiro. A data de hoje MUST ser a do fuso America/Sao_Paulo. O rótulo MUST indicar que se trata de prazo, não de avanço físico.

#### Scenario: Obra em andamento
- **WHEN** a obra vai de 01/10/2026 a 31/10/2026 e hoje é 16/10/2026
- **THEN** a barra mostra 50% e o texto "Prazo: 15 de 30 dias"

#### Scenario: Obra a iniciar
- **WHEN** a data de início é posterior a hoje
- **THEN** a barra mostra 0% e o texto informa "Inicia em" seguido da data de início

### Requirement: Estados da barra de prazo
A barra SHALL refletir o estado da obra. Concluída: barra cheia em cor neutra, com "Concluída". Vencida e não concluída: barra cheia em vermelho, com os dias de atraso. Sem término: sem barra, com os dias decorridos desde o início.

#### Scenario: Obra atrasada
- **WHEN** o término foi 05/10/2026, a obra não está concluída e hoje é 12/10/2026
- **THEN** a barra fica cheia em vermelho com o texto "Atrasada há 7 dias"

#### Scenario: Obra concluída
- **WHEN** a obra está marcada como concluída
- **THEN** a barra fica cheia em cor neutra com o texto "Concluída", independentemente das datas

#### Scenario: Obra sem término
- **WHEN** a obra não tem data de término
- **THEN** não há barra e o texto informa "Sem término definido" e os dias decorridos desde o início

### Requirement: Barra acessível
A barra SHALL expor o valor a leitores de tela como barra de progresso com valor mínimo 0, máximo 100 e valor atual, e com rótulo textual equivalente ao texto exibido.

#### Scenario: Leitor de tela
- **WHEN** um leitor de tela alcança a barra de uma obra em 50%
- **THEN** ele anuncia uma barra de progresso com valor 50 e o texto do prazo

### Requirement: Card de obra
Cada obra SHALL ser apresentada em card com OS, descrição, cliente, situação, barra de prazo, datas de início e término e total. O card inteiro MUST ser um link para o detalhe da obra.

#### Scenario: Conteúdo do card
- **WHEN** o usuário vê o card de uma obra
- **THEN** o card mostra OS, descrição (ou "—"), cliente, situação, barra de prazo, início, término (ou "—") e total em reais

#### Scenario: Navegação
- **WHEN** o usuário clica em qualquer parte do card
- **THEN** a aplicação abre o detalhe da obra

### Requirement: Cards no dashboard e na listagem
O dashboard SHALL exibir as 6 obras atualizadas por último em cards. A listagem de obras SHALL exibir as obras em grade de cards, mantendo a ordenação pela atualização mais recente e a paginação. O detalhe da obra SHALL exibir a barra de prazo no cabeçalho.

#### Scenario: Dashboard
- **WHEN** o usuário abre o dashboard
- **THEN** abaixo dos indicadores aparecem até 6 cards das obras atualizadas por último e o link "Ver todas"

#### Scenario: Listagem
- **WHEN** o usuário abre a listagem de obras com mais obras do que cabem numa página
- **THEN** as obras aparecem em grade de cards e a paginação continua disponível

#### Scenario: Celular
- **WHEN** a listagem é aberta em tela de 375 px
- **THEN** os cards ficam em uma coluna, sem rolagem horizontal da página
