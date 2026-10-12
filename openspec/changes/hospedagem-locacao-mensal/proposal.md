# Proposal

## Why

A hospedagem é cadastrada com número de diárias e valor total, como se acompanhasse a obra. Na prática, a locação é mensal e renovada conforme a necessidade. Sem data de entrada nem renovações, não há como saber quando a locação vence, e o vencimento passa despercebido.

## What Changes

- **Locação mensal** (backend e front):
  - o cadastro pede **data de entrada** e **valor por mês**;
  - o primeiro período vai da entrada até a véspera do mesmo dia no mês seguinte, por exemplo de 12/10/2026 a 11/11/2026, pelo valor mensal.
- **Renovação:**
  - um novo período começa no dia seguinte ao término atual;
  - a tela sugere a data final (+1 mês) e o valor (valor mensal), e os dois são editáveis, para renovar por 15 dias ou com outro preço;
  - a última renovação pode ser desfeita, mas o primeiro período não;
  - o detalhe lista os períodos com "de", "até", dias e valor.
- **Barra de progresso da locação**, na listagem e no detalhe:
  - mostra os dias decorridos do período atual e quantos dias faltam;
  - cores: neutra, **laranja** quando faltam 14 dias ou menos, **vermelha** quando faltam menos de 7;
  - após o término, mostra "Vencida há N dias" em vermelho; antes da entrada, "Entrada em dd/mm/aaaa".
- **BREAKING (contrato da API):**
  - saem os campos informados `days` e `totalPrice`;
  - `totalPrice` passa a ser calculado como a soma dos períodos, e o total da obra acompanha;
  - entram `startDate`, `monthlyPrice`, `endDate`, `periods` e a situação da locação.
- Continuam como estão: obra opcional, contrato, anfitrião, telefone, endereço, capacidade e colaboradores.
- O detalhe da hospedagem segue o padrão adotado em restaurantes e refeições: dados e locação no detalhe, edição em `/hospedagens/[id]/editar`.

## Capabilities

### New Capabilities
- `locacao-hospedagem`: locação mensal da hospedagem, renovações, total e situação da locação com barra de progresso.

### Modified Capabilities
<!-- Nenhuma em openspec/specs. -->

## Impact

- **Backend (`App-adm-obras`):** change OpenSpec própria, a partir do core.
  - Períodos de locação no domínio da hospedagem; situação calculada pela data de hoje.
  - Migração V8:
    - tabela `accommodation_period`;
    - colunas `start_date` e `monthly_price`;
    - remoção de `days` e `total_price`;
    - conversão dos dados atuais, que são de teste.
  - Endpoints de renovação; DTOs, mappers e testes.
- **Front:**
  - `src/lib/types.ts` e `src/lib/errors.ts`;
  - formulário, listagem, detalhe e nova página de edição de hospedagens;
  - tabela de hospedagens no detalhe da obra;
  - componente de barra da locação;
  - `scripts/seed.mjs`.
- **Dados:** os registros atuais recebem como entrada o início da obra (sem obra, a data de cadastro), e o valor mensal e o primeiro período ficam com o valor total antigo. O usuário confirmou que são dados de teste.
