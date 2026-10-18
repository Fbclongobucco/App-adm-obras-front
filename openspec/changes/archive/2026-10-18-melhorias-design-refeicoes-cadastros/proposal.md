# Proposal

## Why

O dashboard de obras tem pouca hierarquia visual: cards, tabelas e menu usam o mesmo fundo branco com bordas a 30% de opacidade, então nada se destaca. A SOLER também não aparece na aplicação. Além disso, a página de refeições modela um lançamento datado. A operação precisa de outra coisa: o custo diário de alimentação de cada obra e o total até o término. Dois cadastros também travam por dado que nem sempre existe: o e-mail obrigatório de clientes e colaboradores.

## What Changes

- **Identidade e contraste**: aplicar o padrão de dashboard administrativo (menu lateral fixo, barra superior, KPIs no topo, cards e tabelas em superfícies distintas) com mais contraste dentro da paleta SOLER, sem vermelho em fundo extenso. Incluir a logo oficial da SOLER no menu lateral e na tela de login.
- **Refeições por obra** (**BREAKING** no contrato da API):
  - A refeição deixa de ter data. Passa a ser a configuração de alimentação da obra: restaurante, tipo, quantidade por dia e preço unitário.
  - Tipo com três opções: Almoço, Jantar e Almoço e jantar. Em "Almoço e jantar", quantidade e preço são informados separadamente para cada refeição.
  - Exibir o custo por dia, os dias úteis (segunda a sexta) entre início e término da obra e o total estimado do período.
  - Sem data de término, a obra exibe só o custo por dia e indica que o total depende do término.
  - Cada obra continua com no máximo uma cobertura de almoço e uma de jantar. "Almoço e jantar" ocupa as duas.
- **E-mail opcional**: o e-mail passa a ser opcional nos cadastros de clientes e colaboradores. Quando informado, continua validado e único. O de usuários continua obrigatório, porque é o login.
- **Seleção de colaboradores**: trocar o componente "Editar + caixas de seleção" por um dropdown de seleção múltipla com campo de busca por nome. Vale para a equipe da obra e para os hóspedes da hospedagem.

## Capabilities

### New Capabilities
- `identidade-visual`: aplicação da marca SOLER (logo, paleta, tipografia) e regras de contraste e hierarquia do shell e do dashboard.
- `refeicoes-obra`: configuração de alimentação por obra, tipos de refeição, custo diário e total estimado em dias úteis.
- `cadastro-clientes`: regras de preenchimento do cadastro de clientes (e-mail opcional).
- `cadastro-colaboradores`: regras de preenchimento do cadastro de colaboradores (e-mail opcional).
- `selecao-colaboradores`: seleção múltipla de colaboradores com busca por nome em formulários de obra e hospedagem.

### Modified Capabilities
<!-- Nenhuma: o projeto ainda não tem specs registradas. -->

## Impact

- **Front (este repositório)**: `src/app/globals.css`, `src/app/(app)/layout.tsx`, `src/app/login/page.tsx`, `src/components/sidebar.tsx`, `data-table.tsx`, `page-header.tsx`, `src/app/(app)/page.tsx`; `src/app/(app)/refeicoes/*`, `src/app/(app)/obras/*` (detalhe e `actions.ts`, que hoje reenvia `lunchId`/`dinnerId`); `clientes/form.tsx`, `colaboradores/form.tsx`; `src/components/form/multi-check.tsx` (substituído ou reescrito); `src/lib/types.ts`, `src/lib/errors.ts`; `public/` (arquivo da logo).
- **Backend (`App-adm-obras`, Spring) — dependência**: remodelagem de `Meal` (remove `date`; adiciona tipo `LUNCH_AND_DINNER`, quantidade e preço por refeição, custo diário e total em dias úteis), migração Flyway V4, troca de `lunch`/`dinner` por `meals` no contrato da obra e e-mail anulável em `Client` e `Employee`. Esse trabalho segue o fluxo OpenSpec do backend, numa change própria, e precisa ser entregue antes ou junto das partes de refeições e e-mail deste front.
- **Dados existentes**: refeições já lançadas perdem a data. A migração do backend precisa definir o destino desses registros.
- **Logo**: o domínio oficial da SOLER não foi localizado em busca. O download depende da confirmação do endereço pelo usuário.
