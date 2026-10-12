# Tasks

## 1. Pré-requisitos

- [x] 1.1 Confirmar que `refrigerante-no-restaurante` e `refeicao-ajustes-por-data` estão implementadas e testadas no front e no backend (tarefas marcadas e fluxo de ajustes funcionando no navegador)

## 2. Backend (change OpenSpec própria em App-adm-obras)

- [x] 2.1 Abrir a change no backend com o contrato do design (D1, D2), aprovada pelo usuário antes de codar; verificar com `openspec status` no backend
- [x] 2.2 Domínio: `DayClosing`, `Meal.dayClosing`, `getTotalPrice()` como soma diária, `ClosingWeeks` e `WeekClosing`, com testes unitários dos cenários da spec (2 semanas, semanas parciais, obra sem término, semana padrão, R$ 2.423,00 + R$ 1.808,00 = R$ 4.231,00); `mvn test` verde
- [x] 2.3 Endpoints `GET .../weekly-closing` de refeição e restaurante e `POST/DELETE /api/restaurants/{id}/adjustments`, transacionais, com testes de integração (feriado nas 2 refeições, conflito desfaz tudo com 409, dia extra só nas refeições com quantidade, operador sem escrita); `mvn test` verde
- [x] 2.4 README do backend com os endpoints novos; verificar no Swagger

## 3. Front: tipos e componente

- [x] 3.1 `src/lib/types.ts` com `ClosingWeek`, `DayClosing`, `WeekClosing` e `DAY_STATUS`; `npx tsc --noEmit` sem erros
- [x] 3.2 `src/components/weekly-closing.tsx` (tabela e totais) e `WeekSelect` (dropdown com "parcial" e "atual", URL `?semana=`); `npm run lint` e `tsc` sem erros

## 4. Front: telas e edição

- [x] 4.1 Seção "Fechamento semanal" no detalhe da refeição e do restaurante, abaixo do quadro de projeção, lendo `searchParams.semana`; verificar no navegador que a semana padrão e a troca de semana seguem a spec
- [x] 4.2 Ações de feriado e dia extra na linha do dia: na refeição via `adjustment-actions.ts`, no restaurante via `closing-actions.ts` novo; verificar no navegador os cenários "Feriado no restaurante", "Conflito em uma das refeições", "Desmarcar feriado" e "Sábado só com almoço no restaurante"
- [ ] 4.3 `src/lib/errors.ts` com a mensagem do 404 da remoção por data; verificar que a remoção de data sem ajuste mostra a mensagem
- [x] 4.4 Operador: abrir o restaurante como OPERADOR e confirmar dropdown e tabela sem botões de edição
- [x] 4.5 Conferir no navegador que a soma das semanas de uma refeição do seed é igual ao total estimado dela, e que a tabela não gera rolagem horizontal da página em 1366 px e em celular

## 5. Ajustes pedidos após o primeiro teste

- [x] 5.1 Página de edição (`/restaurantes/[id]/editar`, `/refeicoes/[id]/editar`) e botão "Editar" no cabeçalho; detalhe sem formulário. Verificar no navegador: editar e salvar; OPERADOR sem botão
- [x] 5.2 Fechamento em largura total, sem rolagem interna; lista de dias no celular. Verificar em 1366 px (tabela sem rolagem) e 375 px (sem rolagem da página)
- [x] 5.3 Exportação .xlsx da semana (Route Handler) no restaurante e na refeição. Verificar abrindo o arquivo: 7 dias, sábado R$ 163,00, total R$ 2.423,00 igual à tela

## Workflow follow-up

- Arquivar depois de `refrigerante-no-restaurante` e `refeicao-ajustes-por-data`.
