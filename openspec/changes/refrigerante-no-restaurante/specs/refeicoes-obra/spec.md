# Spec Delta

## MODIFIED Requirements

### Requirement: Custo por dia
O custo por dia de uma refeição SHALL ser a soma de três parcelas:
- **marmitas:** para cada refeição servida, quantidade por dia × preço unitário;
- **entrega:** entregas por dia × taxa de entrega do restaurante (zero sem taxa);
- **refrigerante:** entregas por dia × preço do refrigerante do restaurante (zero quando o restaurante não fornece).

Cada refeição servida conta como uma entrega por dia. A tela MUST mostrar as três parcelas e o total.

#### Scenario: Almoço e jantar
- **WHEN** a refeição tem almoço com 10 × R$ 25,00 e jantar com 8 × R$ 22,00, sem taxa de entrega e sem refrigerante
- **THEN** o custo por dia exibido é R$ 426,00

#### Scenario: Com entrega e refrigerante
- **WHEN** a refeição é Almoço e jantar com almoço 10 × R$ 25,00 e jantar 8 × R$ 22,00, e o restaurante cobra R$ 8,00 por entrega e fornece refrigerante a R$ 5,00
- **THEN** a tela mostra marmitas R$ 426,00, entrega R$ 16,00 (2 entregas), refrigerante R$ 10,00 (2 unidades, do restaurante) e custo por dia de R$ 452,00

#### Scenario: Só almoço com entrega
- **WHEN** a refeição é Almoço com 10 × R$ 25,00, o restaurante cobra R$ 8,00 por entrega e não fornece refrigerante
- **THEN** o custo por dia é R$ 258,00, com 1 entrega

## REMOVED Requirements

### Requirement: Refrigerante por entrega
**Reason**: O preço do refrigerante passa a ser condição do restaurante, cadastrado junto da taxa de entrega, e não de cada refeição.
**Migration**: Informar o preço no cadastro do restaurante (requisito "Refrigerante no restaurante" de `cadastro-restaurantes`). A migração do banco copia para cada restaurante o maior preço já informado nas refeições dele.
