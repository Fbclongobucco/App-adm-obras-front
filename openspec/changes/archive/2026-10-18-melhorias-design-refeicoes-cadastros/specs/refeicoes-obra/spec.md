# Spec Delta

## Purpose

Registra a alimentação contratada para cada obra (restaurante, refeições servidas, quantidade e preço por dia) e mostra o custo diário e o total estimado até o término da obra.

## ADDED Requirements

### Requirement: Refeição como configuração da obra
Uma refeição SHALL representar a alimentação contratada de uma obra junto a um restaurante, sem data específica. A obra da refeição MUST ser a obra do restaurante selecionado. O formulário MUST conter restaurante, tipo, quantidade por dia, preço unitário e a marcação de faturada, e MUST NOT conter campo de data.

#### Scenario: Cadastro sem data
- **WHEN** o administrador abre "Nova refeição"
- **THEN** o formulário não exibe campo de data e exige restaurante e tipo

#### Scenario: Obra herdada do restaurante
- **WHEN** a refeição é salva com um restaurante vinculado à obra OS 123
- **THEN** a refeição aparece na obra OS 123

### Requirement: Tipos de refeição
O campo tipo SHALL oferecer as opções "Almoço", "Jantar" e "Almoço e jantar".

#### Scenario: Opções do dropdown
- **WHEN** o usuário abre o campo tipo
- **THEN** as opções exibidas são Almoço, Jantar e Almoço e jantar

### Requirement: Quantidade e preço por refeição servida
Para cada refeição servida pelo tipo escolhido, o formulário SHALL exigir quantidade por dia (inteiro de 1 a 10.000) e preço unitário em reais (maior que zero). Em "Almoço e jantar", almoço e jantar MUST ter quantidade e preço próprios.

#### Scenario: Tipo Almoço
- **WHEN** o tipo selecionado é Almoço
- **THEN** o formulário exige quantidade e preço do almoço e oculta os campos do jantar

#### Scenario: Tipo Almoço e jantar
- **WHEN** o tipo selecionado é Almoço e jantar
- **THEN** o formulário exige quantidade e preço do almoço e quantidade e preço do jantar

#### Scenario: Preço inválido
- **WHEN** o usuário informa preço zero ou negativo
- **THEN** o envio é rejeitado com a mensagem "Preço deve ser maior que zero."

### Requirement: Custo por dia
O custo por dia de uma refeição SHALL ser a soma, para cada refeição servida, de quantidade por dia × preço unitário.

#### Scenario: Almoço e jantar
- **WHEN** a refeição tem almoço com 10 × R$ 25,00 e jantar com 8 × R$ 22,00
- **THEN** o custo por dia exibido é R$ 426,00

### Requirement: Total estimado em dias úteis
O total estimado SHALL ser o custo por dia × número de dias úteis (segunda a sexta, incluindo as datas de início e de término) entre o início e o término da obra. Feriados MUST NOT ser descontados. A tela MUST exibir custo por dia, dias úteis e total estimado.

#### Scenario: Período com fim de semana
- **WHEN** a obra vai de segunda 05/10/2026 a sexta 16/10/2026 e o custo por dia é R$ 426,00
- **THEN** a tela mostra 10 dias úteis e total estimado de R$ 4.260,00

#### Scenario: Obra sem término
- **WHEN** a obra da refeição não tem data de término
- **THEN** a tela mostra o custo por dia e, no lugar do total, informa que o total depende da data de término da obra

#### Scenario: Alteração do término da obra
- **WHEN** a data de término da obra é alterada
- **THEN** dias úteis e total estimado da refeição passam a refletir o novo período

### Requirement: Uma cobertura de almoço e uma de jantar por obra
Cada obra SHALL ter no máximo uma refeição que inclua almoço e no máximo uma que inclua jantar. "Almoço e jantar" ocupa as duas coberturas.

#### Scenario: Almoço duplicado
- **WHEN** a obra já tem uma refeição do tipo Almoço e jantar e o usuário cadastra outra do tipo Almoço
- **THEN** o cadastro é rejeitado com a mensagem "Esta obra já tem refeição cadastrada para almoço ou jantar."

#### Scenario: Almoço e jantar separados
- **WHEN** a obra tem uma refeição do tipo Almoço e o usuário cadastra uma do tipo Jantar
- **THEN** o cadastro é aceito

### Requirement: Listagem e detalhe da obra
A listagem de refeições e a seção de refeições no detalhe da obra SHALL exibir tipo, obra (na listagem), restaurante, custo por dia, dias úteis, total estimado e faturada, sem coluna de data.

#### Scenario: Listagem
- **WHEN** o usuário abre a página Refeições
- **THEN** cada linha mostra tipo, obra, restaurante, custo por dia, dias úteis, total estimado e faturada
