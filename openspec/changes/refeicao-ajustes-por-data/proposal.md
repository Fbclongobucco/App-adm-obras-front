# Proposal

## Why

O total estimado de cada refeição conta todos os dias de segunda a sexta do período da obra. Na prática, há exceções:
- feriado em dia útil em que o restaurante não fornece;
- sábado, domingo ou feriado trabalhado em que o restaurante fornece, muitas vezes com outra quantidade de marmitas.

Hoje não existe como registrar essas exceções, e o total fica diferente do que será cobrado.

## What Changes

- **Ajustes por data na refeição** (backend e front): o administrador cadastra e remove datas avulsas de dois tipos.
  - **Dia extra:** sábado ou domingo em que o restaurante fornece, inclusive feriado no fim de semana. Exige as quantidades de almoço e de jantar do dia, conforme o tipo da refeição. Preços, taxa de entrega e refrigerante são os da refeição. Soma ao total.
  - **Sem fornecimento:** dia útil (segunda a sexta), tipicamente um feriado, em que o restaurante não fornece. Desconta um dia útil do total.
  - Os dois tipos têm uma observação opcional, por exemplo "Feriado de N. Sra. Aparecida".
- **Total estimado:** passa a ser custo por dia × (dias úteis − dias sem fornecimento) + soma dos dias extras. O total da obra acompanha.
- **Detalhe da refeição:** nova seção "Ajustes por data", com a lista (data, dia da semana, tipo, quantidades, valor e observação), formulário de inclusão e remoção. Só administrador altera.
- Fora do escopo:
  - calendário geral de feriados;
  - ajuste de quantidade em dia útil normal;
  - mudança na projeção fixa por período (Dia, Semana, 15 dias, Mês), que continua uma projeção padrão.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `refeicoes-obra`: o total estimado passa a considerar os ajustes (MODIFIED), e entram o cadastro e as regras dos ajustes por data (ADDED). A capability é criada por `melhorias-design-refeicoes-cadastros`, e esta change deve ser arquivada depois dela e de `restaurante-custos-periodos`.

## Impact

- **Backend (`App-adm-obras`):** change OpenSpec própria, a partir do core.
  - Entidade de domínio do ajuste ligada a `Meal`.
  - Regras de data e tipo.
  - Novo cálculo de dias e de total.
  - Migração V6, com a tabela `meal_adjustment`.
  - Endpoints aninhados em `/api/meals/{id}/adjustments`.
  - Campos novos na resposta da refeição.
  - Testes.
- **Front:**
  - `src/lib/types.ts`;
  - detalhe da refeição: seção, formulário e actions;
  - `MealCost`, que passa a mostrar os ajustes no total;
  - `src/lib/errors.ts`;
  - `scripts/seed.mjs`.
