# Proposal

## Why

O preço do refrigerante foi colocado no cadastro da refeição (`restaurante-custos-periodos`). O usuário procura o campo no cadastro do restaurante, ao lado da taxa de entrega, e não o encontra nem ao criar nem ao editar. Na operação, o refrigerante é uma condição do fornecimento do restaurante, como a entrega, e não de cada refeição.

## What Changes

- **Refrigerante no restaurante** (backend e front): preço unitário opcional no cadastro do restaurante, na criação e na edição, ao lado da taxa de entrega. Vale para todas as refeições do restaurante, com 1 refrigerante por entrega. Vazio significa que o restaurante não fornece refrigerante.
- **Sai da refeição** (**BREAKING**):
  - o campo some do formulário de refeição;
  - a API de refeição deixa de aceitar `sodaPrice` na escrita;
  - na leitura, `sodaPrice` passa a refletir o valor do restaurante.
- **Migração de dados:** cada restaurante recebe o maior preço de refrigerante entre as refeições dele. Se havia refeições com e sem refrigerante no mesmo restaurante, todas passam a incluir refrigerante. A migração registra esse caso e o usuário deve conferir.
- **Exibição:** card e detalhe do restaurante mostram "Refrigerante: R$ X por entrega" ou "Sem refrigerante". O detalhe da refeição mostra a origem ("do restaurante").
- O seed passa a definir o refrigerante no restaurante.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `refeicoes-obra`:
  - "Custo por dia" (MODIFIED): o refrigerante vem do restaurante;
  - "Refrigerante por entrega" (REMOVED): a regra vai para `cadastro-restaurantes`.
- `cadastro-restaurantes`:
  - novo requisito de refrigerante no restaurante (ADDED);
  - "Card do restaurante" (MODIFIED): passa a exibir o refrigerante.

Ambas vêm de changes ainda não arquivadas. Esta deve ser arquivada depois de `restaurante-custos-periodos`.

## Impact

- **Backend (`App-adm-obras`):** change OpenSpec própria, a partir do core.
  - `Restaurant.sodaPrice` com a validação de hoje (`restaurant.invalid.soda_price`).
  - `Meal` passa a ler o preço do restaurante, e `meal.invalid.soda_price` deixa de existir.
  - DTOs e mappers.
  - Migração na próxima versão livre (V6 ou V7, conforme a ordem de implementação em relação a `refeicao-ajustes-por-data`): `restaurant.soda_price`, cópia dos dados e remoção de `meal.soda_price`.
  - Testes.
- **Front:**
  - formulário e actions de restaurante (campo novo) e de refeição (remoção do campo);
  - `src/lib/types.ts`;
  - `src/lib/errors.ts`;
  - card e detalhe de restaurante;
  - `MealCost`;
  - `scripts/seed.mjs`.
- Se `refeicao-ajustes-por-data` for implementada antes, o valor do dia extra passa a usar o refrigerante do restaurante, sem mudança de regra.
