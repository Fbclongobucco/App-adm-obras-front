# Proposal

## Why

A revisão do usuário reprovou três pontos de `melhorias-design-refeicoes-cadastros`:
- **Logo:** aparece com fundo branco, porque `public/soler-logo.png` é um recorte do JPEG do LinkedIn sem transparência.
- **Sidebar:** os textos do menu se confundem com o fundo grafite. Seções em #9A9A9A e itens em branco a 75% não dão a leitura esperada.
- **Indicadores do dashboard:** ficaram ruins.

## What Changes

- **Logo sem fundo:** gerar `public/soler-logo.png` com transparência a partir do arquivo atual, sem alterar cor, proporção, reflexo ou contorno. Sobre a sidebar grafite, a logo fica num bloco claro compacto só atrás dela, e não numa faixa branca de largura total. Isso é necessário porque o texto da logo é grafite e a marca não pode ser recolorida.
- **Sidebar grafite com texto branco:** itens em branco sólido, títulos de seção em cinza claro legível e item ativo com fundo mais claro, texto em negrito e barra vermelha. O subtítulo "Administração de obras" passa a ficar em branco sobre o grafite.
- **Indicadores do dashboard:** cartões neutros, sem filete vermelho no topo. Rótulo, número e um ícone da seção ficam em hierarquia clara. A borda só escurece ao passar o mouse.
- Fora do escopo: tabelas, formulários, dropdown de colaboradores e refeições ficam como estão.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `identidade-visual`: muda a exibição da logo (sem fundo, em bloco claro compacto), o contraste mínimo do texto da sidebar e a apresentação dos indicadores do dashboard. A capability é criada por `melhorias-design-refeicoes-cadastros`, que ainda não foi arquivada. Esta change deve ser arquivada depois dela.

## Impact

- `public/soler-logo.png`: substituído pela versão com transparência. O script de geração fica no scratchpad, fora do repositório.
- `src/app/(app)/layout.tsx`: bloco da logo e subtítulo.
- `src/components/sidebar.tsx`: cores dos itens, das seções e do item ativo.
- `src/app/(app)/page.tsx`: cartões de indicadores. Os ícones vêm de `src/lib/nav.ts`.
- `src/app/login/page.tsx`: usa o mesmo PNG. Fundo branco, sem mudança de layout.
- Backend: nenhum impacto.
