# Design

## Context

- **Hoje** (`restaurante-custos-periodos` e a change de backend `restaurante-entrega-refrigerante-periodos`):
  - `Restaurant.deliveryFee` fica no restaurante, e `Meal.sodaPrice`, na refeição;
  - `Meal.getSodaDailyPrice()` = entregas × `sodaPrice`;
  - a V5 criou `meal.soda_price`;
  - o front tem o campo de refrigerante em `refeicoes/form.tsx`, e `restaurantes/form.tsx` tem só a taxa.
- Decisão do usuário: mover o refrigerante para o restaurante, sem exceção por refeição.

## Goals / Non-Goals

**Goals:**
- Uma única fonte do preço do refrigerante: o restaurante.
- Contrato de leitura da refeição estável. `sodaPrice`, `sodaDailyPrice`, `projections` e os dias extras continuam com os mesmos nomes.

**Non-Goals:**
- Exceção por refeição, como "sem refrigerante no jantar".
- Quantidade de refrigerante diferente de 1 por entrega.

## Decisions

### D1. Domínio
- `Restaurant.sodaPrice: BigDecimal | null`, com a regra que hoje está em `Meal`: null ou maior que zero, senão `restaurant.invalid.soda_price`.
- `Meal` remove o atributo e o setter de `sodaPrice`. `getSodaPrice()` passa a delegar a `restaurant.getSodaPrice()`, e `getSodaDailyPrice()`, a projeção e o valor dos dias extras (se `refeicao-ajustes-por-data` existir) continuam iguais, lendo o valor do restaurante.
- `InvalidMealException.invalidSodaPrice` e o código `meal.invalid.soda_price` são removidos.
- **Alternativa:** manter `Meal.sodaPrice` como cópia sincronizada. Descartada porque teria duas fontes do mesmo dado.

### D2. API
```
POST/PUT /api/restaurants   + sodaPrice (number | null)
RestaurantSummary           + sodaPrice
POST/PUT /api/meals         - sodaPrice (campo ignorado se enviado; não é mais lido)
MealSummary.sodaPrice       = restaurant.sodaPrice (somente leitura)
```
- **BREAKING** só na escrita de refeição. A leitura mantém os nomes.
- O README registra a mudança.

### D3. Migração (próxima versão livre)
```sql
ALTER TABLE restaurant ADD COLUMN soda_price NUMERIC(19,2) NULL;
UPDATE restaurant r SET soda_price = (SELECT MAX(m.soda_price) FROM meal m WHERE m.restaurant_id = r.id);
ALTER TABLE meal DROP COLUMN soda_price;
```
- A subconsulta correlata funciona em H2 (`MODE=PostgreSQL`) e no PostgreSQL.
- `MAX` foi escolhido para não perder preço informado. O efeito colateral (refeições antes sem refrigerante passam a ter) aparece no teste de migração com dois cenários: restaurante com preços diferentes e restaurante com refeição com e sem refrigerante.
- **Alternativa:** manter `meal.soda_price` em desuso. Descartada para não deixar coluna morta e enganosa.

### D4. Front
- `restaurantes/form.tsx`: campo "Refrigerante: preço unitário (R$)", opcional, ao lado da taxa, com a dica "1 por entrega, em todas as refeições deste restaurante. Deixe vazio se não fornece". `restaurantes/actions.ts` envia `sodaPrice`.
- `refeicoes/form.tsx` e `actions.ts`: o campo e o envio de `sodaPrice` saem.
- `types.ts`: `RestaurantSummary.sodaPrice`. `MealSummary.sodaPrice` passa a ser documentado como "do restaurante".
- `errors.ts`: `meal.invalid.soda_price` sai e entra `restaurant.invalid.soda_price` com a mesma mensagem.
- `RestaurantCard` e o detalhe do restaurante mostram "Refrigerante: R$ X por entrega" ou "Sem refrigerante", com um componente irmão de `DeliveryFee`.
- `MealCost`: o rótulo vira "Refrigerante (N unidades, do restaurante)" ou "Restaurante não fornece".
- `scripts/seed.mjs`: `sodaPrice` vai para o POST de restaurante (em parte dos restaurantes) e sai do POST de refeição.

## Risks / Trade-offs

- [Clientes da API ainda enviando `sodaPrice` na refeição] → só existe o front, atualizado junto. O campo é ignorado, não rejeitado, como já acontece com campos desconhecidos.
- [Migração muda o custo de refeições sem refrigerante em restaurantes "mistos"] → decisão do usuário (sem exceção por refeição), registrada na proposta e coberta por teste. Antes do deploy, rodar numa cópia da base e listar os restaurantes afetados.
- [Ordem de migração com `refeicao-ajustes-por-data`] → o número da versão é definido na implementação, com a próxima livre.

## Migration Plan

1. Backend: change OpenSpec própria, migração, domínio, testes. Rodar numa cópia da base e conferir os restaurantes com refeições mistas.
2. Front, publicado junto: formulário de restaurante com o campo e formulário de refeição sem ele.
3. Rollback: reverter o código e restaurar a base pelo backup, porque a migração remove `meal.soda_price`.
