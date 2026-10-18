# Design

## Context

Estado atual (backend `App-adm-obras` e este front), depois de `fechamento-semanal-refeicoes`:
- `Restaurant` tem uma taxa única (`deliveryFee`) e `sodaPrice`.
- `Meal.getDailyPrice()` = marmitas + `deliveriesPerDay` × taxa + refrigerantes; `deliveriesPerDay` vem do tipo da refeição (1 por refeição servida).
- `MealAdjustment` tem os tipos `EXTRA_DAY` e `NO_SERVICE`, quantidades de almoço e jantar e observação. Entregas e refrigerantes são derivados: 1 entrega por refeição com quantidade > 0, 1 refrigerante por entrega. Tabela `meal_adjustment` (V7), `UNIQUE (meal_id, date)`.
- `Meal.dayClosing(date)` monta o `DayClosing`; `getTotalPrice()` ainda usa a fórmula custo por dia × dias de fornecimento + extras, e não a soma de `dayClosing`.
- Endpoints de ajuste: `POST/DELETE /api/meals/{id}/adjustments[/{adjustmentId}]`, `POST /api/restaurants/{id}/adjustments`, `DELETE /api/restaurants/{id}/adjustments/{date}`. Não há edição de ajuste.
- Front: `src/components/weekly-closing.tsx` (Client Component) tem `DayForm` (feriado e dia extra) e `DayActions`; actions em `refeicoes/[id]/adjustment-actions.ts` e `restaurantes/[id]/closing-actions.ts`; planilha em `src/lib/closing-xlsx.ts`.
- Última migração: V9.

## Goals / Non-Goals

**Goals:**
- Um único cálculo de valor do dia no core, usado pelo total estimado, pelo fechamento e pela planilha.
- Reaproveitar `MealAdjustment` para o dia alterado, sem tabela nova.
- Gravação do dia por data, idempotente, para o mesmo formulário servir a inclusão e a edição.

**Non-Goals:**
- Histórico das alterações do dia além da auditoria já existente (`created_at`/`updated_at` e a auditoria da V9).
- Taxa de entrega por refeição cadastrada (fica no restaurante).

## Decisions

### D1. Taxa de entrega por refeição (backend)
- `Restaurant`: `lunchDeliveryFee` e `dinnerDeliveryFee` (opcionais, > 0) no lugar de `deliveryFee`. Validação e mensagem atuais (`restaurant.invalid.delivery.fee`) valem para as duas.
- `Meal.getDeliveryDailyPrice()` = taxa do almoço (se serve almoço) + taxa do jantar (se serve jantar). Projeções seguem `getDailyPrice()`.
- API de restaurante troca `deliveryFee` por `lunchDeliveryFee` e `dinnerDeliveryFee` na entrada e na saída. **Breaking** só entre backend e este front, que são publicados juntos.
- **Alternativa:** manter `deliveryFee` e adicionar só `dinnerDeliveryFee`. Descartada: o nome ficaria ambíguo e o card teria de explicar que "taxa" é a do almoço.

### D2. Ajuste do dia (core)
- `MealAdjustment.Type` ganha `CHANGED` (dia útil). Campos novos opcionais: `lunchDeliveries`, `dinnerDeliveries`, `sodas` (`Integer`, `null` = padrão), usados por `EXTRA_DAY` e `CHANGED`; descartados em `NO_SERVICE`.
- Regras em `Meal.addAdjustment` / novo `Meal.putAdjustment` (ordem: período, tipo × dia da semana, quantidades, entregas, refrigerantes):
  - `CHANGED` só de segunda a sexta → `meal.adjustment.invalid.changed_day`;
  - quantidades: regra atual do dia extra (0 a 10.000, ao menos uma > 0);
  - entregas: 0 a 100 → `meal.adjustment.invalid.deliveries`; entrega > 0 com quantidade 0 → `meal.adjustment.invalid.delivery_without_meal`;
  - refrigerantes: 0 a 10.000 → `meal.adjustment.invalid.sodas`; > 0 sem `sodaPrice` no restaurante → `meal.adjustment.invalid.soda_not_supplied`.
  - Códigos na convenção existente do backend (`snake_case` no último segmento).
