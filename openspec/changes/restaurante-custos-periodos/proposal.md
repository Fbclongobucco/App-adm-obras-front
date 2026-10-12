# Proposal

## Why

O fechamento com os restaurantes é semanal, mas a aplicação só mostra custo por dia e total até o término da obra. Para fechar a semana, é preciso multiplicar de cabeça. Além disso, o custo real de alimentação inclui dois itens que o sistema ignora:
- taxa de entrega, cobrada só por alguns restaurantes;
- um refrigerante que a empresa fornece a cada entrega.

## What Changes

- **Taxa de entrega no restaurante** (backend e front): valor opcional por entrega. Vazio significa restaurante sem taxa. Cada refeição servida conta como uma entrega por dia: almoço ou jantar = 1, almoço e jantar = 2.
- **Refrigerante na refeição** (backend e front): preço unitário opcional, com 1 unidade por entrega. Vazio significa que a refeição não tem refrigerante.
- **Custo por dia da refeição** (**BREAKING** no valor de `dailyPrice`): passa a somar marmitas, entrega e refrigerante, com o detalhamento exposto pela API. O total estimado da refeição e o total da obra passam a incluir esses custos.
- **Projeção por período** (backend), usando os dias úteis da projeção fixa: semana = 5, 15 dias = 10, mês = 22. Para cada período, a API devolve quantidade de marmitas, entregas, refrigerantes e valor.
- **Cards de restaurante** (front): a listagem `/restaurantes` deixa de ser tabela e vira grade de cards. Cada card mostra:
  - obra, telefone e taxa de entrega;
  - marmitas por dia (almoço e jantar), entregas e refrigerantes por dia;
  - um quadro com dia, semana, 15 dias e mês, com quantidade e valor.
  
  O detalhe do restaurante mostra o mesmo quadro.
- Os formulários de restaurante e de refeição ganham os campos novos, e o detalhe da refeição mostra o custo por dia detalhado.

## Capabilities

### New Capabilities
- `cadastro-restaurantes`: taxa de entrega opcional e card do restaurante com a projeção por período das refeições que ele serve.

### Modified Capabilities
- `refeicoes-obra`:
  - o custo por dia passa a incluir entrega e refrigerante (MODIFIED);
  - entram o refrigerante por entrega e a projeção por período (ADDED).
  
  A capability é criada por `melhorias-design-refeicoes-cadastros`. Esta change deve ser arquivada depois dela.

## Impact

- **Backend (`App-adm-obras`)**: change OpenSpec própria, implementada a partir do core.
  - `Restaurant` ganha `deliveryFee`.
  - `Meal` ganha `sodaPrice`, entregas por dia, detalhamento do custo diário e projeção por período.
  - Migração Flyway V5.
  - DTOs e mappers de restaurante e refeição; `RestaurantResponse` passa a trazer `meals`.
  - Testes.
- **Front**:
  - `src/lib/types.ts`;
  - formulários e páginas de `restaurantes` e `refeicoes`;
  - novos componentes de card de restaurante e de quadro de períodos;
  - `src/lib/errors.ts`;
  - `scripts/seed.mjs`.
- **Dados existentes:** restaurantes sem taxa e refeições sem refrigerante. Os valores atuais não mudam até alguém preencher os campos.
