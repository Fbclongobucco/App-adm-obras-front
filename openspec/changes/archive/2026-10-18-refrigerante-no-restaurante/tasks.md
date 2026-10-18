# Tasks

> Backend: `./mvnw test`. Front: `npm run lint`, `npx tsc --noEmit`, `npm run build` e verificação no navegador (Playwright no scratchpad), com backend e `next dev` reiniciados.

## 1. Backend (repositório App-adm-obras)

- [x] 1.1 Criar no backend a change OpenSpec com D1, D2 e D3 (`openspec new change`) e verificar `openspec validate --strict`
- [x] 1.2 Mover `sodaPrice` de `Meal` para `Restaurant` no core (D1). Verificar com testes de domínio: R$ 452,00/dia com refrigerante do restaurante, alteração do preço refletindo em todas as refeições, `restaurant.invalid.soda_price` para zero ou negativo
- [x] 1.3 Migração (próxima versão livre) com cópia por `MAX` e remoção da coluna (D3), DTOs, mappers e entidades. Verificar com teste de migração (preços diferentes e restaurante misto) e `./mvnw test` verde
- [x] 1.4 Atualizar README e OpenAPI. Verificar o JSON real de `GET /api/restaurants` (com `sodaPrice`) e de `GET /api/meals/{id}` (com `sodaPrice` igual ao do restaurante)

## 2. Front

- [x] 2.1 Atualizar `types.ts` e `errors.ts` (D4) e verificar com `npx tsc --noEmit`
- [ ] 2.2 Campo de refrigerante no formulário de restaurante (criar e editar) e remoção do formulário de refeição (D4). Verificar no navegador: criar com R$ 5,00, editar para R$ 6,00 refletindo no card, apagar mostrando "Sem refrigerante", zero com a mensagem da spec e ausência do campo em "Nova refeição"
- [x] 2.3 Exibir o refrigerante no card e no detalhe do restaurante e ajustar o rótulo em `MealCost` (D4). Verificar no navegador o cenário da spec: card com "R$ 8,00 por entrega", "Refrigerante: R$ 5,00 por entrega" e quadro R$ 452,00 / R$ 2.260,00 / R$ 4.520,00 / R$ 9.944,00
- [ ] 2.4 Atualizar `scripts/seed.mjs` e verificar `npm run seed` numa base limpa
- [ ] 2.5 Rodar o diagnóstico de vazamento em `/restaurantes` de 375 a 1920 px

## 3. Integração

- [ ] 3.1 Rodar `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros

## Workflow follow-up

- Arquivar depois de `restaurante-custos-periodos`.
- Rodar a migração numa cópia da base real e conferir os restaurantes com refeições mistas antes do deploy.
