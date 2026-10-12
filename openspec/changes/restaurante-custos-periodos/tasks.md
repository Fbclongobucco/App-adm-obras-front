# Tasks

> Backend: `./mvnw test`. Front: `npm run lint`, `npx tsc --noEmit`, `npm run build` e verificações no navegador (Playwright no scratchpad), com backend e `next dev` reiniciados.

## 1. Backend (repositório App-adm-obras)

- [x] 1.1 Criar no backend a change OpenSpec com D1 e D2 (`openspec new change`) e verificar `openspec validate --strict`
- [x] 1.2 Implementar no core: `deliveryFee` em `Restaurant`, `sodaPrice` em `Meal`, `MealType.deliveriesPerDay`, parcelas do custo diário, `BillingPeriod` e `MealProjection`. Verificar com testes de domínio para os cenários da spec: R$ 452,00/dia, semana R$ 2.260,00, mês R$ 9.944,00, almoço com entrega R$ 258,00 e taxa e refrigerante inválidos
- [x] 1.3 Migração V5, entidades, mappers, DTOs, `findByRestaurantIn` e `meals` na resposta do restaurante. Verificar com testes de integração e `./mvnw test` verde
- [x] 1.4 Atualizar o README do backend e as descrições OpenAPI com o contrato de D2 e verificar o JSON real de `GET /api/restaurants` e `GET /api/meals/{id}` contra D2

## 2. Front: tipos, formulários e mensagens

- [x] 2.1 Atualizar `src/lib/types.ts` conforme D2 e verificar com `npx tsc --noEmit`
- [x] 2.2 Campo de taxa no formulário de restaurante e de refrigerante no de refeição (D3), actions e `errors.ts` (`restaurant.invalid.delivery_fee`, `meal.invalid.soda_price`). Verificar no navegador que valores vazios salvam e que zero mostra a mensagem da spec
- [x] 2.3 Atualizar `MealCost` com as parcelas (D3) e verificar no detalhe de uma refeição Almoço e jantar com taxa R$ 8,00 e refrigerante R$ 5,00: marmitas R$ 426,00, entrega R$ 16,00, refrigerante R$ 10,00, custo por dia R$ 452,00

## 3. Front: quadro de períodos e cards

- [x] 3.1 Criar `src/components/period-table.tsx` (soma por período, linhas zeradas omitidas, rótulos com os dias úteis) e verificar com `npm run lint` e `npx tsc --noEmit`
- [x] 3.2 Criar o card de restaurante e trocar a tabela de `/restaurantes` pela grade de cards (D3). Verificar no navegador o cenário da spec (R$ 452,00, R$ 2.260,00, R$ 4.520,00, R$ 9.944,00) e o restaurante sem refeição
- [x] 3.3 Quadro de períodos no detalhe do restaurante e no detalhe da refeição. Verificar por captura
- [x] 3.4 Verificar que nenhum conteúdo dos cards de restaurante vaza de 375 a 1920 px (diagnóstico `overflow.mjs` adaptado para `/restaurantes`) e que não há rolagem horizontal da página em 375 px

## 4. Seed e integração

- [x] 4.1 Atualizar `scripts/seed.mjs` (taxa em metade dos restaurantes, refrigerante em metade das refeições) e verificar `npm run seed` numa base limpa
- [x] 4.2 Rodar `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros

## Workflow follow-up

- Arquivar após `melhorias-design-refeicoes-cadastros` (cria `refeicoes-obra`).
- Aplicar a V5 numa cópia da base real antes do deploy.
