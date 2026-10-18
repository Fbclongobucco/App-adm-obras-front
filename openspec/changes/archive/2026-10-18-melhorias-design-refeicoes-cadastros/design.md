# Design

## Context

- O front (Next 16.4, Tailwind 4, sem bibliotecas de UI) consome a API Spring `App-adm-obras`. Os tipos do contrato ficam em `src/lib/types.ts`. As Server Actions montam o JSON com os helpers de `src/lib/form.ts`, e `text()` já converte campo vazio em `null`.
- A paleta SOLER já está declarada em `src/app/globals.css` (`highlight`, `accent`, `title`, `body`, `line`, `surface`). O problema visual é de aplicação: menu, cabeçalho, cartões e tabelas são todos brancos, com bordas `line/30`, sobre `surface`.
- Refeição hoje: `Meal { restaurant, mealType: LUNCH|DINNER, quantity, price, date, totalPrice }`, com unicidade `(project_id, meal_type)` no banco. A obra expõe `lunch` e `dinner`, e `obras/actions.ts` reenvia `lunchId`/`dinnerId` no PUT. O `scripts/seed.mjs` lança refeições com `date`.
- O e-mail é obrigatório no domínio (`Client.validateEmail`, `Employee.validateEmail`). No front, só o atributo `required` dos formulários impede o vazio.
- Seleção múltipla: `MultiCheck`, usado em obras (colaboradores), hospedagens (hóspedes) e usuários (perfis).
- Requisitos: ver `specs/*/spec.md`. Motivação: ver `proposal.md`.

## Goals / Non-Goals

**Goals:**
- Um único ponto de cálculo do custo de refeição, consistente com o `totalPrice` da obra.
- Contrato de refeição e de obra definido aqui, para a change do backend implementar sem reinterpretação.
- Componente de seleção múltipla único e acessível, sem nova dependência.

**Non-Goals:**
- Calendário de feriados no cálculo de dias úteis.
- Gráficos ou novos indicadores no dashboard além do redesenho dos atuais.
- Tema escuro.
- E-mail opcional em usuários (é o login).

## Decisions

### D1. O backend calcula custo por dia, dias úteis e total
A API devolve `dailyPrice`, `workingDays` e `totalPrice`. O front só exibe.
- **Por quê:** o `totalPrice` da obra soma as refeições. Se o front calculasse, a obra e a página de refeições poderiam divergir.
- **Alternativa:** calcular no front a partir de `startDate`/`endDate` da obra. Descartada porque duplica a regra.
- Os dias úteis são contados de segunda a sexta, de `startDate` a `endDate` inclusive. Sem `endDate`, `workingDays` e `totalPrice` vêm `null`.

### D2. Contrato proposto para a change do backend
```
MealType = LUNCH | DINNER | LUNCH_AND_DINNER

POST/PUT /api/meals
{ restaurantId, mealType, isBilled,
  lunchQuantity, lunchPrice,      // obrigatórios se mealType inclui almoço; senão null
  dinnerQuantity, dinnerPrice }   // obrigatórios se mealType inclui jantar; senão null

MealSummary
{ id, restaurant, mealType, isBilled,
  lunchQuantity, lunchPrice, dinnerQuantity, dinnerPrice,   // null quando não servido
  dailyPrice, workingDays, totalPrice,                     // os dois últimos null sem término
  createdAt, updatedAt }
Meal = MealSummary + { project }

Project: remove lunch/dinner; adiciona meals: MealSummary[]
ProjectRequest: remove lunchId/dinnerId (refeição se vincula pelo restaurante)
```
- Novos `errorCode`: `meal.invalid.lunch_quantity`, `meal.invalid.lunch_price`, `meal.invalid.dinner_quantity`, `meal.invalid.dinner_price`. `meal.duplicate.type` passa a significar sobreposição de cobertura (almoço ou jantar). `meal.invalid.date.future` deixa de existir.
- **Alternativa:** dois registros (almoço e jantar) criados por uma única tela. Descartada porque "Almoço e jantar" vira um par a sincronizar em edição e exclusão.
- **Alternativa:** lista genérica de itens `{tipo, quantidade, preço}`. Descartada por ser mais flexível que o necessário e complicar a regra de unicidade.

### D3. Formulário de refeição com campos condicionais
`MealForm` passa a ser estado local de `mealType`. Os blocos Almoço e Jantar aparecem conforme o tipo, e o bloco oculto não é renderizado, para não enviar nem exigir campos. A action envia `null` para os campos ausentes. Em modo leitura, a tela exibe custo por dia, dias úteis e total em bloco de resumo (Roboto Mono).

