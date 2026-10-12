# Spec Delta

## ADDED Requirements

### Requirement: Escala tipográfica legível
A interface SHALL usar escala base de 18 px. O texto de corpo e de tabelas MUST ter pelo menos 16 px, rótulos de campo e botões pelo menos 15 px e textos auxiliares (dicas, metadados) pelo menos 13 px. Tamanhos de fonte MUST ser relativos à escala base, para acompanhar o zoom do navegador.

#### Scenario: Tabela
- **WHEN** uma listagem é exibida com zoom de 100%
- **THEN** o texto das células tem pelo menos 16 px

#### Scenario: Formulário
- **WHEN** um formulário é exibido com zoom de 100%
- **THEN** os rótulos dos campos têm pelo menos 15 px e as dicas pelo menos 13 px
