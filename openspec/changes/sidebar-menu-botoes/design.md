# Design

## Context

- `src/components/sidebar.tsx` renderiza o menu a partir de `NAV`. Hoje os itens são linhas `text-sm` (14 px) com `border-l-[3px]` e sem fundo em repouso. O ativo usa `bg-white/15` e barra `accent`, e o espaçamento entre itens é `space-y-0.5`.
- Fundo do menu: `bg-title` (#252525). Largura: `w-56` (224 px), e `w-60` (240 px) a partir de `lg`.
- Motivação: ver proposal.md.

## Goals / Non-Goals

**Goals:**
- Itens com cara de botão e texto um pouco maior, mantendo o contraste da spec.

**Non-Goals:**
- Mudar largura do menu, ordem dos itens, ícones ou o comportamento em telas pequenas.

## Decisions

### D1. Tamanhos
| Elemento | Antes | Depois |
|---|---|---|
| Texto dos itens | `text-sm` (14 px) | `text-[15px]` |
| Ícones | `size-4` (16 px) | `size-[18px]` |
| Títulos de seção | `text-[11px]` | `text-xs` (12 px) |
| Altura do item | `py-2` | `py-2.5` |
| Espaço entre itens | `space-y-0.5` | `space-y-1.5` |

"Um pouco maior" foi interpretado como +1 px no texto. O rótulo mais longo ("Centros de custo") cabe em 224 px de largura: padding de 12 px + ícone de 18 px + gap de 12 px + texto de cerca de 125 px.

### D2. Estados do botão
| Estado | Classes | Contraste do texto |
|---|---|---|
| Repouso | `rounded-md border border-white/10 bg-white/[0.06] text-white font-medium` | 12,8:1 |
| Hover | `hover:border-white/25 hover:bg-white/[0.12]` | 10,5:1 |
| Ativo | `border-white bg-white text-title font-semibold` + barra `accent` de 3 px à esquerda | 15,3:1 |
| Foco por teclado | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white` | - |

- A barra do ativo é um `box-shadow: inset 3px 0 0 var(--color-accent)` (`shadow-[inset_3px_0_0_var(--color-accent)]`). Assim não muda a largura do botão nem o alinhamento do texto, ao contrário da `border-l` atual, que exigia borda transparente em todos os itens.
- **Alternativa:** ativo com fundo vermelho. Descartada porque vermelho em bloco cheio contraria o uso pontual do vermelho e compete com o botão "Nova obra".
- **Alternativa:** ativo só com fundo mais claro (`white/20`). Descartada porque fica pouco distinto dos botões em repouso, que agora também têm fundo.

## Risks / Trade-offs

- [Menu mais alto com `py-2.5` e `space-y-1.5`] → 9 itens e 3 seções somam cerca de 560 px. Cabe numa tela de 768 px com a logo. Abaixo disso, o menu já rola (`overflow-y-auto`).
- [Arquivamento depende de duas changes anteriores] → arquivar na ordem: `melhorias-design-refeicoes-cadastros`, `ajuste-sidebar-logo-dashboard` e depois esta.
