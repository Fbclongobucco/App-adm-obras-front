# Spec Delta

## ADDED Requirements

### Requirement: Conteúdo contido nos cards
Textos, selos e valores dos cards de indicador e de obra SHALL ficar inteiramente dentro da caixa do card em qualquer largura de janela de 375 px a 1920 px. Quando faltar espaço, a grade MUST reduzir o número de colunas, e a linha do card MUST quebrar, em vez de deixar o conteúdo vazar.

#### Scenario: Indicadores em larguras intermediárias
- **WHEN** o dashboard é aberto com janela de 640, 768, 1024, 1280, 1366, 1440, 1536, 1600 ou 1920 px
- **THEN** nenhum rótulo de indicador (incluindo COLABORADORES, RESTAURANTES e HOSPEDAGENS) ultrapassa a borda do card

#### Scenario: Card de obra estreito
- **WHEN** a lista de obras é exibida com janela de 640 ou 768 px
- **THEN** o selo de situação, as datas e o total ficam dentro do card, com a grade em uma coluna se necessário

#### Scenario: Celular
- **WHEN** o dashboard é aberto em 375 px
- **THEN** os cards ocupam a largura disponível sem rolagem horizontal da página
