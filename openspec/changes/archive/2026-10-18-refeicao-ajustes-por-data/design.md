# Design

## Context

- `Meal` (core) calcula na leitura:
  - `getWorkingDays()` (segunda a sexta entre início e término da obra);
  - `getDailyPrice()` (marmitas + entrega + refrigerante, conforme `restaurante-custos-periodos`);
  - `getTotalPrice()` = custo por dia × dias úteis;
  - `projection(BillingPeriod)`.
- A obra sem término devolve `workingDays` e `totalPrice` nulos.
- A última migração do backend é a V5.
- Front: o detalhe da refeição (`src/app/(app)/refeicoes/[id]/page.tsx`) mostra `MealCost` e o quadro de períodos. Formulários usam Server Actions com `saveResource`/`deleteResource` (`src/lib/actions.ts`).
- Decisões do usuário: ajustes por data na refeição ("Dia extra" e "Sem fornecimento"), com quantidades informadas no dia extra.

## Goals / Non-Goals

**Goals:**
- Regras de data, tipo e cálculo no domínio. O front só exibe e envia.
- Ajustes com a mesma composição de custo do dia normal: marmitas, entrega e refrigerante.

**Non-Goals:**
- Calendário de feriados compartilhado entre obras.
- Projeção por período com ajustes. Dia, Semana, 15 dias e Mês continuam fixos.
- Histórico de fechamentos.

## Decisions

### D1. Domínio
- `MealAdjustment` (entidade do core):
  - `id`, `date`, `type` (`EXTRA_DAY` | `NO_SERVICE`), `lunchQuantity`, `dinnerQuantity` e `note` (até 100 caracteres);
  - o `Meal` agrega a lista e é o único ponto de inclusão e remoção.
- `Meal.addAdjustment(...)` valida, nesta ordem:
  1. data dentro do período da obra (`meal.adjustment.invalid.date`);
  2. data não repetida (`meal.adjustment.duplicate.date`, 409);
  3. `EXTRA_DAY` só em sábado ou domingo (`meal.adjustment.invalid.extra_day`);
  4. `NO_SERVICE` só de segunda a sexta (`meal.adjustment.invalid.no_service`);
  5. no `EXTRA_DAY`, quantidades de 0 a 10.000 apenas das refeições servidas pelo tipo, com pelo menos uma maior que zero (`meal.adjustment.invalid.quantity`);
  6. no `NO_SERVICE`, quantidades nulas.
- `MealAdjustment.price(meal)` = Σ(quantidade × preço) + entregas × taxa + (refrigerante ? entregas × preço : 0). As entregas são as refeições com quantidade maior que zero.
- Cálculo na leitura:
  - `getNoServiceDays()` conta os ajustes `NO_SERVICE` dentro do período atual da obra;
  - `getServiceDays()` = `getWorkingDays()` − `getNoServiceDays()`;
  - `getExtraDaysPrice()` soma os `EXTRA_DAY` dentro do período;
  - `getTotalPrice()` = custo por dia × `getServiceDays()` + `getExtraDaysPrice()`.
- Se o término da obra mudar, ajustes fora do novo período ficam guardados, mas não entram no cálculo. A resposta marca cada ajuste com `inPeriod`.
- **Alternativa:** ajustes no restaurante. Descartada porque um restaurante pode ter refeições separadas (Almoço e Jantar) com fornecimentos diferentes no mesmo dia.

### D2. API
```
GET    /api/meals/{id}/adjustments            -> MealAdjustment[]
POST   /api/meals/{id}/adjustments            { date, type, lunchQuantity, dinnerQuantity, note } -> 201
DELETE /api/meals/{id}/adjustments/{adjId}    -> 204

MealAdjustment { id, date, weekday, type, lunchQuantity, dinnerQuantity, note,
                 deliveries, sodas, price, inPeriod }
MealSummary + { noServiceDays, extraDays, extraDaysPrice, serviceDays }   (totalPrice com ajustes)
Meal (detalhe) + { adjustments: MealAdjustment[] }   (ordenados por data)
```
- Escrita só para ADMIN, como nos demais recursos.
- Migração V6:
  - tabela `meal_adjustment` com `id`, `meal_id` (FK com `ON DELETE CASCADE`), `date`, `type` em VARCHAR, `lunch_quantity`, `dinner_quantity`, `note` e auditoria;
  - `UNIQUE (meal_id, date)`.
- Excluir a refeição remove os ajustes.

### D3. Front
- `types.ts`: `MealAdjustment`, campos novos de `MealSummary` e `Meal.adjustments`.
- `MealCost`: a linha de totais passa a mostrar dias úteis, sem fornecimento, dias extras (quantidade e valor) e total estimado.
- Seção "Ajustes por data" (`src/app/(app)/refeicoes/[id]/adjustments.tsx`):
  - tabela com data, dia da semana, tipo, almoço, jantar, valor, observação e uma ação de remover para administrador; os ajustes fora do período ficam esmaecidos, com o aviso "fora do período";
  - formulário de inclusão (Client Component): data, tipo (rádio "Dia extra" / "Sem fornecimento"), quantidades só no dia extra e só das refeições servidas, e observação;
  - dica fixa: "Feriado em dia útil já entra no cálculo. Marque 'Sem fornecimento' quando o restaurante não fornecer."
- Actions `addAdjustment(mealId, …)` e `removeAdjustment(mealId, adjId)` usam `apiCall` e `revalidatePath` do detalhe, e ficam na mesma página, sem redirecionar para a lista.
- `errors.ts` recebe as mensagens da spec para os 5 códigos novos.

## Risks / Trade-offs

- [Ajuste fica órfão quando o término da obra muda] → é guardado e marcado como fora do período, sem entrar no total. O administrador remove se quiser.
- [Feriado em dia útil continua contando por padrão] → a dica no formulário explica, e o padrão atual (sem desconto automático) se mantém, conforme a spec original.
- [`totalPrice` muda para refeições com ajustes] → só quando há ajustes. O total da obra acompanha, porque é calculado na leitura.

## Migration Plan

1. Backend: change OpenSpec própria, V6 e testes. Aplicar numa cópia da base antes de produção.
2. Front: tipos, seção de ajustes e totais. Os campos são aditivos e não quebram o contrato atual.
3. Rollback: reverter o código. A tabela `meal_adjustment` pode ficar sem uso.
