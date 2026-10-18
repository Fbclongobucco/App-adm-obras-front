# Proposal

## Why

No celular (abaixo de 640 px), o menu lateral inteiro aparece empilhado acima do conteúdo. Para chegar à página é preciso rolar por todos os itens, e o "Sair" fica no fim do menu. Em uso de campo, a tela útil começa só depois de uma tela inteira de navegação.

## What Changes

- **Celular (abaixo de 640 px):**
  - barra fixa no topo com o botão de menu, a logo SOLER e o botão "Sair";
  - o conteúdo da página começa logo abaixo da barra;
  - o botão de menu abre um painel lateral sobre o conteúdo, com os mesmos itens e seções do menu do desktop, o item ativo destacado, e o usuário com o perfil e "Sair" no rodapé;
  - o painel fecha ao escolher um item, ao tocar fora dele, pelo botão "Fechar" ou pela tecla Esc.
- **Desktop (640 px ou mais):** sem mudança visível. Menu lateral fixo e cabeçalho com usuário e "Sair" continuam como estão.
- **Refatoração do layout e da navegação:**
  - um único componente de menu, usado no menu lateral e no painel do celular, a partir de `NAV`, sem duplicar itens;
  - bloco da logo e menu do usuário extraídos do `layout.tsx` para componentes próprios.
- Fora do escopo: revisão das demais telas em 375 px, mudança de itens, ordem ou visual do menu no desktop, menu recolhível no desktop.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `identidade-visual`: "Layout em telas pequenas" passa a exigir a barra do topo e o menu em painel no celular (MODIFIED), e entra "Navegação no celular" (ADDED). A capability é criada por `melhorias-design-refeicoes-cadastros`, ainda não arquivada; esta change deve ser arquivada depois dela e de `sidebar-menu-botoes` e `ajuste-sidebar-logo-dashboard`.

## Impact

- Só front, sem API.
- `src/app/(app)/layout.tsx`;
- `src/components/sidebar.tsx` (menu único) e novos componentes do shell: barra do celular com o painel, bloco da logo e menu do usuário;
- `src/lib/nav.ts` sem mudança de conteúdo.
