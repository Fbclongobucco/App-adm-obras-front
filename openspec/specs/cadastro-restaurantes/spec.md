# cadastro-restaurantes Specification

## Purpose
Define o cadastro de restaurantes que atendem as obras, incluindo a taxa de entrega, e o card que resume quantidades e custos por período de fechamento.

## Requirements

### Requirement: Taxa de entrega opcional
O cadastro de restaurante SHALL aceitar duas taxas de entrega opcionais, em reais, cobradas por entrega: "Taxa por entrega do almoço" e "Taxa por entrega do jantar". Quando informada, cada taxa MUST ser maior que zero. Taxa vazia significa que a entrega daquela refeição não é cobrada. A entrega do almoço MUST usar a taxa do almoço, e a do jantar, a taxa do jantar. Restaurantes cadastrados antes desta mudança MUST ficar com a taxa anterior nas duas refeições.

#### Scenario: Restaurante sem taxa
- **WHEN** o administrador salva um restaurante com as duas taxas de entrega vazias
- **THEN** o restaurante é salvo e as refeições dele têm parcela de entrega R$ 0,00

#### Scenario: Taxas diferentes
- **WHEN** o administrador salva um restaurante com entrega do almoço R$ 8,00 e do jantar R$ 10,00
- **THEN** a refeição Almoço e jantar desse restaurante tem parcela de entrega de R$ 18,00 por dia

#### Scenario: Só o almoço cobra entrega
- **WHEN** o restaurante tem entrega do almoço R$ 8,00 e a do jantar vazia
- **THEN** a refeição Jantar desse restaurante tem parcela de entrega R$ 0,00

#### Scenario: Taxa inválida
- **WHEN** o administrador informa taxa de entrega do almoço ou do jantar zero ou negativa
- **THEN** o envio é rejeitado com a mensagem "Taxa de entrega deve ser maior que zero."

#### Scenario: Taxa alterada
- **WHEN** uma das taxas de entrega de um restaurante é alterada
- **THEN** o custo por dia, o total estimado, a projeção por período e o fechamento semanal das refeições desse restaurante passam a usar a nova taxa

#### Scenario: Restaurante existente
- **WHEN** um restaurante cobrava R$ 8,00 por entrega antes desta mudança
- **THEN** ele passa a ter entrega do almoço R$ 8,00 e do jantar R$ 8,00, e nenhum valor calculado muda

### Requirement: Card do restaurante
A listagem de restaurantes SHALL exibir cada restaurante em card com:
- nome, obra, telefone, taxa de entrega e refrigerante ("Sem refrigerante" quando vazio);
- a taxa de entrega aparece como um valor único quando as duas são iguais, como "Almoço R$ x · Jantar R$ y" quando diferem, com "sem taxa" na refeição vazia, e "Sem taxa" quando as duas são vazias;
- marmitas por dia de almoço e de jantar, entregas por dia e refrigerantes por dia, somando as refeições do restaurante;
- quadro com as colunas Dia, Semana (5 dias úteis), 15 dias (10 dias úteis) e Mês (22 dias úteis), e as linhas de quantidade de marmitas e valor.

O card inteiro MUST levar ao detalhe do restaurante. O cabeçalho do detalhe MUST mostrar a taxa de entrega no mesmo formato.

#### Scenario: Restaurante com almoço e jantar
- **WHEN** o restaurante cobra entrega de R$ 8,00 no almoço e no jantar, fornece refrigerante a R$ 5,00 e serve uma refeição Almoço e jantar com almoço 10 × R$ 25,00 e jantar 8 × R$ 22,00
- **THEN** o card mostra "R$ 8,00 por entrega", "Refrigerante: R$ 5,00 por entrega", 10 almoços, 8 jantares, 2 entregas e 2 refrigerantes por dia, e o quadro mostra R$ 452,00 (Dia), R$ 2.260,00 (Semana), R$ 4.520,00 (15 dias) e R$ 9.944,00 (Mês)

#### Scenario: Taxas diferentes no card
- **WHEN** o restaurante cobra entrega do almoço R$ 8,00 e do jantar R$ 10,00, fornece refrigerante a R$ 5,00 e serve a mesma refeição
- **THEN** o card mostra "Almoço R$ 8,00 · Jantar R$ 10,00" e o quadro mostra R$ 454,00 (Dia), R$ 2.270,00 (Semana), R$ 4.540,00 (15 dias) e R$ 9.988,00 (Mês)

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

### Requirement: Refrigerante no restaurante
O cadastro de restaurante SHALL aceitar, na criação e na edição, um preço unitário de refrigerante opcional, ao lado da taxa de entrega. Quando informado, o preço MUST ser maior que zero e vale para todas as refeições do restaurante, com 1 refrigerante por entrega. Vazio significa que o restaurante não fornece refrigerante. O formulário de refeição MUST NOT ter campo de refrigerante.

#### Scenario: Criar com refrigerante
- **WHEN** o administrador cria um restaurante com refrigerante a R$ 5,00
- **THEN** o restaurante é salvo e as refeições dele passam a ter 1 refrigerante por entrega a R$ 5,00

#### Scenario: Editar o refrigerante
- **WHEN** o administrador altera o refrigerante de um restaurante de R$ 5,00 para R$ 6,00
- **THEN** o custo por dia, o total estimado e o quadro de períodos de todas as refeições do restaurante passam a usar R$ 6,00

#### Scenario: Remover o refrigerante
- **WHEN** o administrador apaga o preço do refrigerante e salva
- **THEN** as refeições do restaurante passam a ter refrigerante R$ 0,00 e o restaurante aparece como "Sem refrigerante"

#### Scenario: Preço inválido
- **WHEN** o administrador informa refrigerante zero ou negativo
- **THEN** o envio é rejeitado com a mensagem "Preço do refrigerante deve ser maior que zero."

#### Scenario: Formulário de refeição
- **WHEN** o administrador abre "Nova refeição" ou edita uma refeição
- **THEN** não há campo de refrigerante, e o detalhe mostra o refrigerante herdado do restaurante