- Padrões efetivos, calculados em `MealAdjustment`: `lunchDeliveries()` = informado ou (almoços > 0 ? 1 : 0); idem jantar; `sodas()` = informado ou, com refrigerante, soma das entregas; sem refrigerante, 0.
- `price(meal)` = marmitas + entregas do almoço × taxa do almoço + entregas do jantar × taxa do jantar + refrigerantes × preço.
- `putAdjustment(adjustment)`: substitui o ajuste da mesma data (mantém o `id` e a auditoria de criação) ou inclui. `addAdjustment` continua rejeitando data repetida.
- Os limites de 0 a 100 entregas e 0 a 10.000 refrigerantes são escolha deste design, para barrar erro de digitação; ajustáveis sem mudar o resto.

### D3. Dia e total (core)
- `DayClosing.Status` ganha `CHANGED`; `DayClosing` ganha `lunchDeliveries`, `dinnerDeliveries` e `note` (`deliveries` = soma). `isServiceDay()` inclui `CHANGED`.
- `Meal.dayClosing` trata `CHANGED` e `EXTRA_DAY` com os números efetivos do ajuste.
- `getTotalPrice()` passa a somar `dayClosing` de todos os dias do período (decisão D1 de `fechamento-semanal-refeicoes`, ainda não aplicada no código). Valores em `BigDecimal` com 2 casas, sem divisão: a soma é exata. Novo `getChangedDays()` para a tela.
- Restaurante, por dia, prioridade da situação: `EXTRA_DAY` › `NO_SERVICE` (todas) › `CHANGED` (alguma refeição alterada) › `SERVICE` › `OFF`/`OUT_OF_PERIOD`. Parte das refeições sem fornecimento num dia `SERVICE` ou `CHANGED` marca `partialNoService`, e a tela mostra "Sem fornecimento (parcial)", como antes.
- No fechamento do restaurante, cada dia passa a trazer `meals: [{ mealId, lunchMeals, dinnerMeals, lunchDeliveries, dinnerDeliveries, sodas }]`, para o formulário abrir preenchido por refeição.

### D4. API de gravação do dia
```
PUT /api/meals/{id}/adjustments/{date}
    { type: EXTRA_DAY | CHANGED, lunchQuantity, dinnerQuantity,
      lunchDeliveries, dinnerDeliveries, sodas, note }               -> 200 MealAdjustmentResponse
PUT /api/restaurants/{id}/adjustments/{date}
    { type: EXTRA_DAY | CHANGED, note,
      meals: [{ mealId, lunchQuantity, dinnerQuantity,
                lunchDeliveries, dinnerDeliveries, sodas }] }        -> 204
```
- PUT da refeição: cria ou substitui o ajuste da data (`putAdjustment`). `NO_SERVICE` continua pelo POST.
- PUT do restaurante, `@Transactional`, primeiro erro desfaz tudo:
  - `EXTRA_DAY`: refeição com quantidade > 0 recebe o ajuste; as demais ficam sem ajuste na data;
  - `CHANGED`: refeição com todas as quantidades 0 recebe `NO_SERVICE`; refeição com números iguais ao padrão fica sem ajuste; as demais recebem `CHANGED`;
  - nenhuma refeição com quantidade > 0 → `meal.adjustment.invalid.quantity`;
  - `mealId` que não é do restaurante → 404 `meal.not_found`, como o POST existente;
  - refeição zerada com entregas informadas → 400 `meal.adjustment.invalid.delivery_without_meal`;
  - refeição ausente de `meals` não muda.
- "Restaurar padrão" usa os DELETE existentes (por id na refeição, por data no restaurante).
- **Alternativa:** `PATCH /adjustments/{adjustmentId}`. Descartada: o front teria de distinguir criar de editar e saber o id; por data, o mesmo formulário serve aos dois casos.

### D5. Migração V10 (backend)
```sql
alter table restaurant add column lunch_delivery_fee  numeric(19, 2);
alter table restaurant add column dinner_delivery_fee numeric(19, 2);
update restaurant set lunch_delivery_fee = delivery_fee, dinner_delivery_fee = delivery_fee;
alter table restaurant drop column delivery_fee;
alter table meal_adjustment add column lunch_deliveries  integer;
alter table meal_adjustment add column dinner_deliveries integer;
alter table meal_adjustment add column sodas             integer;
```
- Mesma precisão de `delivery_fee` na V5. Ajustes existentes ficam com `null` nos campos novos = padrão, sem mudar valor.

