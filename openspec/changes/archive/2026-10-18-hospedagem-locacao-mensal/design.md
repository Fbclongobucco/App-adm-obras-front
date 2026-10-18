# Design

## Context

- **Backend:**
  - `Accommodation` (core) tem `days` (1 a 365), `totalPrice` informado, `isContract`, `capacity`, endereço obrigatório, colaboradores e obra opcional.
  - `Project.getTotalPrice()` soma o `totalPrice` das hospedagens.
  - A tabela `accommodation` (V1) tem `days` e `total_price` obrigatórios e `project_id` opcional. A última migração é a V7.
  - A data de hoje vem do `Clock` (UTC), como no fechamento semanal.
- **Front:**
  - `/hospedagens` é `DataTable` com colunas Diárias e Total; o detalhe da obra repete a tabela;
  - o detalhe da hospedagem mostra o formulário;
  - `ProjectProgress` e `lib/progress.ts` já desenham a barra de prazo da obra.
- Decisões do usuário: locação mensal com renovação editável; laranja com 2 semanas, vermelho com menos de 1; dados atuais são de teste; "contrato" continua.

## Goals / Non-Goals

**Goals:**
- Períodos e situação da locação calculados no core, com o front só exibindo.
- Mesmo padrão de detalhe e edição usado em restaurantes e refeições.

**Non-Goals:**
- Pagamentos ou vencimento de parcelas dentro do período.
- Avisos fora da tela, como e-mail, e alerta no dashboard (fica para uma change própria, se for pedido).
- Diária ou valor proporcional automático: o valor de cada período é o informado.

## Decisions

### D1. Domínio (backend, `core/domain`)
- `AccommodationPeriod` (entidade do core): `id`, `startDate`, `endDate`, `price`, com auditoria. `days()` = dias corridos, inclusive as duas pontas.
- `Accommodation`:
  - ganha `startDate`, `monthlyPrice` e a lista ordenada `periods`;
  - perde `days` e `totalPrice` informados.
- `Accommodation.monthEnd(start)`: véspera do mesmo dia no mês seguinte; quando o dia não existe no mês seguinte, o último dia desse mês. Ex.: 12/10 → 11/11; 31/01 → 28/02.
- Criação e edição:
  - `configureLease(startDate, monthlyPrice)` valida o valor (> 0, `accommodation.invalid.monthly_price`) e a data (obrigatória, `accommodation.invalid.start_date`);
  - sem renovações, recria o primeiro período com o novo valor;
  - com renovações, mudar a entrada lança `accommodation.lease.renewed` (409), e mudar o valor só altera `monthlyPrice`.
- `renew(endDate, price)`: o início é o término atual + 1. Rejeita `endDate` antes do início (`accommodation.invalid.renewal_end`) e valor ≤ 0 (`accommodation.invalid.renewal_price`). Valores ausentes usam a sugestão: `monthEnd(início)` e `monthlyPrice`.
- `undoRenewal()` remove o último período; com um só período, lança `accommodation.lease.first_period` (409).
- Leitura: `getEndDate()` (fim do último período) e `getTotalPrice()` (soma dos períodos).
- **Situação da locação calculada no front (decidido na implementação):** a cor e os dias restantes dependem do "hoje" do usuário. O resumo da hospedagem é montado em mappers estáticos (inclusive dentro da obra), sem acesso ao `Clock`. A barra de prazo da obra já segue esse padrão (`lib/progress.ts` com `lib/today`). As regras de período, renovação e desfazer continuam no core; a API expõe os períodos, e `lib/lease.ts` calcula a situação com os limites 14 e 7.
- `Project.getTotalPrice()` continua somando `getTotalPrice()` das hospedagens, agora calculado.
- **Alternativa:** guardar só a entrada e o número de meses. Descartada porque as renovações podem ter duração e valor diferentes.

