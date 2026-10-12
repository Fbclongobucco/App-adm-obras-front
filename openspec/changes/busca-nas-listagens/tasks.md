# Tasks

> Backend: `./mvnw test`. Front: `npm run lint`, `npx tsc --noEmit`, `npm run build` e verificação no navegador (Playwright no scratchpad), com backend e `next dev` reiniciados.

## 1. Backend (repositório App-adm-obras)

- [x] 1.1 Criar no backend a change OpenSpec com D1, D2 e D3 (`openspec new change`) e verificar `openspec validate --strict`
- [x] 1.2 Criar `SearchTerm` e `InvalidSearchException` no core (D1). Verificar com testes de domínio: vazio, espaços, acentos ("José Antônio" → "jose antonio"), escape de `%` e `_`, `digits()` de "529.982" e limite de 100 caracteres
- [x] 1.3 Busca paginada nas 8 portas de repositório, adaptadores JPA com `TRANSLATE` e `left join` (D2), use cases e controllers com `q` (D3). Verificar com testes de integração por recurso (um campo por recurso, um campo de relação, CPF formatado, `totalElements` filtrado, 400 com `page.invalid.query`) e `./mvnw test` verde
- [x] 1.4 Atualizar README e descrições OpenAPI com o parâmetro `q`. Verificar uma busca real com acento contra a API local

## 2. Front: base

- [x] 2.1 `getPage` com `q` (`src/lib/api.ts`) e `Pagination` preservando `q`. Verificar com `npx tsc --noEmit`
- [x] 2.2 Criar `src/components/search-field.tsx` (D4: atraso de 300 ms, `router.replace` sem `page`, limpar, `useTransition`, acessibilidade). Verificar com `npm run lint` e `npx tsc --noEmit`

## 3. Front: listagens

- [ ] 3.1 Aplicar busca, placeholder e estado "Nenhum resultado" em obras, clientes, colaboradores e centros de custo. Verificar no navegador uma busca por lista, incluindo "campo novo" em Obras e CPF formatado em Colaboradores
- [x] 3.2 Aplicar o mesmo em restaurantes, refeições, hospedagens e usuários. Verificar no navegador uma busca por lista, incluindo a OS em Refeições
- [ ] 3.3 Verificar no navegador: busca sem acento, URL com `q`, abrir link com `q` já filtrado, limpar busca, nova busca voltando para a página 1, paginação preservando `q` (com seed ampliado ou `size` reduzido) e resultado vazio com "Limpar busca"
- [ ] 3.4 Verificar em 375 px que o campo cabe sem rolagem horizontal da página e rodar o diagnóstico de vazamento nas listagens com cards

## 4. Integração

- [ ] 4.1 Rodar `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros

## Workflow follow-up

- Pedir ao usuário que confira com atualização forçada (Ctrl+Shift+R).
