# Proposal

## Why

O fechamento semanal usa a mesma quantidade de marmitas todos os dias úteis e só deixa editar feriado e dia extra. Na prática, a quantidade varia: há dia com uma janta a menos ou a mais. A entrega também varia: no almoço pode haver uma quantidade de entregas e na janta outra, e a taxa do almoço pode ser diferente da taxa da janta. Hoje essas diferenças ficam fora do sistema, e o fechamento não bate com a cobrança do restaurante.

## What Changes

- **Taxa de entrega separada por refeição** (backend e front), no cadastro do restaurante:
  - "Taxa por entrega" vira "Taxa por entrega do almoço" e "Taxa por entrega do jantar", ambas opcionais;
  - a migração copia a taxa atual para as duas, sem mudar nenhum valor existente;
  - custo por dia, projeções, card, detalhe e planilha passam a usar a taxa de cada refeição.
- **Dia editável no fechamento semanal** (backend e front), só administrador:
  - em dia útil com fornecimento, "Editar" abre o formulário do dia com almoços, jantares, entregas do almoço, entregas do jantar, refrigerantes e observação, preenchido com os valores do dia;
  - ao salvar, o dia passa à situação "Fornecimento alterado" e o valor é recalculado;
  - "Restaurar padrão" remove a alteração e o dia volta à quantidade da refeição;
  - o dia extra (sábado ou domingo) passa a usar o mesmo formulário e pode ser editado depois de incluído, sem remover e incluir de novo;
  - no detalhe do restaurante, o formulário pede os números de cada refeição, e a gravação é atômica.
- **Entregas e refrigerantes por dia:**
  - padrão: 1 entrega por refeição servida no dia (almoço e jantar contam separado) e 1 refrigerante por entrega quando o restaurante fornece, como hoje;
  - no dia alterado e no dia extra, entregas do almoço, entregas do jantar e refrigerantes podem ser informados; campo vazio usa o padrão.
- **Total estimado e fechamento:** somam o valor real de cada dia, com as alterações. A soma das semanas continua igual ao total estimado.
- **Tabela e planilha do fechamento:** a coluna Entregas mostra o total do dia; a planilha separa entregas do almoço e do jantar, cada uma com a sua taxa.
- **Seção "Ajustes por data"** da refeição lista também os dias alterados.
- Fora do escopo:
  - alterar a quantidade padrão da refeição a partir do fechamento (continua no cadastro da refeição);
  - preço unitário de marmita diferente por dia;
  - edição em lote de vários dias;
  - mudança no quadro de projeção fixa (Dia, Semana, 15 dias, Mês), que continua usando a quantidade padrão.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `fechamento-refeicoes`: nova situação "Fornecimento alterado", edição do dia útil e do dia extra na semana, entregas separadas por refeição na planilha.
- `refeicoes-obra`: novo tipo de ajuste por data (dia alterado), entregas e refrigerantes informáveis no ajuste, total estimado pela soma diária.
- `cadastro-restaurantes`: taxa de entrega separada para almoço e jantar.

As três capabilities são criadas por changes ainda não arquivadas (`melhorias-design-refeicoes-cadastros`, `restaurante-custos-periodos`, `refrigerante-no-restaurante`, `refeicao-ajustes-por-data`, `fechamento-semanal-refeicoes`). Esta change deve ser arquivada depois delas.

## Impact

- **Backend (`App-adm-obras`):** change OpenSpec própria, a partir do core.
  - `Restaurant`: `lunchDeliveryFee` e `dinnerDeliveryFee` no lugar de `deliveryFee` (**BREAKING** no contrato da API de restaurante).
  - `MealAdjustment`: novo tipo `CHANGED`, campos `lunchDeliveries`, `dinnerDeliveries` e `sodas`.
  - `Meal`: custo por dia com a taxa de cada refeição; `dayClosing` com o novo tipo.
  - `DayClosing`: nova situação `CHANGED`, entregas separadas por refeição.
  - Migração V10: colunas novas em `restaurant` e `meal_adjustment`, cópia da taxa atual.
  - Endpoints de gravação do dia por data (refeição e restaurante).
  - Testes de domínio e de integração.
- **Front:**
  - `src/lib/types.ts`, `src/lib/errors.ts`;
  - cadastro, card e detalhe do restaurante (`restaurantes/form.tsx`, `actions.ts`, `restaurant-card.tsx`, `restaurantes/[id]/page.tsx`);
  - detalhe da refeição (`refeicoes/form.tsx`, seção de ajustes);
  - `src/components/weekly-closing.tsx` e as actions do fechamento;
  - `src/lib/closing-xlsx.ts` e os dois Route Handlers da planilha;
  - `scripts/seed.mjs`.
- **Ordem:** depende de `fechamento-semanal-refeicoes` implementada.
