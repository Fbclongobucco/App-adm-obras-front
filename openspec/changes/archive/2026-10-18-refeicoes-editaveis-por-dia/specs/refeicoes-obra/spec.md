# Spec Delta

## MODIFIED Requirements

### Requirement: Custo por dia
O custo por dia de uma refeição SHALL ser a soma de três parcelas:
- **marmitas:** para cada refeição servida, quantidade por dia × preço unitário;
- **entrega:** para cada refeição servida, 1 entrega × taxa de entrega do restaurante para aquela refeição (almoço ou jantar; zero sem taxa);
- **refrigerante:** entregas por dia × preço do refrigerante do restaurante (zero quando o restaurante não fornece).

Cada refeição servida conta como uma entrega por dia. A tela MUST mostrar as três parcelas e o total.

#### Scenario: Almoço e jantar
- **WHEN** a refeição tem almoço com 10 × R$ 25,00 e jantar com 8 × R$ 22,00, sem taxa de entrega e sem refrigerante
- **THEN** o custo por dia exibido é R$ 426,00

#### Scenario: Com entrega e refrigerante
- **WHEN** a refeição é Almoço e jantar com almoço 10 × R$ 25,00 e jantar 8 × R$ 22,00, e o restaurante cobra R$ 8,00 por entrega no almoço e no jantar e fornece refrigerante a R$ 5,00
- **THEN** a tela mostra marmitas R$ 426,00, entrega R$ 16,00 (2 entregas), refrigerante R$ 10,00 (2 unidades, do restaurante) e custo por dia de R$ 452,00

#### Scenario: Taxas diferentes no almoço e no jantar
- **WHEN** a refeição é Almoço e jantar com almoço 10 × R$ 25,00 e jantar 8 × R$ 22,00, e o restaurante cobra R$ 8,00 por entrega do almoço, R$ 10,00 por entrega do jantar e fornece refrigerante a R$ 5,00
- **THEN** a tela mostra entrega R$ 18,00 (2 entregas) e custo por dia de R$ 454,00

#### Scenario: Só almoço com entrega
- **WHEN** a refeição é Almoço com 10 × R$ 25,00, o restaurante cobra R$ 8,00 por entrega do almoço e não fornece refrigerante
- **THEN** o custo por dia é R$ 258,00, com 1 entrega

### Requirement: Total estimado em dias úteis
O total estimado SHALL ser a soma do valor de cada dia do período da obra:
- dia útil (segunda a sexta, incluindo início e término) sem ajuste vale o custo por dia;
- dia útil sem fornecimento vale zero;
- dia útil alterado vale o valor calculado com os números informados no dia;
- dia extra vale o valor do ajuste;
- sábado e domingo sem ajuste valem zero.

Feriados MUST NOT ser descontados automaticamente, só pelos ajustes. A tela MUST exibir custo por dia, dias úteis, dias sem fornecimento, dias alterados, dias extras e total estimado.

#### Scenario: Período com fim de semana
- **WHEN** a obra vai de segunda 05/10/2026 a sexta 16/10/2026, o custo por dia é R$ 426,00 e não há ajustes
- **THEN** a tela mostra 10 dias úteis e total estimado de R$ 4.260,00

#### Scenario: Com ajustes
- **WHEN** a obra vai de 05/10/2026 a 16/10/2026, a refeição é Almoço e jantar com almoço 10 × R$ 25,00, jantar 8 × R$ 22,00, entrega R$ 8,00 no almoço e no jantar e refrigerante R$ 5,00 (R$ 452,00 por dia), 12/10/2026 está sem fornecimento e o sábado 10/10/2026 é dia extra com 6 almoços e nenhum jantar
- **THEN** a tela mostra 10 dias úteis, 1 dia sem fornecimento, 1 dia extra de R$ 163,00 e total estimado de R$ 4.231,00

#### Scenario: Com dia alterado
- **WHEN** a obra vai de 05/10/2026 a 16/10/2026, a refeição custa R$ 454,00 por dia (entrega do almoço R$ 8,00, do jantar R$ 10,00) e a quarta 14/10/2026 está alterada para R$ 489,00
- **THEN** a tela mostra 10 dias úteis, 1 dia alterado e total estimado de R$ 4.575,00

#### Scenario: Obra sem término
- **WHEN** a obra da refeição não tem data de término
- **THEN** a tela mostra o custo por dia e, no lugar do total, informa que o total depende da data de término da obra

#### Scenario: Alteração do término da obra
- **WHEN** a data de término da obra é alterada
- **THEN** dias úteis e total estimado da refeição passam a refletir o novo período, considerando só os ajustes dentro dele

### Requirement: Ajustes por data
Uma refeição SHALL aceitar ajustes por data de três tipos: "Dia extra", "Sem fornecimento" e "Dia alterado". Cada data MUST aparecer no máximo uma vez por refeição e MUST estar dentro do período da obra (a partir do início; até o término, quando houver). O ajuste MAY ter observação de até 100 caracteres. Só administradores MUST poder incluir, editar e remover ajustes. A seção "Ajustes por data" do detalhe da refeição MUST listar os três tipos, com quantidades, entregas do almoço e do jantar, refrigerantes, valor e observação.

#### Scenario: Data repetida
- **WHEN** a refeição já tem ajuste em 12/10/2026 e o administrador inclui outro na mesma data
- **THEN** a inclusão é rejeitada com a mensagem "Já existe um ajuste nesta data."

