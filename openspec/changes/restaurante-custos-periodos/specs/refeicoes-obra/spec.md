# Spec Delta

## MODIFIED Requirements

### Requirement: Custo por dia
O custo por dia de uma refeição SHALL ser a soma de três parcelas:
- **marmitas:** para cada refeição servida, quantidade por dia × preço unitário;
- **entrega:** entregas por dia × taxa de entrega do restaurante (zero sem taxa);
- **refrigerante:** entregas por dia × preço do refrigerante (zero sem refrigerante).

Cada refeição servida conta como uma entrega por dia. A tela MUST mostrar as três parcelas e o total.

#### Scenario: Almoço e jantar
- **WHEN** a refeição tem almoço com 10 × R$ 25,00 e jantar com 8 × R$ 22,00, sem taxa de entrega e sem refrigerante
- **THEN** o custo por dia exibido é R$ 426,00

#### Scenario: Com entrega e refrigerante
- **WHEN** a refeição é Almoço e jantar com almoço 10 × R$ 25,00 e jantar 8 × R$ 22,00, o restaurante cobra R$ 8,00 por entrega e o refrigerante custa R$ 5,00
- **THEN** a tela mostra marmitas R$ 426,00, entrega R$ 16,00 (2 entregas), refrigerante R$ 10,00 (2 unidades) e custo por dia de R$ 452,00

#### Scenario: Só almoço com entrega
- **WHEN** a refeição é Almoço com 10 × R$ 25,00, o restaurante cobra R$ 8,00 por entrega e não há refrigerante
- **THEN** o custo por dia é R$ 258,00, com 1 entrega

## ADDED Requirements

### Requirement: Refrigerante por entrega
A refeição SHALL aceitar um preço unitário de refrigerante opcional. Quando informado, o preço MUST ser maior que zero e é fornecido 1 refrigerante por entrega. Vazio significa que a refeição não inclui refrigerante.

#### Scenario: Refeição sem refrigerante
- **WHEN** o administrador salva uma refeição com o preço do refrigerante vazio
- **THEN** a refeição é salva e a parcela de refrigerante do custo por dia é R$ 0,00

#### Scenario: Preço inválido
- **WHEN** o administrador informa preço de refrigerante zero ou negativo
- **THEN** o envio é rejeitado com a mensagem "Preço do refrigerante deve ser maior que zero."

### Requirement: Projeção por período
Para cada refeição, o sistema SHALL calcular quantidade e valor por período de fechamento, multiplicando os valores diários por dias úteis fixos: Dia = 1, Semana = 5, 15 dias = 10, Mês = 22. Por período MUST haver marmitas de almoço, marmitas de jantar, entregas, refrigerantes e valor. A tela MUST indicar quantos dias úteis cada período considera.

#### Scenario: Semana
- **WHEN** a refeição é Almoço e jantar com almoço 10 × R$ 25,00, jantar 8 × R$ 22,00, entrega R$ 8,00 e refrigerante R$ 5,00
- **THEN** a semana (5 dias úteis) mostra 50 almoços, 40 jantares, 10 entregas, 10 refrigerantes e R$ 2.260,00

#### Scenario: Mês
- **WHEN** a mesma refeição é vista no período Mês
- **THEN** o mês (22 dias úteis) mostra 220 almoços, 176 jantares, 44 entregas, 44 refrigerantes e R$ 9.944,00
