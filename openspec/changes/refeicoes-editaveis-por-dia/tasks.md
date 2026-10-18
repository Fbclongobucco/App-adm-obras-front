# Tasks

> Backend: `./mvnw test`. Front: `npm run lint`, `npx tsc --noEmit`, `npm run build` e verificação no navegador (Playwright no scratchpad), com backend e `next dev` reiniciados.

## 1. Pré-requisitos

- [x] 1.1 Confirmar que `fechamento-semanal-refeicoes` está implementada no front e no backend (tarefas 2.x a 5.x marcadas e fechamento funcionando no navegador com o seed)

## 2. Backend (change OpenSpec própria em App-adm-obras)

- [x] 2.1 Abrir a change no backend com o contrato do design (D1 a D5), aprovada pelo usuário antes de codar; verificar com `openspec validate --strict` no backend
- [x] 2.2 `Restaurant` com `lunchDeliveryFee` e `dinnerDeliveryFee` e `Meal.getDeliveryDailyPrice()` pelas duas taxas (D1); testes de domínio: R$ 452,00 com taxas iguais, R$ 454,00 com R$ 8,00 e R$ 10,00, Jantar sem taxa do jantar = entrega R$ 0,00; `./mvnw test` verde
- [x] 2.3 `MealAdjustment` com `CHANGED`, `lunchDeliveries`, `dinnerDeliveries`, `sodas`, padrões efetivos, `price` com as duas taxas e `Meal.putAdjustment` com as regras da D2; testes: R$ 489,00, R$ 484,00, R$ 432,00, dia extra R$ 163,00 e R$ 266,00, `CHANGED` no sábado, zerado, entrega sem marmita, refrigerante sem fornecimento e substituição mantendo o id; `./mvnw test` verde
- [x] 2.4 `DayClosing` com `CHANGED`, entregas separadas, `note` e `meals` no restaurante; `getTotalPrice()` como soma de `dayClosing` e `getChangedDays()` (D3); testes: semana R$ 2.305,00, total R$ 4.575,00, regressão R$ 4.231,00 e situação do restaurante com jantar suspenso; `./mvnw test` verde
- [x] 2.5 Migração V10 (D5), entidades, mappers, DTOs e os dois `PUT .../adjustments/{date}` (D4), transacionais; testes de integração: PUT cria e substitui, restaurante com jantar zerado gera `NO_SERVICE`, refeição igual ao padrão sem ajuste, erro em uma refeição desfaz tudo, `mealId` alheio 400, contrato do restaurante com as duas taxas; `./mvnw test` verde
- [x] 2.6 README e OpenAPI; conferir o JSON real de `GET /api/restaurants/{id}/weekly-closing` e `GET /api/meals/{id}` contra D3 e D4

## 3. Front: tipos e restaurante

- [x] 3.1 `src/lib/types.ts` e `src/lib/errors.ts` (D6), com as mensagens da spec; `npx tsc --noEmit` sem erros
- [x] 3.2 Cadastro do restaurante com as duas taxas (`restaurantes/form.tsx`, `actions.ts`) e `DeliveryFee` no card e no cabeçalho do detalhe; verificar no navegador os cenários "Taxas diferentes", "Taxa inválida" e "Taxas diferentes no card" (R$ 454,00 / R$ 2.270,00 / R$ 4.540,00 / R$ 9.988,00)
- [x] 3.3 Detalhe da refeição: parcela de entrega com as duas taxas, dias alterados no total e tipo "Dia alterado" na seção "Ajustes por data" com entregas e refrigerantes; verificar no navegador custo por dia R$ 454,00 e total R$ 4.575,00

## 4. Front: fechamento semanal

- [x] 4.1 `DayForm` do dia (almoços, jantares, entregas do almoço e do jantar, refrigerantes, observação), pré-preenchido, e `DayActions` conforme D6; actions `putDay` e `putRestaurantDay`; verificar no navegador na refeição: "Uma janta a mais", "Restaurar padrão", "Duas entregas no almoço" (R$ 489,00) e "Incluir jantares no sábado" (R$ 266,00)
- [x] 4.2 Mesmo fluxo no restaurante, com campos por refeição; verificar no navegador "Restaurante com jantar suspenso no dia" e "Erro em uma refeição do restaurante" (nada gravado)
- [x] 4.3 Situação "Fornecimento alterado" na tabela e na lista do celular; verificar em 1366 px e 375 px sem rolagem horizontal da página, com o formulário aberto
- [x] 4.4 Operador: abrir refeição e restaurante como OPERADOR e confirmar que não há "Editar" nem "Restaurar padrão"

## 5. Front: planilha e seed

- [x] 5.1 `closing-xlsx.ts` e os dois Route Handlers com entregas do almoço e do jantar e as duas taxas; verificar abrindo o arquivo: cenário "Exportar a semana com dia alterado" (14/10 R$ 489,00, total R$ 2.305,00) e regressão R$ 2.423,00
- [x] 5.2 `scripts/seed.mjs` com um restaurante de taxas diferentes e uma refeição com dia alterado; verificar `npm run seed` numa base limpa

## 6. Integração

- [x] 6.1 `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros; conferir no navegador que a soma das semanas de uma refeição do seed com dia alterado é igual ao total estimado

## Workflow follow-up

- Arquivar depois de `fechamento-semanal-refeicoes` e das changes que ela exige.
- Aplicar a V10 numa cópia da base real e conferir que nenhum total mudou antes do deploy.