### D4. Shell com menu grafite e superfícies em três níveis
| Elemento | Antes | Depois |
|---|---|---|
| Fundo da página | `surface` #F1F1F1 | `surface` #F1F1F1 (mantido) |
| Menu lateral | branco | grafite `title` #252525, texto #F1F1F1, seções em `line` #9A9A9A |
| Topo do menu | texto | faixa branca com a logo (logo sobre fundo claro e liso) |
| Item ativo | `bg-surface` + borda `accent` | fundo branco 10%, texto branco, barra `accent` #A20606 de 3 px |
| Barra superior | branca, borda `line/30` | branca, borda `line/60` |
| Cartões e tabelas | branco, borda `line/30` | branco, borda `line/50`, `shadow-sm` |
| Cabeçalho de tabela | texto `body` sobre branco | fundo `surface`, texto `title` semibold, borda `line/60` |
| KPIs | número `2xl` | número `3xl` Roboto Mono, filete superior `highlight` de 2 px, rótulo `body` |

- **Por quê:** é o padrão de dashboard administrativo (menu fixo, barra superior, KPIs no topo, conteúdo em cartões). O menu grafite traz contraste usando a fatia de grafites da paleta, e o vermelho fica só em acentos.
- **Alternativa:** menu claro com mais borda. Descartada porque muda pouco a percepção de contraste pedida.
- `line` #9A9A9A fica só em bordas e rótulos de seção do menu escuro, nunca como texto de corpo sobre branco (contraste insuficiente).

### D5. Logo
Fonte: imagem da página da SOLER no LinkedIn, indicada pelo usuário (JPEG 200×200, fundo branco). Gravada em `public/soler-logo.png` (168×65 px) apenas com a margem branca uniforme removida, mantendo cores, proporção e o reflexo original. Exibida com `next/image`, altura fixa e largura proporcional, sem filtro nem recolorização. Como o arquivo tem fundo branco, o menu escuro recebe a logo numa faixa branca. Se surgir versão vetorial oficial, substitui o PNG sem mudança de layout.

### D6. `MultiSelect` substitui `MultiCheck`
O novo componente cliente segue o padrão combobox + listbox multisseleção da WAI-ARIA:
- botão-gatilho com resumo ("3 selecionados") e chips removíveis abaixo;
- painel suspenso com busca no topo (`searchable`), lista com caixas de seleção e altura máxima com rolagem;
- fecha em clique fora ou Esc; navegação por setas, espaço marca;
- filtro só pelo nome (parte antes de " · "), normalizado com `NFD` sem diacríticos e em minúsculas;
- envia os valores como `<input type="hidden" name=...>` repetidos, como hoje. `list(data, "employeeIds")` e as actions não mudam.

Perfis de usuário passam a usar o mesmo componente com `searchable={false}`, e `MultiCheck` é removido.
- **Alternativa:** `<select multiple>` nativo. Descartada por usabilidade ruim (Ctrl+clique) e por não ter busca.
- **Alternativa:** biblioteca (Headless UI, Radix). Descartada para não adicionar dependência a um caso único.

### D7. E-mail opcional
No front: remove `required` dos campos de e-mail de cliente e colaborador. Listagens e detalhes exibem "—" quando o valor é `null`. `ClientSummary.email` e `EmployeeSummary.email` passam a `string | null`. No backend (change própria): `validateEmail` aceita `null`/vazio, a coluna fica anulável e o índice único segue valendo para valores não nulos (PostgreSQL permite vários `NULL` em `UNIQUE`).

## Risks / Trade-offs

- [Contrato quebra entre front e backend] → front e backend publicados juntos. A parte de refeições do front só é integrada depois que a change do backend estiver mergeada. Os tipos de `types.ts` seguem D2 literalmente.
- [Refeições existentes têm data e quantidade única] → a migração V4 do backend converte `LUNCH` em `lunchQuantity`/`lunchPrice` e `DINNER` em `dinnerQuantity`/`dinnerPrice` e descarta `date`. O resultado deve ser revisado na base antes do deploy em produção.
- [Total estimado sem feriados superestima o custo] → o rótulo da tela diz "dias úteis (seg–sex, sem feriados)".
- [Logo em bitmap de 200 px] → exibida em tamanho igual ou menor que o original (até 168 px de largura) para não perder nitidez.
- [Componente próprio de combobox tem custo de acessibilidade] → os cenários de teclado da spec `selecao-colaboradores` são verificados manualmente.

## Migration Plan

1. Backend: change OpenSpec própria em `App-adm-obras` com D2 e D7, migração Flyway V4 e atualização dos testes.
2. Front: identidade visual, `MultiSelect` e e-mail opcional no formulário podem ir antes. Não dependem do contrato novo de refeição. Um e-mail vazio só é aceito depois do backend.
3. Front: refeições, detalhe da obra, `obras/actions.ts`, `types.ts`, `errors.ts` e `scripts/seed.mjs` no contrato novo, publicados junto com o backend.
4. Rollback: reverter front e backend juntos. A V4 não tem reversão automática; restaurar a base pelo backup anterior ao deploy.
