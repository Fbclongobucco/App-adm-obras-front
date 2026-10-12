# Proposal

## Why

Para achar um registro numa listagem, hoje é preciso folhear páginas de 20 itens. O usuário pediu um campo de busca em todas as listas. Como a paginação acontece no backend, filtrar só a página carregada no front deixaria registros de fora. A busca precisa ser feita pela API.

## What Changes

- **Backend:** parâmetro opcional `q` nas listagens paginadas, com a regra de busca no core.
  - Recursos: `GET /api/projects`, `/api/clients`, `/api/employees`, `/api/cost-centers`, `/api/restaurants`, `/api/meals`, `/api/accommodations` e `/api/users`.
  - A busca ignora maiúsculas e acentos e procura o texto em qualquer parte dos campos de cada recurso (ver spec).
  - Para CPF e CNPJ, a busca considera só os dígitos.
  - A paginação, a ordenação e o total (`totalElements`) passam a refletir o resultado filtrado.
- **Front:** campo de busca no topo das 8 listagens.
  - A busca é aplicada ao digitar, com atraso curto, e vai para a URL (`?q=`), para poder ser compartilhada e para o botão voltar funcionar.
  - Nova busca volta para a página 1, e a paginação mantém o termo.
  - Mostra "Nenhum resultado para …" quando não há resultado, com opção de limpar a busca.
- Fora do escopo:
  - os indicadores e as últimas obras do dashboard;
  - as tabelas dentro de detalhe (obras do cliente, do colaborador etc.);
  - filtros por campo, como situação e período;
  - os seletores de formulário (o de colaboradores já tem busca).

## Capabilities

### New Capabilities
- `busca-listagens`: busca textual nas listagens paginadas. Cobre a API (`q`) e a interface (campo, URL, paginação e resultado vazio).

### Modified Capabilities
<!-- Nenhuma. -->

## Impact

- **Backend (`App-adm-obras`):** change OpenSpec própria, implementada a partir do core.
  - Value object de termo de busca no core.
  - Portas de repositório com busca paginada.
  - Use cases e controllers com `q`.
  - Consultas JPA nos adaptadores.
  - Testes.
  - Sem migração, a menos que índices sejam necessários (ver design).
- **Front:**
  - `src/lib/api.ts`: `getPage` aceita o termo;
  - novo componente `src/components/search-field.tsx`;
  - `src/components/pagination.tsx`: preserva o `q`;
  - as 8 páginas de listagem.
