# Design

## Context

- `public/soler-logo.png` (168×65, RGB sem canal alfa) foi recortado do JPEG 200×200 do LinkedIn. O fundo branco faz parte do arquivo.
- A marca tem texto grafite (~#252525) e símbolo vermelho, praticamente a mesma cor do fundo da sidebar (`bg-title` #252525). O padrão da marca proíbe recolorir a logo. Sobre grafite, ela só fica visível com um fundo claro atrás.
- Sidebar atual (`src/components/sidebar.tsx`):

```
Elemento	Classe atual	Cor resultante	Contraste sobre #252525
Itens	text-white/75	~#C8C8C8	9,2:1
Títulos de seção	text-line	#9A9A9A	5,4:1
Item ativo	bg-white/10 text-white	#FFFFFF	15,3:1
```

  Os valores passam no mínimo de 4,5:1, mas a leitura foi reprovada pelo usuário. Uma hipótese é que o usuário tenha visto uma versão antiga. Na mudança anterior, o `next dev` serviu código desatualizado até ser reiniciado (registrado no apply anterior).
- Indicadores do dashboard (`src/app/(app)/page.tsx`): `panel` com `border-t-2 border-t-highlight`, rótulo e número em Roboto Mono `text-3xl`.

## Goals / Non-Goals

**Goals:**
- Logo com fundo transparente, visualmente idêntica à atual quando sobre branco.
- Menu com leitura evidente: branco sólido nos itens e contraste ≥ 7:1.
- Cartões de indicador neutros e legíveis.

**Non-Goals:**
- Versão negativa ou monocromática da logo: não existe arquivo oficial e criar uma seria alterar a marca.
- Mudanças em tabelas, formulários, dropdown de colaboradores ou páginas de refeição.

## Decisions

### D1. Transparência por "cor para alfa" a partir do branco
Para cada pixel, alfa = maior distância do branco entre os canais, ou seja, `max(255−r, 255−g, 255−b)/255`. A cor é recomposta como `(c − 255·(1−α))/α`. Sobre branco, o resultado é idêntico ao arquivo atual, pixel a pixel, e o reflexo vira semitransparência sem corte.
- O processamento usa `sharp`, já instalado como dependência do Next. O script fica no scratchpad, fora do repositório.
- **Alternativa:** limiar simples (branco vira transparente). Descartada porque deixa franja serrilhada e corta o degradê do reflexo.
- **Alternativa:** vetorizar ou redesenhar a logo. Descartada porque seria alterar a marca.
- **Verificação:** compor o PNG novo sobre branco e comparar com o atual. A diferença máxima por canal deve ser ≤ 2, tolerância para o arredondamento.

### D2. Bloco claro compacto atrás da logo
O topo da sidebar fica grafite. A logo vai dentro de um bloco `bg-white rounded-md px-3 py-2`, só do tamanho da marca e com cantos arredondados. Abaixo dele, o subtítulo "Administração de obras" fica em branco a 70%.
- **Por quê:** o usuário escolheu sidebar grafite com logo sem fundo. Sem recolorir a marca, o fundo claro tem de existir, mas restrito à marca, e não uma faixa de largura total.

### D3. Cores da sidebar

```
Elemento	Antes	Depois	Contraste sobre #252525
Itens	text-white/75	text-white	15,3:1
Hover	hover:bg-white/5	hover:bg-white/10	-
Títulos de seção	text-line #9A9A9A	text-white/70 (~#BEBEBE)	8,2:1
Item ativo	bg-white/10 + barra accent	bg-white/15 + font-semibold + barra accent 3 px	15,3:1
Ícones	currentColor	currentColor	idem ao texto
```

### D4. Cartões de indicador
- `panel` neutro, sem `border-t` colorido.
- Em linha: ícone da seção num quadrado `bg-surface` de 36 px, com traço `text-highlight` (acento pontual).
- À direita do ícone, o rótulo (`text-xs uppercase text-body`) e, abaixo, o número (`font-mono text-3xl text-title`).
- No hover: `border-line` e `shadow-md`.
- Os ícones são os mesmos do menu, buscados em `NAV` pelo `href`, para manter uma única fonte.
- **Alternativa:** manter o filete e só trocar a cor. Descartada porque o usuário reprovou o cartão como um todo.

## Risks / Trade-offs

- [Reflexo da logo semitransparente sobre fundos escuros] → a logo só é exibida sobre branco (bloco da sidebar e login), conforme a spec.
- [Usuário vendo versão desatualizada no `next dev`] → a verificação final inclui reiniciar o `next dev` e pedir atualização forçada (Ctrl+Shift+R) ao usuário.
- [MODIFIED sobre spec ainda não arquivada] → arquivar `melhorias-design-refeicoes-cadastros` antes desta change.
