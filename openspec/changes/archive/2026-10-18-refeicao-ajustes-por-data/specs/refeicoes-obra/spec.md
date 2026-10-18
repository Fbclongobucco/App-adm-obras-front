# Spec Delta

## MODIFIED Requirements

### Requirement: Total estimado em dias úteis
O total estimado SHALL ser:
- custo por dia × dias de fornecimento, mais o valor dos dias extras;
- dias de fornecimento = dias úteis (segunda a sexta, incluindo início e término) entre o início e o término da obra, menos os dias marcados como sem fornecimento.

Feriados MUST NOT ser descontados automaticamente, só pelos ajustes. A tela MUST exibir custo por dia, dias úteis, dias sem fornecimento, dias extras e total estimado.

#### Scenario: Período com fim de semana
- **WHEN** a obra vai de segunda 05/10/2026 a sexta 16/10/2026, o custo por dia é R$ 426,00 e não há ajustes
- **THEN** a tela mostra 10 dias úteis e total estimado de R$ 4.260,00

#### Scenario: Com ajustes
- **WHEN** a obra vai de 05/10/2026 a 16/10/2026, a refeição é Almoço e jantar com almoço 10 × R$ 25,00, jantar 8 × R$ 22,00, entrega R$ 8,00 e refrigerante R$ 5,00 (R$ 452,00 por dia), 12/10/2026 está sem fornecimento e o sábado 10/10/2026 é dia extra com 6 almoços e nenhum jantar
- **THEN** a tela mostra 10 dias úteis, 1 dia sem fornecimento, 1 dia extra de R$ 163,00 e total estimado de R$ 4.231,00

#### Scenario: Obra sem término
- **WHEN** a obra da refeição não tem data de término
- **THEN** a tela mostra o custo por dia e, no lugar do total, informa que o total depende da data de término da obra

#### Scenario: Alteração do término da obra
- **WHEN** a data de término da obra é alterada
- **THEN** dias úteis e total estimado da refeição passam a refletir o novo período, considerando só os ajustes dentro dele

## ADDED Requirements

### Requirement: Ajustes por data
Uma refeição SHALL aceitar ajustes por data de dois tipos: "Dia extra" e "Sem fornecimento". Cada data MUST aparecer no máximo uma vez por refeição e MUST estar dentro do período da obra (a partir do início; até o término, quando houver). O ajuste MAY ter observação de até 100 caracteres. Só administradores MUST poder incluir e remover ajustes.

#### Scenario: Data repetida
- **WHEN** a refeição já tem ajuste em 12/10/2026 e o administrador inclui outro na mesma data
- **THEN** a inclusão é rejeitada com a mensagem "Já existe um ajuste nesta data."

#### Scenario: Fora do período da obra
- **WHEN** a obra vai de 05/10/2026 a 16/10/2026 e o administrador inclui um ajuste em 20/10/2026
- **THEN** a inclusão é rejeitada com a mensagem "A data deve estar dentro do período da obra."

#### Scenario: Remoção
- **WHEN** o administrador remove o ajuste de 12/10/2026
- **THEN** o ajuste some da lista e o total estimado volta a contar esse dia útil

#### Scenario: Operador
- **WHEN** um usuário OPERADOR abre o detalhe da refeição
- **THEN** vê a lista de ajustes, sem formulário de inclusão nem botão de remover

### Requirement: Dia extra
Um ajuste "Dia extra" SHALL ser aceito só em sábado ou domingo e MUST informar as quantidades das refeições servidas pelo tipo da refeição (inteiros de 0 a 10.000), com pelo menos uma maior que zero. O valor do dia extra MUST somar:
- quantidade × preço unitário de cada refeição com quantidade maior que zero;
- uma entrega por refeição com quantidade maior que zero, à taxa do restaurante;
- um refrigerante por entrega, quando a refeição inclui refrigerante.

#### Scenario: Sábado só com almoço
- **WHEN** a refeição Almoço e jantar (almoço R$ 25,00, entrega R$ 8,00, refrigerante R$ 5,00) recebe dia extra em 10/10/2026 com 6 almoços e 0 jantares
- **THEN** o dia extra vale R$ 163,00 (R$ 150,00 de marmitas, 1 entrega de R$ 8,00 e 1 refrigerante de R$ 5,00)

#### Scenario: Dia extra em dia útil
- **WHEN** o administrador inclui um dia extra numa quarta-feira
- **THEN** a inclusão é rejeitada com a mensagem "Dia extra deve ser sábado ou domingo; dias úteis já são contados."

#### Scenario: Quantidades zeradas
- **WHEN** o administrador inclui um dia extra com todas as quantidades zero
- **THEN** a inclusão é rejeitada com a mensagem "Informe a quantidade de pelo menos uma refeição."

### Requirement: Dia sem fornecimento
Um ajuste "Sem fornecimento" SHALL ser aceito só de segunda a sexta e MUST descontar um dia dos dias de fornecimento da refeição, sem pedir quantidades.

#### Scenario: Feriado em dia útil
- **WHEN** o administrador marca 12/10/2026 (segunda-feira) como sem fornecimento
- **THEN** a refeição passa a contar um dia útil a menos no total estimado

#### Scenario: Sem fornecimento no fim de semana
- **WHEN** o administrador marca um sábado como sem fornecimento
- **THEN** a inclusão é rejeitada com a mensagem "Sem fornecimento só se aplica a dias úteis."
