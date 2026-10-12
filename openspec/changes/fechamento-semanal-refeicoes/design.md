# Design

## Context

- Estado esperado ao implementar, depois de `refrigerante-no-restaurante` e `refeicao-ajustes-por-data`:
  - `Meal` (core) calcula `getDailyPrice()`, `getServiceDays()`, `getExtraDaysPrice()` e `getTotalPrice()`;
  - `MealAdjustment.price(meal)` calcula o valor do dia extra;
  - `Meal.addAdjustment(...)` concentra as validações de data, tipo e quantidade;
  - o refrigerante é do restaurante (`Restaurant.sodaPrice`), 1 por entrega;
  - ajustes ficam em `meal_adjustment` (V7), com `UNIQUE (meal_id, date)`.
- No backend, cada `Meal` pertence a um `Restaurant`, e a refeição chega à obra pelo restaurante.
- No front:
  - os detalhes de restaurante e de refeição são Server Components, com `PeriodTable`;
  - o detalhe da refeição tem `MealAdjustments` e as actions `adjustment-actions.ts`;
  - a busca nas listagens (`busca-nas-listagens`) já guarda estado na URL com `searchParams`.

## Goals / Non-Goals

**Goals:**
- Uma única regra de cálculo diário no core, usada pelo total estimado e pelo fechamento semanal, para os dois sempre baterem.
- Edição na semana sem novo modelo de dados: reaproveita `MealAdjustment`.

**Non-Goals:**
- Registro de fechamento efetivado (semana fechada, paga ou a pagar) e bloqueio de edição de semanas passadas.
- Dia de corte diferente de segunda, ou configurável por restaurante.
- Ajuste de quantidade em dia útil normal.
- Exportação do fechamento (PDF ou planilha).

## Decisions

### D1. Domínio (backend, `core/domain`)
- `Meal.dayClosing(LocalDate)` devolve o value object `DayClosing { date, status, lunchMeals, dinnerMeals, deliveries, sodas, price }`, com `status` em:
  - `OUT_OF_PERIOD`;
  - `NO_SERVICE`;
  - `EXTRA_DAY`, com os números de `MealAdjustment`;
  - `OFF` (sábado ou domingo sem ajuste);
  - `SERVICE`, com os números diários da refeição.
- `getTotalPrice()` passa a somar `dayClosing` de todos os dias do período. Assim, total e fechamento usam o mesmo cálculo.
  - **Alternativa:** manter a fórmula atual (custo por dia × dias de fornecimento + extras) e calcular o dia separadamente. Descartada porque duas fórmulas podem divergir. Os testes da change de ajustes continuam valendo como regressão.
- `ClosingWeeks.of(start, end | null, today)` (core) gera as semanas `Week { start, end, partial, current }`:
  - segunda da semana do início até o domingo da semana do término;
  - sem término, até a semana de hoje, mas nunca antes da semana do início;
  - corta `start` e `end` no período da obra.
- `ClosingWeeks.defaultWeek(today)` escolhe a semana atual, a primeira ou a última, conforme a spec.
- `WeekClosing { week, days: DayClosing[7], totals }` para uma refeição. Para o restaurante, soma dia a dia os `WeekClosing` das refeições dele. A situação do dia no restaurante segue esta prioridade:
  1. `EXTRA_DAY`, se alguma refeição tem dia extra;
  2. `NO_SERVICE`, se todas as refeições estão sem fornecimento;
  3. `SERVICE`, se alguma refeição fornece;
  4. `OFF` ou `OUT_OF_PERIOD`.

  Num dia em que só parte das refeições está sem fornecimento, a resposta traz `partialNoService: true`, e o front mostra "Sem fornecimento (parcial)".

