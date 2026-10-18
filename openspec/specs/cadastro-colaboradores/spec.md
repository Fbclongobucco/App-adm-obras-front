# cadastro-colaboradores Specification

## Purpose
Define as regras de preenchimento do cadastro de colaboradores que compõem as equipes de obra, incluindo os dados de contato obrigatórios e opcionais.

## Requirements

### Requirement: E-mail opcional do colaborador
O cadastro de colaborador SHALL aceitar e-mail vazio. Quando informado, o e-mail MUST ter formato válido e MUST ser único entre os colaboradores.

#### Scenario: Colaborador sem e-mail
- **WHEN** o administrador salva um colaborador com o campo e-mail vazio
- **THEN** o colaborador é salvo e o formulário não marca o e-mail como obrigatório

#### Scenario: E-mail inválido
- **WHEN** o administrador informa "montador@" no campo e-mail
- **THEN** o envio é rejeitado com a mensagem "E-mail inválido."

#### Scenario: E-mail duplicado
- **WHEN** o administrador informa um e-mail já usado por outro colaborador
- **THEN** o envio é rejeitado com a mensagem "Já existe um colaborador com este e-mail."

#### Scenario: Vários colaboradores sem e-mail
- **WHEN** dois colaboradores são salvos sem e-mail
- **THEN** ambos são aceitos, sem conflito de duplicidade

### Requirement: Exibição de colaborador sem e-mail
Onde o e-mail do colaborador for exibido, a aplicação SHALL mostrar "—" quando ele não existir.

#### Scenario: Detalhe sem e-mail
- **WHEN** o usuário abre um colaborador sem e-mail
- **THEN** o campo e-mail aparece vazio e nenhuma tela mostra "null" ou "undefined"
