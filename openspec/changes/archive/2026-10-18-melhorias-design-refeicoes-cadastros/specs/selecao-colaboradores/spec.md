# Spec Delta

## Purpose

Define como o usuário escolhe vários colaboradores em formulários (equipe da obra e hóspedes da hospedagem), com lista suspensa e busca por nome.

## ADDED Requirements

### Requirement: Dropdown de seleção múltipla
Os campos de colaboradores dos formulários de obra e de hospedagem SHALL ser um dropdown que, ao ser aberto, mostra a lista de colaboradores com caixa de seleção em cada item. A lista MUST permitir marcar e desmarcar vários colaboradores sem fechar.

#### Scenario: Abrir a lista
- **WHEN** o usuário clica no campo Colaboradores
- **THEN** abre uma lista suspensa com todos os colaboradores cadastrados, cada um com nome e centro de custo

#### Scenario: Selecionar vários
- **WHEN** o usuário marca três colaboradores na lista aberta
- **THEN** os três ficam selecionados e a lista continua aberta

#### Scenario: Fechar a lista
- **WHEN** o usuário clica fora da lista ou pressiona Esc
- **THEN** a lista fecha e mantém a seleção

### Requirement: Busca por nome
A lista suspensa SHALL ter um campo de busca sempre visível no topo que filtra os colaboradores pelo nome, sem diferenciar maiúsculas de minúsculas nem acentos. A busca MUST NOT desmarcar colaboradores já selecionados que fiquem fora do filtro.

#### Scenario: Filtrar
- **WHEN** o usuário digita "jose" na busca
- **THEN** a lista mostra apenas colaboradores cujo nome contém "jose", incluindo "José"

#### Scenario: Seleção preservada
- **WHEN** um colaborador selecionado não corresponde ao texto da busca
- **THEN** ele continua selecionado e é enviado ao salvar o formulário

#### Scenario: Sem resultado
- **WHEN** nenhum nome corresponde à busca
- **THEN** a lista mostra "Nenhum colaborador encontrado."

### Requirement: Resumo da seleção
Com a lista fechada, o campo SHALL mostrar a quantidade de selecionados e os nomes escolhidos, cada um com opção de remoção. Sem seleção, MUST exibir o texto de vazio do formulário.

#### Scenario: Remover pelo resumo
- **WHEN** o usuário remove um colaborador pelo resumo da seleção
- **THEN** ele deixa de estar selecionado e a contagem diminui em um

#### Scenario: Somente leitura
- **WHEN** um usuário sem perfil de administrador abre uma obra
- **THEN** o campo mostra os colaboradores vinculados e não permite abrir a lista nem remover itens

### Requirement: Uso por teclado
O dropdown SHALL ser operável por teclado: abrir com Enter ou espaço, navegar pelos itens com as setas, marcar com espaço e fechar com Esc.

#### Scenario: Teclado
- **WHEN** o foco está no campo e o usuário pressiona Enter, seta para baixo e espaço
- **THEN** a lista abre e o primeiro colaborador visível é marcado