### D2. API
```
GET /api/meals/{id}/weekly-closing?week=2026-10-12
GET /api/restaurants/{id}/weekly-closing?week=2026-10-12
  -> { weeks: [{ start, end, partial, current }],
       selected: "2026-10-12",
       days: [{ date, weekday, status, partialNoService, lunchMeals, dinnerMeals,
                deliveries, sodas, price, adjustmentIds: [uuid] }],
       totals: { serviceDays, lunchMeals, dinnerMeals, deliveries, sodas, price } }
```
- `week` é qualquer data da semana. Se for ausente, inválida ou fora da lista, o servidor usa a semana padrão e informa a escolhida em `selected`. A regra fica no servidor, e o front não calcula datas.
- `adjustmentIds` permite remover o ajuste direto da linha do dia.
- Edição no restaurante, transacional (`@Transactional` no use case):
```
POST   /api/restaurants/{id}/adjustments
       { date, type, note, quantities: [{ mealId, lunchQuantity, dinnerQuantity }] }  -> 201
DELETE /api/restaurants/{id}/adjustments/{date}                                        -> 204
```
  - `NO_SERVICE` cria o ajuste em todas as refeições. `EXTRA_DAY` cria só nas refeições com quantidade maior que zero. Sem nenhuma, retorna `meal.adjustment.invalid.quantity`.
  - Cada inclusão passa por `Meal.addAdjustment`. Qualquer erro desfaz tudo e devolve o código do primeiro erro, por exemplo `meal.adjustment.duplicate.date` com 409.
  - O DELETE remove os ajustes da data em todas as refeições do restaurante. Sem nenhum ajuste nessa data, retorna 404.
- Na refeição, a edição usa os endpoints de `/api/meals/{id}/adjustments`, que já existem.
- **Alternativa:** o front chamar o endpoint de cada refeição em sequência. Descartada porque não é atômico e deixaria o restaurante com feriado em só parte das refeições.

### D3. Front
- `types.ts`: `ClosingWeek`, `DayClosing`, `WeekClosing`, `DAY_STATUS` com os rótulos da spec.
- `WeeklyClosing` (`src/components/weekly-closing.tsx`, Server Component) recebe `WeekClosing`, `readOnly` e o contexto (refeição ou restaurante, com as refeições para o formulário de dia extra).
  - `WeekSelect` (Client Component): `<select>` com as semanas. Ao trocar, faz `router.replace` com `?semana=aaaa-mm-dd`, preservando os outros parâmetros e com `useTransition` para indicar carregamento.
  - Tabela com Dia | Situação | Almoços | Jantares | Entregas | Refrigerantes | Valor, números em Roboto Mono e linha de totais em `bg-surface`, envolvida em `overflow-x-auto`.
  - Linhas `OFF` e `OUT_OF_PERIOD` esmaecidas. `NO_SERVICE` e `EXTRA_DAY` com marcador de status discreto.
  - Ações por linha (administrador):
    - dia útil: "Marcar feriado" ou "Desmarcar";
    - sábado e domingo: "Dia extra" ou "Remover".
    - O dia extra abre um formulário inline com as quantidades das refeições servidas e a observação.
- As páginas `restaurantes/[id]` e `refeicoes/[id]` leem `searchParams.semana`, buscam o fechamento junto com os outros dados (`Promise.all`) e colocam a seção logo abaixo do `PeriodTable`.
- Actions:
  - `restaurantes/[id]/closing-actions.ts`, para o restaurante;
  - `adjustment-actions.ts` da refeição, reaproveitado;
  - ambos com `revalidatePath` do restaurante e das suas refeições.
- `errors.ts`: os códigos dos ajustes já existem. Entra a mensagem do 404 da remoção por data.

## Risks / Trade-offs

- [Mudar `getTotalPrice()` para soma diária pode alterar centavos] → os valores são `BigDecimal` com 2 casas e sem divisão, então a soma é exata. Os testes da change de ajustes servem de regressão.
- [Obra longa sem término gera muitas semanas no dropdown] → em 2 anos são cerca de 105 opções, aceitável num `<select>`. Busca por semana fica fora do escopo.
- [Feriado parcial no restaurante, criado pela refeição] → aparece como "Sem fornecimento (parcial)". O "Desmarcar" do restaurante remove de todas as refeições.
- [Dia futuro da semana atual aparece como fornecimento] → o fechamento é uma previsão até o fim da semana. Só o dia extra e o feriado alteram o valor.

## Migration Plan

1. Backend: change OpenSpec própria, sem migração. Testes de domínio (semanas, dia, soma igual ao total) e de integração dos endpoints.
2. Front: tipos, componente, páginas e actions, testados no navegador com o seed.
3. Rollback: reverter o código. Nenhum dado novo é gravado além dos ajustes, que já existem.
