# Tasks

> Verificação: `npm run lint`, `npx tsc --noEmit`, `npm run build` e navegador (Playwright no scratchpad com o Chrome do sistema), backend com perfil `test` na porta 8090.

## 1. Refatoração

- [x] 1.1 Ler em `node_modules/next/dist/docs/` o guia de layouts, Client Components e Server Actions da versão do projeto e anotar qualquer diferença que afete D1 a D5
- [x] 1.2 Extrair `Brand` e `UserMenu` (props com nome e perfis) de `layout.tsx` e transformar `SidebarNav` em `NavMenu({ pathname, onNavigate })` (D1, D2, D4); verificar em 1366 px, por captura antes e depois, que o desktop não mudou

## 2. Celular

- [x] 2.1 `MobileBar` com botão "Abrir menu", logo e "Sair", e o painel em `<dialog>` com `NavMenu`, usuário e "Sair" no rodapé (D3, D5); `layout.tsx` com `<aside>` e `<header>` só a partir de `sm`. Verificar `tsc` e lint
- [x] 2.2 Verificar no navegador em 375 px os cenários da spec: título da página na primeira tela, sem rolagem horizontal; "Abrir menu" → "Restaurantes" fecha o painel e marca o item ativo; Esc e toque fora fecham sem navegar; "Sair" da barra leva ao login; foco preso no painel (Tab não sai dele)
- [x] 2.3 Comparar os itens do painel e do menu do desktop (mesmas seções, itens e ordem) e conferir em 1366 px que a barra do celular não aparece

## 3. Integração

- [x] 3.1 `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros

## Workflow follow-up

- Arquivar depois de `melhorias-design-refeicoes-cadastros`, `sidebar-menu-botoes` e `ajuste-sidebar-logo-dashboard`.
