# Spec Delta

## Purpose

Define as regras de preenchimento do cadastro de clientes das obras, incluindo os dados de contato obrigatórios e opcionais.

## ADDED Requirements

### Requirement: E-mail opcional do cliente
O cadastro de cliente SHALL aceitar e-mail vazio. Quando informado, o e-mail MUST ter formato válido e MUST ser único entre os clientes.

#### Scenario: Cliente sem e-mail
- **WHEN** o administrador salva um cliente com o campo e-mail vazio
- **THEN** o cliente é salvo e o formulário não marca o e-mail como obrigatório

#### Scenario: E-mail inválido
- **WHEN** o administrador informa "cliente@" no campo e-mail
- **THEN** o envio é rejeitado com a mensagem "E-mail inválido."

#### Scenario: E-mail duplicado
- **WHEN** o administrador informa um e-mail já usado por outro cliente
- **THEN** o envio é rejeitado com a mensagem "Já existe um cliente com este e-mail."

#### Scenario: Vários clientes sem e-mail
- **WHEN** dois clientes são salvos sem e-mail
- **THEN** ambos são aceitos, sem conflito de duplicidade

### Requirement: Exibição de cliente sem e-mail
A listagem de clientes SHALL exibir "—" na coluna E-mail quando o cliente não tiver e-mail.

#### Scenario: Listagem
- **WHEN** a listagem contém um cliente sem e-mail
- **THEN** a coluna E-mail desse cliente mostra "—"
