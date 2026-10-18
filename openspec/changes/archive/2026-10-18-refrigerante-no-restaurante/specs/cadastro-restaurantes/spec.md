# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Card do restaurante
A listagem de restaurantes SHALL exibir cada restaurante em card com:
- nome, obra, telefone, taxa de entrega ("Sem taxa" quando vazia) e refrigerante ("Sem refrigerante" quando vazio);
- marmitas por dia de almoço e de jantar, entregas por dia e refrigerantes por dia, somando as refeições do restaurante;
- quadro com as colunas Dia, Semana (5 dias úteis), 15 dias (10 dias úteis) e Mês (22 dias úteis), e as linhas de quantidade de marmitas e valor.

O card inteiro MUST levar ao detalhe do restaurante.

#### Scenario: Restaurante com almoço e jantar
- **WHEN** o restaurante cobra entrega de R$ 8,00, fornece refrigerante a R$ 5,00 e serve uma refeição Almoço e jantar com almoço 10 × R$ 25,00 e jantar 8 × R$ 22,00
- **THEN** o card mostra "R$ 8,00 por entrega", "Refrigerante: R$ 5,00 por entrega", 10 almoços, 8 jantares, 2 entregas e 2 refrigerantes por dia, e o quadro mostra R$ 452,00 (Dia), R$ 2.260,00 (Semana), R$ 4.520,00 (15 dias) e R$ 9.944,00 (Mês)

#### Scenario: Restaurante sem refeição
- **WHEN** o restaurante ainda não tem refeição cadastrada
- **THEN** o card informa "Nenhuma refeição cadastrada" no lugar do quadro

#### Scenario: Navegação
- **WHEN** o usuário clica no card
- **THEN** a aplicação abre o detalhe do restaurante, que mostra o mesmo quadro de períodos
