# Tasks

> Backend: `./mvnw test`. Front: `npm run lint`, `npx tsc --noEmit`, `npm run build` e verificação no navegador (Playwright no scratchpad), com backend e `next dev` reiniciados.

## 1. Backend (repositório App-adm-obras)

- [x] 1.1 Criar no backend a change OpenSpec com D1 e D2 (`openspec new change`) e verificar `openspec validate --strict`
- [x] 1.2 Implementar no core `MealAdjustment`, `Meal.addAdjustment`/`removeAdjustment` e o novo cálculo (D1). Verificar com testes de domínio: cenário da spec (R$ 452,00/dia, 10 dias úteis, 1 sem fornecimento, extra de R$ 163,00 em 10/10/2026, total R$ 4.231,00), data repetida, fora do período, dia extra em dia útil, sem fornecimento no sábado, quantidades zeradas e ajuste fora do período após mudar o término
- [x] 1.3 Migração V6, entidade JPA, mappers, endpoints aninhados e campos novos na resposta (D2). Verificar com testes de integração (201, 204, 409, 400 com os códigos, cascata ao excluir a refeição, total da obra) e `./mvnw test` verde
- [x] 1.4 Atualizar README e OpenAPI. Verificar o JSON real de `GET /api/meals/{id}` com ajustes contra D2

## 2. Front

- [x] 2.1 Atualizar `src/lib/types.ts` e `src/lib/errors.ts` (D2, D3) e verificar com `npx tsc --noEmit`
- [x] 2.2 Atualizar `MealCost` com dias sem fornecimento, dias extras e total (D3) e verificar no navegador o cenário da spec: total R$ 4.231,00
- [ ] 2.3 Criar a seção "Ajustes por data": lista, formulário, actions e remoção (D3). Verificar no navegador a inclusão dos dois tipos, as cinco mensagens de erro da spec, a remoção recalculando o total e o modo leitura para OPERADOR (simulado)
- [ ] 2.4 Atualizar `scripts/seed.mjs` com um dia extra e um sem fornecimento numa refeição e verificar `npm run seed` numa base limpa
- [ ] 2.5 Verificar em 375 px que a seção de ajustes não causa rolagem horizontal da página (a tabela rola dentro do próprio contêiner)

## 3. Integração

- [ ] 3.1 Rodar `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros

## Workflow follow-up

- Arquivar depois de `melhorias-design-refeicoes-cadastros` e `restaurante-custos-periodos`.
- Aplicar a V6 numa cópia da base real antes do deploy.
