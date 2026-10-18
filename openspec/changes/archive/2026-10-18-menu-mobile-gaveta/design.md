# Design

## Context

- `src/app/(app)/layout.tsx` monta o shell: `<aside>` grafite com a logo e `Sidebar` (fixo a partir de `sm`, empilhado abaixo disso), e coluna com `<header>` (`UserMenu`: nome, perfil e "Sair" via server action `logout`) e `<main>`.
- `src/components/sidebar.tsx` (Client Component) renderiza `NAV` (`src/lib/nav.ts`) com o item ativo por `usePathname()`, dentro de `<Suspense>` com `SidebarNav pathname={null}` de fallback.
- Abaixo de `sm` (640 px) o `<aside>` não é fixo, por isso o menu inteiro aparece antes do conteúdo e o `<header>` com "Sair" vem depois dele.
- Next.js da versão do projeto: ler o guia em `node_modules/next/dist/docs/` sobre layouts, Client Components e Server Actions antes de codar (AGENTS.md).

## Goals / Non-Goals

**Goals:**
- Menu definido uma vez (`NavMenu`) e reaproveitado no desktop e no painel.
- Desktop idêntico ao atual.
- Painel acessível sem biblioteca nova.

**Non-Goals:**
- Animações elaboradas; basta a transição de entrada do painel.
- Persistir estado do menu.

## Decisions

### D1. Estrutura do shell
- `layout.tsx` (Server Component) fica só com a composição:
  - `<aside>` desktop: `hidden sm:block` + as classes fixas atuais, com `Brand` e `NavMenu`;
  - `MobileBar` (Client Component, `sm:hidden`): barra `sticky top-0` com botão de menu, `Brand` compacto e "Sair";
  - `<header>` desktop: `hidden sm:flex` com `UserMenu`;
  - `<main>`.
- Com `cacheComponents: true` (next.config), ler a sessão no topo do layout o tornaria todo dinâmico, e `usePathname` exige `<Suspense>` (guia `use-pathname.md` da versão 16.4). Por isso `UserMenu` continua um Server Component assíncrono dentro de `<Suspense>`, e o `MobileBar` recebe o usuário e o "Sair" já renderizados no servidor como props (`ReactNode`), sem serializar a sessão. O menu com item ativo dentro do painel fica em `<Suspense>` com o menu sem item ativo de fallback, como no desktop.
- **Alternativa:** um único `<aside>` que vira painel por CSS. Descartada: exige estado no cliente e misturaria posições fixas do desktop com o painel.

### D2. Menu único
- `src/components/sidebar.tsx` passa a exportar `NavMenu({ pathname, onNavigate? })`, com o markup atual de `SidebarNav`. `Sidebar` (desktop) continua usando `usePathname()`.
- No painel, `onNavigate` fecha o painel ao clicar num item. Além disso, um efeito fecha o painel quando o `pathname` muda (cobre voltar/avançar).

### D3. Painel com `<dialog>`
- Painel é um `<dialog>` aberto com `showModal()`: o navegador já entrega foco preso, Esc, `::backdrop` e `inert` no resto da página.
- Clique no backdrop fecha (clique cujo `target` é o próprio `<dialog>`). Botão "Fechar" no topo do painel. `aria-label="Menu"`; o botão da barra tem `aria-label="Abrir menu"`, `aria-expanded` e `aria-controls`.
- Estilo: grafite (`bg-title`), alinhado à esquerda, largura `min(18rem, 85vw)`, altura total, rolagem interna; backdrop preto translúcido. Rodapé com nome, perfil e "Sair".
- **Alternativa:** `div` fixo com foco gerenciado à mão. Descartada: mais código para o mesmo resultado.

### D4. Logo
- `Brand` extrai o bloco atual (logo em bloco branco compacto + "Administração de obras"). Na barra do celular a barra é branca, então a logo vai direto sobre o fundo claro, sem o texto; no painel, o mesmo bloco do desktop. Regra da logo atendida: sem recolorir, sem distorção, sobre fundo claro e liso.

### D5. Sair
- `logout` (server action existente) usado em formulários na barra do celular, no rodapé do painel e no `UserMenu` desktop. Sem mudança no fluxo.

## Risks / Trade-offs

- [`<dialog>` com `showModal()` em navegadores antigos] → suportado nos navegadores atuais de celular; o público é interno.
- [Rolagem do fundo com painel aberto no iOS] → `overflow: hidden` no `<html>` enquanto o painel está aberto, removido ao fechar.
- [Barra `sticky` sobre cabeçalhos de página] → altura fixa (h-14) e nenhum outro elemento sticky no topo das páginas hoje.

## Migration Plan

Só front. Deploy normal; rollback revertendo o commit.
