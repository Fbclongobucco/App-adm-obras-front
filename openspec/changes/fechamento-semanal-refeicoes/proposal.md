# Proposal

## Why

O fechamento das marmitas com o restaurante é semanal, de segunda a domingo. O quadro atual só mostra uma projeção fixa ("Semana = 5 dias úteis"), sem as datas reais e sem feriados e fins de semana trabalhados. Para fechar a semana, é preciso conferir dia a dia fora do sistema.

## What Changes

- **Lista de semanas da obra** (backend e front): semanas de calendário, de segunda a domingo, dentro do período da obra.
  - A primeira e a última semana são cortadas nas datas de início e de término da obra.
  - Obra sem término: as semanas vão até a semana atual.
- **Fechamento da semana** (backend): para cada dia da semana escolhida, a API informa a situação e os números do dia.
  - Situações: fornecimento normal, sem fornecimento, dia extra, sem expediente (sábado ou domingo sem ajuste) e fora do período.
  - Números do dia: almoços, jantares, entregas, refrigerantes e valor.
  - Totais da semana: dias de fornecimento, almoços, jantares, entregas, refrigerantes e valor.
  - O cálculo usa as mesmas regras do total estimado, com os ajustes por data de `refeicao-ajustes-por-data`.
- **Detalhe do restaurante e da refeição** (front): nova seção "Fechamento semanal".
  - Dropdown com as semanas no formato "12/10 a 18/10/2026", com a marca "parcial" quando a semana foi cortada e "atual" na semana de hoje.
  - A semana selecionada fica na URL.
  - Semana padrão: a atual, se estiver no período da obra. Antes do início, a primeira; depois do término, a última.
  - Tabela dia a dia e linha de totais da semana.
  - No restaurante, os valores somam todas as refeições dele.
- **Edição na própria semana** (só administrador):
  - em dia útil, marcar ou desmarcar "Sem fornecimento" (feriado);
  - em sábado ou domingo, incluir ou remover "Dia extra" com as quantidades.
  - No detalhe do restaurante, a ação vale para todas as refeições dele de uma vez. O dia extra pede as quantidades de cada refeição.
  - Usa os ajustes por data já existentes. Um ajuste feito na semana aparece também na seção "Ajustes por data" da refeição, e vice-versa.
- O quadro de projeção fixa (Dia, Semana, 15 dias, Mês) continua como está.
- **Pedido do usuário após o primeiro teste:**
  - o detalhe do restaurante e o da refeição deixam de mostrar o formulário de edição no fim da página; a edição vai para `/restaurantes/[id]/editar` e `/refeicoes/[id]/editar`, com botão "Editar" no cabeçalho;
  - o fechamento semanal ocupa a largura da página, sem rolagem interna; no celular, os dias viram uma lista;
  - **exportação da semana em planilha (.xlsx)** para o financeiro: dias, situação, almoços, jantares, entregas e refrigerantes, com preços unitários, taxa de entrega, valores e total.

## Capabilities

### New Capabilities
- `fechamento-refeicoes`: semanas de fechamento da obra, fechamento real da semana por restaurante e por refeição, e edição de feriados e dias extras a partir da semana.

### Modified Capabilities
<!-- Nenhuma em openspec/specs. Depende das capabilities refeicoes-obra e cadastro-restaurantes criadas pelas changes ainda não arquivadas. -->

## Impact

- **Backend (`App-adm-obras`):** change OpenSpec própria, a partir do core. Não precisa de migração, porque usa a tabela de ajustes da V7.
  - Cálculo de semanas e do fechamento diário no domínio.
  - Endpoints de leitura do fechamento por restaurante e por refeição.
  - Inclusão e remoção de ajuste em todas as refeições do restaurante numa única transação.
  - Testes.
- **Front:**
  - `src/lib/types.ts`;
  - novo componente de fechamento semanal (dropdown e tabela) e actions;
  - detalhe do restaurante e da refeição;
  - `src/lib/errors.ts`;
  - páginas de edição e Route Handler da planilha (`exceljs` passa a dependência de execução).
- **Ordem:** depende de `refrigerante-no-restaurante` e `refeicao-ajustes-por-data`. Deve ser implementada e arquivada depois delas.