### D6. Front
- `types.ts`: `RestaurantSummary.lunchDeliveryFee`/`dinnerDeliveryFee`; `ADJUSTMENT_TYPES.CHANGED = "Dia alterado"`; `MealAdjustment` com `lunchDeliveries`, `dinnerDeliveries`, `sodas`; `DayStatus` `CHANGED` = "Fornecimento alterado"; `DayClosing` com `lunchDeliveries`, `dinnerDeliveries`, `note` e `meals?`.
- Restaurante: dois campos no `form.tsx` e em `actions.ts`; `DeliveryFee` passa a receber as duas taxas e formata conforme a spec (card e cabeçalho do detalhe).
- `weekly-closing.tsx`:
  - `DayForm` com `kind: "holiday" | "day"`; o `day` serve a dia útil (`CHANGED`) e a fim de semana (`EXTRA_DAY`). Campos por refeição: almoços, jantares, entregas do almoço, entregas do jantar e refrigerantes (só com `sodaPrice`), mais observação; valores iniciais do dia (`day` ou `day.meals[]`). Entregas e refrigerantes só vêm preenchidos quando diferem do padrão do dia; vazios seguem o padrão (placeholder "Padrão: 1"). Preencher sempre com o valor efetivo congelava o refrigerante ao mudar as entregas (achado na verificação no navegador).
  - `DayActions`: `SERVICE` → "Editar" e "Feriado"; `CHANGED` → "Editar" e "Restaurar padrão"; `EXTRA_DAY` → "Editar" e "Remover"; `OFF` → "Dia extra"; `NO_SERVICE` → "Desmarcar".
  - Status `CHANGED` com marcador discreto (`text-highlight`, sem fundo), como o dia extra.
- Actions: `putDay(mealId, date, input)` em `adjustment-actions.ts` e `putRestaurantDay(restaurantId, date, input)` em `closing-actions.ts`, com `revalidatePath("/", "layout")` como as atuais.
- `refeicoes/form.tsx` / `MealCost`: parcela de entrega com as duas taxas; contagem de dias alterados.
- Seção "Ajustes por data": coluna de entregas (almoço/jantar) e refrigerantes; o tipo `CHANGED` aparece na lista. Inclusão continua só para dia extra e sem fornecimento; a edição do dia é pelo fechamento.
- `closing-xlsx.ts`: colunas "Entregas almoço", "Valor", "Entregas jantar", "Valor"; preços com `lunchDeliveryFee` e `dinnerDeliveryFee`. Route Handlers passam as duas taxas.
- `errors.ts`: mensagens dos códigos novos da D2 e D4, com o texto da spec.
- `scripts/seed.mjs`: um restaurante com taxas diferentes e uma refeição com um dia alterado.

## Risks / Trade-offs

- [Contrato da API de restaurante muda] → backend e front publicados juntos; a V10 roda antes do front novo subir.
- [Restaurante "Restaurar padrão" apaga também feriado parcial da data] → é o comportamento atual do DELETE por data; a confirmação no botão diz "remove os ajustes da data em todas as refeições".
- [Dia alterado igual ao padrão na refeição grava ajuste sem efeito] → aceito; no restaurante, refeição igual ao padrão não grava (D4).
- [`getTotalPrice()` muda de fórmula] → os testes de `refeicao-ajustes-por-data` e `fechamento-semanal-refeicoes` servem de regressão, mais o cenário da spec (R$ 4.575,00).
- [Soma de entregas no restaurante com refeições separadas] → `lunchDeliveries` e `dinnerDeliveries` somam por refeição; a refeição Almoço contribui só com entregas do almoço, a Jantar só com as do jantar.

## Migration Plan

1. Backend: change OpenSpec própria; V10; testes de domínio (padrões efetivos, preço com duas taxas, `CHANGED` nas regras, total pela soma diária) e de integração (PUT da refeição e do restaurante, atomicidade, códigos de erro, contrato do restaurante).
2. Aplicar a V10 numa cópia da base real e conferir que o total de cada refeição não mudou.
3. Front: tipos, cadastro de restaurante, fechamento, planilha e seed; verificação no navegador.
4. Rollback: reverter código; a V10 é reversível recriando `delivery_fee` a partir de `lunch_delivery_fee` (perde a taxa do jantar diferente) e removendo as colunas novas de `meal_adjustment` e os ajustes `CHANGED`.
