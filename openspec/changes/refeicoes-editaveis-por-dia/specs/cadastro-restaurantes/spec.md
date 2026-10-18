# Spec Delta

## MODIFIED Requirements

### Requirement: Taxa de entrega opcional
O cadastro de restaurante SHALL aceitar duas taxas de entrega opcionais, em reais, cobradas por entrega: "Taxa por entrega do almoço" e "Taxa por entrega do jantar". Quando informada, cada taxa MUST ser maior que zero. Taxa vazia significa que a entrega daquela refeição não é cobrada. A entrega do almoço MUST usar a taxa do almoço, e a do jantar, a taxa do jantar. Restaurantes cadastrados antes desta mudança MUST ficar com a taxa anterior nas duas refeições.

#### Scenario: Restaurante sem taxa
- **WHEN** o administrador salva um restaurante com as duas taxas de entrega vazias
- **THEN** o restaurante é salvo e as refeições dele têm parcela de entrega R$ 0,00

#### Scenario: Taxas diferentes
- **WHEN** o administrador salva um restaurante com entrega do almoço R$ 8,00 e do jantar R$ 10,00
- **THEN** a refeição Almoço e jantar desse restaurante tem parcela de entrega de R$ 18,00 por dia

#### Scenario: Só o almoço cobra entrega
- **WHEN** o restaurante tem entrega do almoço R$ 8,00 e a do jantar vazia
- **THEN** a refeição Jantar desse restaurante tem parcela de entrega R$ 0,00

#### Scenario: Taxa inválida
- **WHEN** o administrador informa taxa de entrega do almoço ou do jantar zero ou negativa
- **THEN** o envio é rejeitado com a mensagem "Taxa de entrega deve ser maior que zero."

#### Scenario: Taxa alterada
- **WHEN** uma das taxas de entrega de um restaurante é alterada
- **THEN** o custo por dia, o total estimado, a projeção por período e o fechamento semanal das refeições desse restaurante passam a usar a nova taxa

#### Scenario: Restaurante existente
- **WHEN** um restaurante cobrava R$ 8,00 por entrega antes desta mudança
- **THEN** ele passa a ter entrega do almoço R$ 8,00 e do jantar R$ 8,00, e nenhum valor calculado muda

### Requirement: Card do restaurante
A listagem de restaurantes SHALL exibir cada restaurante em card com:
- nome, obra, telefone, taxa de entrega e refrigerante ("Sem refrigerante" quando vazio);
- a taxa de entrega aparece como um valor único quando as duas são iguais, como "Almoço R$ x · Jantar R$ y" quando diferem, com "sem taxa" na refeição vazia, e "Sem taxa" quando as duas são vazias;
- marmitas por dia de almoço e de jantar, entregas por dia e refrigerantes por dia, somando as refeições do restaurante;
- quadro com as colunas Dia, Semana (5 dias úteis), 15 dias (10 dias úteis) e Mês (22 dias úteis), e as linhas de quantidade de marmitas e valor.

O card inteiro MUST levar ao detalhe do restaurante. O cabeçalho do detalhe MUST mostrar a taxa de entrega no mesmo formato.

#### Scenario: Restaurante com almoço e jantar
- **WHEN** o restaurante cobra entrega de R$ 8,00 no almoço e no jantar, fornece refrigerante a R$ 5,00 e serve uma refeição Almoço e jantar com almoço 10 × R$ 25,00 e jantar 8 × R$ 22,00
- **THEN** o card mostra "R$ 8,00 por entrega", "Refrigerante: R$ 5,00 por entrega", 10 almoços, 8 jantares, 2 entregas e 2 refrigerantes por dia, e o quadro mostra R$ 452,00 (Dia), R$ 2.260,00 (Semana), R$ 4.520,00 (15 dias) e R$ 9.944,00 (Mês)

#### Scenario: Taxas diferentes no card
- **WHEN** o restaurante cobra entrega do almoço R$ 8,00 e do jantar R$ 10,00, fornece refrigerante a R$ 5,00 e serve a mesma refeição
- **THEN** o card mostra "Almoço R$ 8,00 · Jantar R$ 10,00" e o quadro mostra R$ 454,00 (Dia), R$ 2.270,00 (Semana), R$ 4.540,00 (15 dias) e R$ 9.988,00 (Mês)

#### Scenario: Restaurante sem refeição
- **WHEN** o restaurante ainda não tem refeição cadastrada
- **THEN** o card informa "Nenhuma refeição cadastrada" no lugar do quadro

#### Scenario: Navegação
- **WHEN** o usuário clica no card
- **THEN** a aplicação abre o detalhe do restaurante, que mostra o mesmo quadro de períodos
