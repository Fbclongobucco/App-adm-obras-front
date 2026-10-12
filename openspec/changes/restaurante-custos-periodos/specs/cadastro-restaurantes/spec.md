# Spec Delta

## Purpose

Define o cadastro de restaurantes que atendem as obras, incluindo a taxa de entrega, e o card que resume quantidades e custos por período de fechamento.

## ADDED Requirements

### Requirement: Taxa de entrega opcional
O cadastro de restaurante SHALL aceitar uma taxa de entrega opcional, em reais, cobrada por entrega. Quando informada, MUST ser maior que zero. Vazio significa restaurante sem taxa de entrega.

#### Scenario: Restaurante sem taxa
- **WHEN** o administrador salva um restaurante com a taxa de entrega vazia
- **THEN** o restaurante é salvo e as refeições dele têm parcela de entrega R$ 0,00

#### Scenario: Taxa inválida
- **WHEN** o administrador informa taxa de entrega zero ou negativa
- **THEN** o envio é rejeitado com a mensagem "Taxa de entrega deve ser maior que zero."

#### Scenario: Taxa alterada
- **WHEN** a taxa de entrega de um restaurante é alterada
- **THEN** o custo por dia, o total estimado e a projeção por período das refeições desse restaurante passam a usar a nova taxa

### Requirement: Card do restaurante
A listagem de restaurantes SHALL exibir cada restaurante em card com:
- nome, obra, telefone e taxa de entrega ("Sem taxa" quando vazia);
- marmitas por dia de almoço e de jantar, entregas por dia e refrigerantes por dia, somando as refeições do restaurante;
- quadro com as colunas Dia, Semana (5 dias úteis), 15 dias (10 dias úteis) e Mês (22 dias úteis), e as linhas de quantidade de marmitas e valor.

O card inteiro MUST levar ao detalhe do restaurante.

#### Scenario: Restaurante com almoço e jantar
- **WHEN** o restaurante serve uma refeição Almoço e jantar com almoço 10 × R$ 25,00, jantar 8 × R$ 22,00, entrega R$ 8,00 e refrigerante R$ 5,00
- **THEN** o card mostra 10 almoços, 8 jantares, 2 entregas e 2 refrigerantes por dia, e o quadro mostra R$ 452,00 (Dia), R$ 2.260,00 (Semana), R$ 4.520,00 (15 dias) e R$ 9.944,00 (Mês)

#### Scenario: Restaurante sem refeição
- **WHEN** o restaurante ainda não tem refeição cadastrada
- **THEN** o card informa "Nenhuma refeição cadastrada" no lugar do quadro

#### Scenario: Navegação
- **WHEN** o usuário clica no card
- **THEN** a aplicação abre o detalhe do restaurante, que mostra o mesmo quadro de períodos

### Requirement: Layout dos cards de restaurante
Os cards de restaurante SHALL manter todo o conteúdo dentro da própria caixa de 375 px a 1920 px de largura de janela. O quadro de períodos MAY rolar horizontalmente dentro do card em telas estreitas.

#### Scenario: Celular
- **WHEN** a listagem de restaurantes é aberta em 375 px
- **THEN** os cards ficam em uma coluna, sem rolagem horizontal da página