#### Scenario: Fora do período da obra
- **WHEN** a obra vai de 05/10/2026 a 16/10/2026 e o administrador inclui um ajuste em 20/10/2026
- **THEN** a inclusão é rejeitada com a mensagem "A data deve estar dentro do período da obra."

#### Scenario: Remoção
- **WHEN** o administrador remove o ajuste de 12/10/2026
- **THEN** o ajuste some da lista e o total estimado volta a contar esse dia útil pelo custo por dia

#### Scenario: Operador
- **WHEN** um usuário OPERADOR abre o detalhe da refeição
- **THEN** vê a lista de ajustes, sem formulário de inclusão nem botão de remover

### Requirement: Dia extra
Um ajuste "Dia extra" SHALL ser aceito só em sábado ou domingo e MUST informar as quantidades das refeições servidas pelo tipo da refeição (inteiros de 0 a 10.000), com pelo menos uma maior que zero. Entregas e refrigerantes seguem a regra "Entregas e refrigerantes do dia". O valor do dia extra MUST somar:
- quantidade × preço unitário de cada refeição servida;
- entregas do almoço × taxa do almoço e entregas do jantar × taxa do jantar;
- refrigerantes × preço do refrigerante do restaurante.

Um dia extra já incluído MUST poder ser editado.

#### Scenario: Sábado só com almoço
- **WHEN** a refeição Almoço e jantar (almoço R$ 25,00, entrega do almoço R$ 8,00, refrigerante R$ 5,00) recebe dia extra em 10/10/2026 com 6 almoços e 0 jantares, sem entregas nem refrigerantes informados
- **THEN** o dia extra vale R$ 163,00 (R$ 150,00 de marmitas, 1 entrega de R$ 8,00 e 1 refrigerante de R$ 5,00)

#### Scenario: Dia extra em dia útil
- **WHEN** o administrador inclui um dia extra numa quarta-feira
- **THEN** a inclusão é rejeitada com a mensagem "Dia extra deve ser sábado ou domingo; dias úteis já são contados."

#### Scenario: Quantidades zeradas
- **WHEN** o administrador inclui um dia extra com todas as quantidades zero
- **THEN** a inclusão é rejeitada com a mensagem "Informe a quantidade de pelo menos uma refeição."

## ADDED Requirements

### Requirement: Dia alterado
Um ajuste "Dia alterado" SHALL ser aceito só de segunda a sexta e MUST informar as quantidades das refeições servidas pelo tipo da refeição (inteiros de 0 a 10.000), com pelo menos uma maior que zero. Entregas e refrigerantes seguem a regra "Entregas e refrigerantes do dia". O valor do dia MUST ser calculado como o do dia extra. Gravar de novo a mesma data MUST substituir os números do dia.

#### Scenario: Uma janta a menos
- **WHEN** a refeição Almoço e jantar (almoço 10 × R$ 25,00, jantar 8 × R$ 22,00, entrega do almoço R$ 8,00, do jantar R$ 10,00, refrigerante R$ 5,00) é alterada em 14/10/2026 para 10 almoços e 7 jantares, sem entregas nem refrigerantes informados
- **THEN** o dia vale R$ 432,00 (R$ 404,00 de marmitas, 2 entregas e 2 refrigerantes)

#### Scenario: Dia alterado no fim de semana
- **WHEN** o administrador altera um sábado
- **THEN** a gravação é rejeitada com a mensagem "Dia alterado só se aplica a dias úteis; no fim de semana use dia extra."

#### Scenario: Dia alterado zerado
- **WHEN** o administrador altera um dia útil com todas as quantidades zero
- **THEN** a gravação é rejeitada com a mensagem "Informe a quantidade de pelo menos uma refeição."

### Requirement: Entregas e refrigerantes do dia
No dia alterado e no dia extra, entregas do almoço, entregas do jantar e refrigerantes SHALL ser opcionais, inteiros de 0 a 100 para entregas e de 0 a 10.000 para refrigerantes. Quando vazios, MUST valer o padrão:
- 1 entrega do almoço quando há almoços no dia, e 1 entrega do jantar quando há jantares;
- 1 refrigerante por entrega do dia, quando o restaurante fornece refrigerante.

Entregas MUST ser zero na refeição com quantidade zero. Refrigerantes MUST ser vazios ou zero quando o restaurante não fornece refrigerante.

#### Scenario: Duas entregas no almoço
- **WHEN** a quarta 14/10/2026 é alterada para 10 almoços, 9 jantares, 2 entregas do almoço e 1 do jantar, sem refrigerantes informados, com entrega do almoço R$ 8,00, do jantar R$ 10,00 e refrigerante R$ 5,00
- **THEN** o dia tem 3 entregas, 3 refrigerantes e vale R$ 489,00

#### Scenario: Refrigerantes informados
- **WHEN** o mesmo dia é gravado com 2 refrigerantes
- **THEN** o dia tem 3 entregas, 2 refrigerantes e vale R$ 484,00

#### Scenario: Entrega sem marmita
- **WHEN** o administrador informa 1 entrega do jantar com 0 jantares
- **THEN** a gravação é rejeitada com a mensagem "Não há entrega sem marmita: zere as entregas da refeição sem quantidade."

#### Scenario: Restaurante sem refrigerante
- **WHEN** o restaurante não fornece refrigerante e o administrador informa 2 refrigerantes no dia
- **THEN** a gravação é rejeitada com a mensagem "O restaurante não fornece refrigerante."
