# Design

## Context

- **Backend:**
  - Os controllers de listagem recebem só `page` e `size`.
  - As portas de repositório do core (`core/repository`) expõem `findAll(PageRequest)`.
  - Os adaptadores usam Spring Data JPA.
  - Os bancos são H2 (perfis local e test, `MODE=PostgreSQL`) e PostgreSQL (prod). Uma solução de acentos precisa funcionar nos dois.
- **Front:**
  - As listagens chamam `getPage(path, page, size, sort)` (`src/lib/api.ts`) com `?page=`.
  - `Pagination` monta `${href}?page=N`.
  - As páginas são Server Components com `searchParams`, e `cacheComponents` está ligado.
- Decisão do usuário: busca no backend.

## Goals / Non-Goals

**Goals:**
- Uma regra única de normalização de termo no core, reaproveitada por todos os recursos.
- Busca sem acento portável entre H2 e PostgreSQL, sem extensão de banco.
- Um componente de busca reaproveitado nas 8 listagens.

**Non-Goals:**
- Busca por relevância ou texto completo (full text).
- Filtros estruturados (situação, período, centro de custo).
- Índices de busca. O volume é de centenas de registros e `LIKE '%termo%'` atende. Se o volume crescer, entra um índice trigram numa change própria.

## Decisions

### D1. Value object `SearchTerm` no core
- `core/domain/SearchTerm.of(String raw)` aplica as regras:
  - remove espaços nas pontas;
  - texto vazio vira `SearchTerm.NONE`;
  - acima de 100 caracteres lança `InvalidSearchException` (`page.invalid.query`).
- Expõe:
  - `text()`: minúsculas, sem acentos (`Normalizer` NFD sem diacríticos), com `%` e `_` escapados;
  - `digits()`: só dígitos, ou vazio, para CPF e CNPJ.
- As portas ganham `findAll(PageRequest, SearchTerm)`. A versão sem termo delega com `NONE`, para não quebrar quem já chama.
- **Alternativa:** normalizar no controller. Descartada porque a regra de busca é de domínio e o usuário pediu as regras no core.

### D2. Comparação sem acento no banco com `TRANSLATE`
- Nos adaptadores JPA, cada campo pesquisável é comparado como `function('translate', lower(campo), 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn') like :text escape '\'`.
- `TRANSLATE` existe no H2 e no PostgreSQL com a mesma assinatura, então não precisa de `unaccent` (extensão do PostgreSQL ausente no H2).
- CPF e CNPJ já são gravados só com dígitos e são comparados com `like :digits` quando `digits()` não é vazio.
- Campos de relação (cliente da obra, OS da obra, cidade do endereço) usam `left join` na consulta. Assim, registros sem endereço não somem da busca por outros campos.
- **Alternativa:** coluna normalizada gravada, como `search_text`. Descartada porque exigiria migração e manutenção em toda escrita, sem ganho no volume atual.

### D3. Contrato
`GET /api/<recurso>?page=&size=&sort=&q=`. O `q` é opcional e o formato da `Page` não muda. Erro 400 `page.invalid.query` quando o termo passa de 100 caracteres.

### D4. Front
- `getPage(path, page, size, sort, q?)` envia `q` quando não vazio.
- `SearchField`, Client Component em `src/components/search-field.tsx`:
  - recebe `href` (rota da lista), `initial` (termo vindo de `searchParams`) e `placeholder`;
  - estado local do texto;
  - após 300 ms sem digitar, chama `router.replace(href + (q ? "?q=" + encodeURIComponent(q) : ""))`, sem `page`, então volta para a página 1;
  - botão de limpar quando há texto, `type="search"`, ícone de lupa e `aria-label`;
  - enquanto a navegação carrega, usa `useTransition` para indicar o estado sem bloquear a digitação;
  - recebe o termo por prop em vez de `useSearchParams`, para não exigir `Suspense` extra com Cache Components.
- `Pagination` recebe `query` e monta `?q=…&page=N`.
- Cada página:
  - lê `q` de `searchParams`;
  - repassa para `getPage`, `Pagination` e `SearchField`;
  - usa o placeholder com os campos da spec, por exemplo "Buscar por OS, descrição ou cliente";
  - sem resultado com `q`, mostra "Nenhum resultado para “q”" e um link "Limpar busca" para a rota sem `q`.
- Posição: abaixo do `PageHeader`, com largura máxima de `max-w-md`.

## Risks / Trade-offs

- [`LIKE '%termo%'` não usa índice] → aceitável no volume atual (Non-Goals).
- [`TRANSLATE` não cobre todo caractere acentuado] → a lista cobre o português, inclusive "ç". Outros caracteres continuam comparados literalmente.
- [Digitar rápido gera várias navegações] → atraso de 300 ms e `router.replace`, que não empilha histórico.
- [Termo com `%` ou `_`] → escapados em `SearchTerm.text()`, para não virarem curinga.
