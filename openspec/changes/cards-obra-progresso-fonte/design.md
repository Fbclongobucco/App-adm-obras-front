# Design

## Context

- `ProjectSummary` tem `startDate`, `endDate | null`, `isCompleted`, `totalPrice`, `client`, `description` e `os`. Não há campo de avanço físico, e a barra mede prazo (ver proposal.md).
- O dashboard (`src/app/(app)/page.tsx`) busca as 10 últimas obras (`getPage(..., 0, 10, "updatedAt,desc")`) e mostra em `DataTable`. A listagem `/obras` busca 20 por página em `DataTable`.
- `cacheComponents` está ligado. Segundo `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`, `new Date()` durante o prerender gera erro de build. A chamada precisa ocorrer depois de `connection()` ou num Client Component.
- Fonte: Tailwind 4 usa rem para `text-xs` (0,75), `text-sm` (0,875) e `text-base` (1). Há 7 usos de `text-[NNpx]` em px fixo (`fields.tsx`, `data-table.tsx`, `page-header.tsx`, `notice.tsx`, `sidebar.tsx` e outros), que não acompanham uma mudança de escala.

## Goals / Non-Goals

**Goals:**
- Cálculo de prazo puro e testável, com a data de hoje injetada.
- Um único componente de card e um de barra, reutilizados no dashboard, na listagem e no detalhe.
- Fonte maior em todo o sistema com uma única alavanca.

**Non-Goals:**
- Avanço físico, cronograma por etapa ou gráfico de Gantt.
- Filtros ou busca na listagem de obras.
- Trocar as tabelas de obras dentro de cliente e colaborador.

## Decisions

### D1. Cálculo em `src/lib/progress.ts`
`projectProgress(project, today)` recebe as datas "aaaa-mm-dd" e devolve `{ state, percent, elapsedDays, totalDays, lateDays }`:

| Condição (em ordem) | state | percent | Texto |
|---|---|---|---|
| `isCompleted` | `done` | 100 | Concluída |
| sem `endDate` | `open` | null | Sem término definido · N dias decorridos |
| hoje < início | `upcoming` | 0 | Inicia em dd/mm/aaaa |
| hoje > término | `late` | 100 | Atrasada há N dias |
| demais | `running` | floor(decorrido ÷ total × 100) | Prazo: X de Y dias |

- As datas são comparadas como dias UTC (`Date.UTC(a, m-1, d)`), sem fuso, para evitar erro de um dia no horário de verão.
- Se término = início, total é 0 e a obra é tratada como 1 dia, para evitar divisão por zero.
- **Dias corridos e não úteis:** prazo de obra é contado em dias corridos. Os dias úteis continuam só no custo de refeições, onde a spec os exige.

### D2. Data de hoje em `src/lib/today.ts`
`today()` é uma função `async` server-only: `await connection()` e depois a data atual formatada em America/Sao_Paulo (`Intl.DateTimeFormat("en-CA", { timeZone })`, que gera "aaaa-mm-dd"). As páginas chamam `today()` junto com os dados e passam a string para os componentes. Assim, componentes e cálculo ficam puros.
- **Alternativa:** calcular no Client Component com o relógio do navegador. Descartada porque o servidor renderizaria uma coisa e o navegador outra, gerando divergência de hidratação perto da meia-noite.

### D3. Componentes
- `ProjectProgress` (servidor): trilho `h-2 rounded-full bg-surface` com preenchimento.
  - Cores: `bg-title` em andamento, `bg-line` concluída, `bg-accent` atrasada. Sem término, não há barra.
  - Atributos `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` e `aria-valuetext`.
  - Texto em `text-sm`, com o percentual em Roboto Mono.
- `ProjectCard`: `panel` com hover de borda e sombra, todo dentro de um `<Link>`. Ordem do conteúdo:
  1. OS (mono, negrito) e `StatusBadge` na mesma linha;
  2. descrição (até 2 linhas, `line-clamp-2`);
  3. cliente;
  4. `ProjectProgress`;
  5. rodapé com início → término e total (mono).
- Grade: `grid gap-4 sm:grid-cols-2 xl:grid-cols-3`.

### D4. Onde muda
- **Dashboard:** `getPage(..., 0, 6, ...)` e grade de 6 cards. O "Ver todas" continua.
- **`/obras`:** grade com a mesma busca (20 por página, `updatedAt,desc`) e `Pagination` mantida. O "Atualizada em" vai para o rodapé do card na listagem, em `text-xs`.
- **Detalhe da obra:** `ProjectProgress` abaixo do cabeçalho, com largura máxima de `max-w-3xl`.

### D5. Escala tipográfica
- `html { font-size: 112.5%; }` em `globals.css`. A escala base passa a 18 px e respeita o tamanho de fonte configurado no navegador.
- Os px fixos passam a rem, para acompanhar a escala:

| Antes | Depois | Valor em 18 px |
|---|---|---|
| `text-[15px]` | `text-[0.9375rem]` | 16,9 px |
| `text-[11px]` | `text-xs` | 13,5 px |

- Os demais tamanhos (`text-xs`, `text-sm` e títulos) já são rem: 13,5 px, 15,75 px etc.
- Espaçamentos em rem também crescem 12,5%. Menu e cartões ficam proporcionalmente maiores, e isso é intencional para manter a proporção.
- **Alternativa:** trocar classe por classe (`text-sm` → `text-base` etc.). Descartada porque são mais de 60 ocorrências e o risco de deixar alguma desigual é alto.

## Risks / Trade-offs

- [Tabelas largas ficam mais largas com a fonte maior] → `DataTable` já rola horizontalmente dentro do próprio contêiner, e a página não rola.
- [Prazo decorrido confundido com avanço físico] → o rótulo diz sempre "Prazo", e a spec proíbe chamar de avanço.
- [Arredondamento: 99,6% vira 100% antes do término] → `running` usa `Math.floor`, então 100% aparece só no último dia ou depois.
- [Ordem com `sidebar-menu-botoes`] → se ela for implementada antes, o `text-[15px]` dela também passa a rem (tarefa 3.2).
