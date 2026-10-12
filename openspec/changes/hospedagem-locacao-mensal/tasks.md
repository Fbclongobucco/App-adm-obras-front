# Tasks

> Backend: `./mvnw test`. Front: `npm run lint`, `npx tsc --noEmit` e verificação no navegador com backend e `next dev` reiniciados.

## 1. Backend (change OpenSpec própria em App-adm-obras)

- [x] 1.1 Abrir a change no backend com D1 e D2; verificar `openspec validate --strict`
- [x] 1.2 Domínio: `AccommodationPeriod`, `monthEnd`, `configureLease`, `renew`, `undoRenewal`, `getEndDate` e `getTotalPrice`. Verificar por testes unitários: 12/10 → 11/11, 31/01 → 28/02, renovação sugerida e editada, data final inválida, desfazer até o primeiro período e entrada bloqueada após renovar
- [x] 1.3 Migração V8, entidade, mappers, DTOs e endpoints de renovação. Verificar por teste de migração (conversão dos dados atuais e fim de mês no H2) e por testes de integração (criar, renovar, desfazer, 409, 400 com os códigos, 403 para OPERADOR e total da obra); `./mvnw test` verde
- [x] 1.4 README e OpenAPI. Verificar no README e em `OpenApiDocumentationIntegrationTest`

## 2. Front

- [x] 2.1 `types.ts`, `errors.ts`, `lib/lease.ts` e `LeaseProgress`. Verificar com `npx tsc --noEmit`, `npm run lint` e as 5 situações nos limites (15, 14, 7, 6, 0 e −1 dias) num script de verificação
- [x] 2.2 Formulário (entrada e valor mensal), página de edição, detalhe com locação, períodos, renovação e desfazer. Verificar no navegador: criar, renovar com sugestão, renovar 15 dias com outro valor, data final inválida, desfazer, entrada bloqueada após renovar e OPERADOR sem ações
- [x] 2.3 Coluna "Locação" na listagem e no detalhe da obra. Verificar no navegador as cores laranja (14 dias), vermelha (6 dias) e vencida, e 375 px sem rolagem da página
- [ ] 2.4 `scripts/seed.mjs` com hospedagens nas três situações e uma renovada. Verificar `npm run seed` numa base limpa
