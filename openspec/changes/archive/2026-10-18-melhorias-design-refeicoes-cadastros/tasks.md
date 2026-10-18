# Tasks

> O front não tem suíte de testes automatizados. A verificação usa `npm run lint`, `npx tsc --noEmit` e checagem manual com `npm run dev` contra o backend local com seed.

## 1. Identidade visual e logo

- [x] 1.1 Confirmar com o usuário o domínio oficial da SOLER, baixar a logo (SVG ou PNG transparente) para `public/soler-logo.*` e verificar que o arquivo abre com as cores e a proporção originais
- [x] 1.2 Ajustar os tokens e estilos base em `src/app/globals.css` conforme D4 e verificar que `npm run lint` e `npx tsc --noEmit` passam
- [x] 1.3 Redesenhar o shell em `src/app/(app)/layout.tsx` e `src/components/sidebar.tsx`: menu grafite, faixa branca com a logo via `next/image` linkando para `/`, item ativo com barra `accent`. Verificar no navegador a navegação e o destaque do item ativo
- [x] 1.4 Aplicar superfícies e cabeçalho de tabela de D4 em `data-table.tsx`, `page-header.tsx`, `notice.tsx` e `pagination.tsx`. Verificar numa listagem que o cabeçalho se distingue das linhas
- [x] 1.5 Redesenhar os KPIs do dashboard em `src/app/(app)/page.tsx` (número `3xl`, filete `highlight`, link para a listagem). Verificar que os cartões aparecem acima da lista sem rolagem em 1366×768
- [x] 1.6 Adicionar a logo à tela de login em `src/app/login/page.tsx`. Verificar com a sessão encerrada
- [x] 1.7 Verificar contraste mínimo de 4,5:1 nos textos do menu escuro, dos cabeçalhos de tabela e dos rótulos de KPI com os valores hex de D4, e o layout em 375 px sem rolagem horizontal da página

## 2. Seleção de colaboradores

- [x] 2.1 Criar `src/components/form/multi-select.tsx` conforme D6 (gatilho, chips removíveis, painel com busca sem acento, teclado, Esc e clique fora, inputs ocultos) e verificar com `npx tsc --noEmit`
- [x] 2.2 Usar `MultiSelect` no formulário de obra (`obras/form.tsx`) e verificar no navegador: buscar "jose" encontra "José", a seleção fora do filtro é mantida e salvar a obra persiste a equipe
- [x] 2.3 Usar `MultiSelect` no formulário de hospedagem (`hospedagens/form.tsx`) e verificar que salvar persiste os hóspedes
- [x] 2.4 Usar `MultiSelect` com `searchable={false}` nos perfis de `usuarios/form.tsx`, remover `multi-check.tsx` e verificar que `grep -r MultiCheck src` não retorna nada e que `npm run lint` passa
- [x] 2.5 Verificar o modo leitura (usuário OPERADOR) em obra e hospedagem: lista não abre e não há remoção. Verificar os cenários de teclado da spec `selecao-colaboradores`

## 3. E-mail opcional (front)

- [x] 3.1 Tornar `email` `string | null` em `ClientSummary` e `EmployeeSummary` (`src/lib/types.ts`) e corrigir os usos apontados por `npx tsc --noEmit`
- [x] 3.2 Remover `required` do e-mail em `clientes/form.tsx` e `colaboradores/form.tsx` e exibir "—" para e-mail nulo em `clientes/page.tsx` e onde o e-mail de colaborador aparecer. Verificar com o backend da change de e-mail que cliente e colaborador são salvos sem e-mail e que e-mail inválido ou duplicado mostra a mensagem da spec

## 4. Backend (dependência, repositório App-adm-obras)

- [x] 4.1 Abrir no backend a change OpenSpec com o contrato de D2 (refeições e `meals` na obra), D7 (e-mail anulável) e a migração Flyway V4. Verificar que a proposta foi aprovada pelo usuário
- [x] 4.2 Confirmar que a change do backend está implementada e que `GET /api/meals` e `GET /api/projects/{id}` devolvem o formato de D2 na base local com seed

## 5. Refeições por obra (front, após o grupo 4)

- [x] 5.1 Atualizar `MEAL_TYPES`, `MealSummary`, `Meal` e `Project` (`meals` no lugar de `lunch`/`dinner`) em `src/lib/types.ts` conforme D2 e verificar com `npx tsc --noEmit`, que deve apontar todos os usos antigos
- [x] 5.2 Reescrever `refeicoes/form.tsx` com campos condicionais por tipo (D3), sem data, e `refeicoes/actions.ts` com `lunchQuantity`/`lunchPrice`/`dinnerQuantity`/`dinnerPrice`. Verificar no navegador os três tipos e o preço inválido
- [x] 5.3 Atualizar a listagem `refeicoes/page.tsx` e o detalhe `refeicoes/[id]/page.tsx` (custo por dia, dias úteis, total estimado; "depende da data de término" sem término). Verificar com uma obra de 05/10/2026 a 16/10/2026 e almoço 10 × R$ 25,00 + jantar 8 × R$ 22,00, esperando R$ 426,00/dia, 10 dias úteis e R$ 4.260,00
- [x] 5.4 Atualizar o detalhe da obra (`obras/[id]/page.tsx`) para listar `project.meals` e remover `lunchId`/`dinnerId` de `obras/actions.ts`. Verificar que editar e salvar a obra mantém as refeições
- [x] 5.5 Atualizar `src/lib/errors.ts`: novos códigos de D2, nova mensagem de `meal.duplicate.type` e remoção de `meal.invalid.date.future`. Verificar que cadastrar Almoço numa obra com Almoço e jantar mostra a mensagem da spec
- [x] 5.6 Atualizar `scripts/seed.mjs` para o contrato novo (sem `date`, sem `lunchId`/`dinnerId`, com uma obra de Almoço e jantar) e verificar que `npm run seed` conclui sem erro contra a base limpa

## 6. Integração

- [x] 6.1 Rodar `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros
- [x] 6.2 Percorrer o fluxo completo com o seed: dashboard, obra (equipe e refeições), refeição Almoço e jantar, hospedagem, cliente e colaborador sem e-mail, em desktop e em 375 px

## Workflow follow-up

- Arquivar a change após a revisão do usuário (`/opsx:archive`).