### D2. API
```
POST/PUT /api/accommodations   { hostName, hostPhone, address, capacity, isContract, projectId, employeeIds,
                                 startDate, monthlyPrice }            (sem days e totalPrice)
AccommodationSummary           + startDate, monthlyPrice, endDate, totalPrice (calculado),
                                 periods: [{ id, startDate, endDate, days, price }]
Accommodation (detalhe)        + nextRenewal: { startDate, endDate, price }   (sugestão)
POST   /api/accommodations/{id}/renewals          { endDate?, price? }  -> 201 Accommodation
DELETE /api/accommodations/{id}/renewals/last     -> 204
```
- Escrita só para ADMIN, como nos demais recursos.
- Migração `V8__locacao_mensal_da_hospedagem.sql`:
  - cria `accommodation_period` (`id`, `accommodation_id` com FK `ON DELETE CASCADE`, `start_date`, `end_date`, `price`, auditoria), com `UNIQUE (accommodation_id, start_date)`;
  - adiciona `start_date` e `monthly_price` em `accommodation`;
  - preenche `start_date` com `project.start_date` ou `created_at::date`, e `monthly_price` com `total_price`;
  - insere o primeiro período com o fim do mês calculado em SQL (`start_date + interval '1 month' - interval '1 day'`, ajustado ao último dia quando o dia não existe), compatível com H2 e PostgreSQL;
  - torna as colunas obrigatórias e remove `days` e `total_price`.
- **Alternativa:** manter `days` e `total_price` como colunas derivadas. Descartada porque duplicaria dados e permitiria divergência.

### D3. Front
- `types.ts`: `AccommodationPeriod` e os campos de D2; `lib/lease.ts` calcula a situação (`UPCOMING`, `ACTIVE`, `ENDING_SOON`, `ENDING`, `EXPIRED`). `errors.ts` recebe as mensagens da spec.
- `AccommodationForm`:
  - saem "Diárias" e "Valor total";
  - entram "Data de entrada" e "Valor por mês (R$)";
  - com renovações, a entrada fica desabilitada, com a dica "Desfaça as renovações para alterar a entrada."
- `LeaseProgress` (`src/components/lease-progress.tsx`):
  - barra do período atual com os textos "Faltam N dias", "Termina hoje", "Vencida há N dias" e "Entrada em dd/mm/aaaa";
  - cores: `bg-title` neutra, `bg-[#D97706]` laranja e `bg-accent` vermelha (#A20606), sempre com o texto da situação para não depender só da cor;
  - laranja é cor de status, admitida pela identidade visual.
- `/hospedagens` e a tabela do detalhe da obra: saem Diárias e Total informado; entram a coluna "Locação" (barra compacta e término) e "Total" (soma dos períodos).
- Detalhe `/hospedagens/[id]`:
  - cabeçalho com "Editar" (admin) e excluir;
  - painel da locação: barra, entrada, valor mensal, término e total;
  - tabela de períodos (De, Até, Dias, Valor, com "Renovação" a partir do segundo);
  - formulário "Renovar" (admin) com data final e valor pré-preenchidos pela sugestão;
  - botão "Desfazer última renovação" quando há mais de um período.
- `/hospedagens/[id]/editar`: o formulário, como em restaurantes.
- Actions: `renewAccommodation` e `undoRenewal`, com `revalidatePath` do layout.
- Seed: hospedagens com entradas em datas diferentes, para mostrar as três cores, e uma com renovação.

## Risks / Trade-offs

- [Remoção de `days` e `total_price` quebra clientes da API] → o único cliente é este front, atualizado na mesma entrega. Implantar front e backend juntos.
- [Fim de mês em SQL difere entre bancos] → a migração usa só operações comuns aos dois, e um teste de migração confere 12/10 → 11/11 e 31/01 → 28/02 no H2.
- [Hoje em UTC] → após 21h no horário de Brasília, os dias restantes podem mudar um dia antes. É consistente com o fechamento semanal.

## Migration Plan

1. Backend: change OpenSpec própria, V8 e testes. Aplicar numa cópia da base antes de produção.
2. Front: tipos, formulário, barra, listagem, detalhe, edição e seed.
3. Rollback: reverter o código e restaurar o backup, porque a V8 remove `days` e `total_price`.
