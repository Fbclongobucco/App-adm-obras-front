# Design

## Context

- **Backend:** arquitetura hexagonal, com a regra no core, como o usuário pediu. A última migração é a V4.
  - `Meal` já calcula `getDailyPrice`, `getWorkingDays` e `getTotalPrice` na leitura, a partir de `MealType`, que sabe se serve almoço e jantar.
  - `Restaurant` tem nome, telefone, endereço e obra, sem taxa.
  - `GET /api/restaurants` devolve o restaurante com `project`, sem as refeições.
- **Front:**
  - `/restaurantes` é `DataTable`.
  - O detalhe mostra `ProjectBanner` e o formulário.
  - `MealCost` (em `refeicoes/form.tsx`) mostra custo por dia, dias úteis e total.
  - Existe `panel` e há grade `auto-fill` proposta em `dashboard-cards-sem-vazamento`.
- Decisões do usuário: projeção fixa de 5, 10 e 22 dias úteis; taxa por entrega no restaurante; 1 refrigerante por entrega, com preço na refeição.

## Goals / Non-Goals

**Goals:**
- Regra de custo (entregas, refrigerante, períodos) só no domínio do backend. O front apenas exibe e soma por restaurante.
- Valores atuais preservados enquanto taxa e refrigerante estiverem vazios.

**Non-Goals:**
- Registro de fechamentos semanais efetivados (histórico, pago ou a pagar).
- Refrigerante com quantidade diferente de 1 por entrega e taxa de entrega diferente por refeição.
- Calendário real de semanas e meses.

## Decisions

### D1. Domínio (backend, `core/domain`)
- `Restaurant.deliveryFee: BigDecimal | null`. Null ou maior que zero; zero ou negativo lança `InvalidRestaurantException.invalidDeliveryFee` (`restaurant.invalid.delivery_fee`).
- `Meal.sodaPrice: BigDecimal | null`, com a mesma regra (`meal.invalid.soda_price`).
- `MealType.deliveriesPerDay()`: 1 para LUNCH e DINNER, 2 para LUNCH_AND_DINNER.
- `Meal` calcula na leitura, sem persistir:
  - `getMealsDailyPrice()`: soma atual;
  - `getDeliveryDailyPrice()` = entregas × taxa do restaurante;
  - `getSodaDailyPrice()` = entregas × `sodaPrice`;
  - `getDailyPrice()` = soma das três parcelas;
  - `getTotalPrice()` continua `dailyPrice × workingDays` e passa a incluir entrega e refrigerante.
- `enum BillingPeriod { DAY(1), WEEK(5), FORTNIGHT(10), MONTH(22) }` em `core/domain`.
  - `Meal.projection(BillingPeriod)` devolve um value object `MealProjection { period, workingDays, lunchMeals, dinnerMeals, deliveries, sodas, price }`.
- **Alternativa:** projeção no front. Descartada porque o usuário pediu a regra a partir do core. O fechamento é uma regra de negócio e precisa bater com relatórios futuros.

### D2. Contrato da API
```
POST/PUT /api/restaurants   + deliveryFee (number | null)
RestaurantSummary           + deliveryFee
Restaurant (detalhe e lista) + meals: MealSummary[]

POST/PUT /api/meals         + sodaPrice (number | null)
MealSummary                 + sodaPrice, deliveriesPerDay,
                              mealsDailyPrice, deliveryDailyPrice, sodaDailyPrice,
                              dailyPrice (agora inclui entrega e refrigerante),
                              projections: [{ period: "DAY"|"WEEK"|"FORTNIGHT"|"MONTH",
                                              workingDays, lunchMeals, dinnerMeals,
                                              deliveries, sodas, price }]
```
- `restaurant` dentro de `MealSummary` (RestaurantSummary) passa a trazer `deliveryFee`, para o detalhe da refeição mostrar a taxa.
- A listagem de restaurantes busca as refeições pelo restaurante no use case (`MealRepository.findByRestaurant`), sem relação bidirecional no domínio.
- Na V5, `restaurant.delivery_fee NUMERIC(19,2) NULL` e `meal.soda_price NUMERIC(19,2) NULL`. Os dados existentes ficam null e os valores não mudam.

### D3. Front
- `types.ts` segue D2.
- `RestaurantForm`: campo "Taxa de entrega por entrega (R$)", opcional, com a dica "Deixe vazio se o restaurante não cobra entrega".
- `MealForm`: campo "Refrigerante: preço unitário (R$)", opcional, com a dica "1 refrigerante por entrega. Deixe vazio se não fornece".
- `MealCost`: mostra marmitas, entrega (N entregas), refrigerante (N unidades), custo por dia, dias úteis e total estimado.
- `PeriodTable` (novo, `src/components/period-table.tsx`): recebe uma lista de projeções e soma por período quando o restaurante tem mais de uma refeição (por exemplo, Almoço e Jantar separados).
  - Colunas: Dia | Semana (5 d.u.) | 15 dias (10 d.u.) | Mês (22 d.u.).
  - Linhas: Almoços, Jantares, Entregas, Refrigerantes e Valor (negrito, Roboto Mono).
  - Linhas zeradas em todos os períodos são omitidas.
  - Envolvido em `overflow-x-auto`.
- `RestaurantCard` (novo): `panel` com link e cabeçalho (nome, obra, telefone, taxa ou "Sem taxa"), seguido de `PeriodTable` ou de "Nenhuma refeição cadastrada".
  - Grade `grid-cols-[repeat(auto-fill,minmax(min(36rem,100%),1fr))]`. Na escala de 18 px, o quadro de 5 colunas precisa de cerca de 570 px mais o padding do card; a estimativa inicial de 440 px (26 rem) escondia a coluna Mês atrás da rolagem em 1536 px e foi corrigida na implementação. Os números por dia usam `auto-fill` com mínimo de 9 rem e ficam lado a lado em cards largos.
- Detalhe do restaurante: `PeriodTable` acima do formulário. O detalhe da refeição usa o mesmo quadro com a projeção daquela refeição.
- O seed passa a usar taxa de entrega em metade dos restaurantes e refrigerante em metade das refeições.

## Risks / Trade-offs

- [`dailyPrice` muda de significado] → o valor só muda quando taxa ou refrigerante são preenchidos. O README do backend registra que o valor agora inclui entrega e refrigerante. O front mostra as parcelas para o usuário ver a composição.
- [Mês fixo de 22 dias úteis difere do mês real (20 a 23)] → o rótulo explicita "22 d.u.", e o total até o término continua usando os dias úteis reais da obra.
- [Lista de restaurantes com N consultas de refeições] → o use case busca todas as refeições dos restaurantes da página numa só consulta (`findByRestaurantIn`).

## Migration Plan

1. Backend: change OpenSpec própria com D1 e D2, V5 e testes. Aplicar a V5 numa cópia da base antes de produção.
2. Front: tipos, formulários, cards e seed, publicados junto com o backend, porque os campos novos são aditivos.
3. Rollback: os campos são anuláveis. Reverter o código basta, e a V5 pode ficar.
