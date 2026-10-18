# Spec Delta

## Purpose

Locação mensal das hospedagens, com renovações, total da locação e aviso visual do vencimento.

## ADDED Requirements

### Requirement: Locação mensal
A hospedagem SHALL ter data de entrada e valor por mês, ambos obrigatórios, com valor maior que zero. Ao cadastrar, o sistema MUST criar o primeiro período, da data de entrada até a véspera do mesmo dia no mês seguinte, pelo valor mensal. Quando o mês seguinte não tem o dia, o período MUST terminar no último dia desse mês.

#### Scenario: Primeiro período
- **WHEN** a hospedagem é cadastrada com entrada em 12/10/2026 e R$ 3.000,00 por mês
- **THEN** ela tem um período de 12/10/2026 a 11/11/2026 de R$ 3.000,00, e o total da locação é R$ 3.000,00

#### Scenario: Fim de mês
- **WHEN** a entrada é 31/01/2027
- **THEN** o primeiro período vai de 31/01/2027 a 28/02/2027

#### Scenario: Valor inválido
- **WHEN** o valor por mês é zero ou fica em branco
- **THEN** o cadastro é rejeitado com a mensagem "Valor por mês deve ser maior que zero."

### Requirement: Renovação
Um administrador SHALL poder renovar a locação com um novo período que começa no dia seguinte ao término atual. A tela MUST sugerir a data final (+1 mês, véspera do mesmo dia) e o valor (valor mensal), e os dois MUST ser editáveis. A data final MUST ser igual ou posterior ao início do novo período, e o valor MUST ser maior que zero. O total da locação MUST ser a soma dos períodos.

#### Scenario: Renovar por um mês
- **WHEN** o período atual termina em 11/11/2026 e o administrador renova com a sugestão
- **THEN** entra o período de 12/11/2026 a 11/12/2026 de R$ 3.000,00, e o total passa a R$ 6.000,00

#### Scenario: Renovar por 15 dias com outro valor
- **WHEN** o administrador renova até 26/11/2026 por R$ 1.600,00
- **THEN** entra o período de 12/11/2026 a 26/11/2026 de R$ 1.600,00

#### Scenario: Data final antes do início
- **WHEN** a data final da renovação é anterior a 12/11/2026
- **THEN** a renovação é rejeitada com a mensagem "A data final deve ser igual ou posterior a 12/11/2026."

### Requirement: Desfazer renovação
Um administrador SHALL poder desfazer a última renovação. O primeiro período MUST NOT ser removido por essa ação.

#### Scenario: Desfazer
- **WHEN** a locação tem 3 períodos e o administrador desfaz a última renovação
- **THEN** ficam 2 períodos, e o término volta a ser o fim do segundo

#### Scenario: Só o primeiro período
- **WHEN** a locação tem só o primeiro período
- **THEN** a ação de desfazer não aparece, e a API rejeita a remoção

### Requirement: Edição da entrada e do valor mensal
A data de entrada e o valor por mês SHALL ser editáveis enquanto a locação tiver só o primeiro período, recalculando esse período. Com renovações, a entrada MUST ficar bloqueada, e o valor por mês MUST valer só como sugestão das próximas renovações.

#### Scenario: Editar antes de renovar
- **WHEN** a locação tem só o primeiro período e a entrada muda para 15/10/2026
- **THEN** o primeiro período passa a ser de 15/10/2026 a 14/11/2026

#### Scenario: Editar depois de renovar
- **WHEN** a locação tem renovações e o administrador tenta mudar a entrada
- **THEN** a alteração é rejeitada com a mensagem "Desfaça as renovações para alterar a data de entrada."

### Requirement: Situação e barra da locação
A listagem e o detalhe SHALL mostrar uma barra do período atual (o que contém hoje) com os dias decorridos desse período, e os dias restantes até o término da locação (fim do último período), que definem a cor. As situações são:
- **a iniciar:** hoje é antes da entrada; mostra "Entrada em dd/mm/aaaa" e a barra vazia;
- **em andamento:** mais de 14 dias restantes; barra neutra;
- **vence em breve:** de 7 a 14 dias restantes; barra laranja;
- **vencendo:** menos de 7 dias restantes; barra vermelha;
- **vencida:** hoje é depois do término; barra vermelha cheia e "Vencida há N dias".

Os dias restantes MUST ser contados de hoje até o término (no dia do término, 0, com o texto "Termina hoje").

#### Scenario: Laranja
- **WHEN** a locação termina em 26/10/2026 e hoje é 12/10/2026
- **THEN** a barra fica laranja com "Faltam 14 dias"

#### Scenario: Vermelha
- **WHEN** a locação termina em 18/10/2026 e hoje é 12/10/2026
- **THEN** a barra fica vermelha com "Faltam 6 dias"

#### Scenario: Renovada
- **WHEN** o primeiro período termina em 18/10/2026, a locação foi renovada até 17/11/2026 e hoje é 12/10/2026
- **THEN** a barra mede o período atual (até 18/10/2026), mostra "Faltam 36 dias" e fica neutra

#### Scenario: Vencida
- **WHEN** a locação terminou em 11/10/2026 e hoje é 12/10/2026
- **THEN** a barra fica vermelha cheia com "Vencida há 1 dia"
