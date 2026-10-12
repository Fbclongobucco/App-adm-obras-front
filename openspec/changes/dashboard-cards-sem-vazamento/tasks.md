# Tasks

> Verificação com `scratchpad/pw/overflow.mjs` (listagem de vazamentos por largura), `npm run lint`, `npx tsc --noEmit` e o `next dev` reiniciado.

## 1. Grades e cards

- [x] 1.1 Aplicar D1 e D2 aos indicadores em `src/app/(app)/page.tsx` e verificar com `npm run lint` e `npx tsc --noEmit`
- [x] 1.2 Aplicar D1 e D2 a `ProjectGrid` e `ProjectCard` em `src/components/project-card.tsx` e verificar com `npm run lint` e `npx tsc --noEmit`

## 2. Verificação

- [x] 2.1 Reiniciar o `next dev`, rodar o diagnóstico de vazamento de 375 a 1920 px no dashboard e em `/obras` e verificar que todas as larguras saem "ok". Se alguma falhar, ajustar o mínimo de D1 e repetir
- [x] 2.2 Capturar o dashboard em 768, 1536 e 1920 px e verificar que os indicadores ficam acima da lista e que não há rolagem horizontal da página

## Workflow follow-up

- Pedir ao usuário que confira na largura de tela dele com atualização forçada (Ctrl+Shift+R).
