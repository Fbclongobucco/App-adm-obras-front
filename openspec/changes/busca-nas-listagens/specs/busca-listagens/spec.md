# Spec Delta

## Purpose

Permite localizar registros nas listagens por texto, buscando em todos os registros do recurso e não só na página exibida.

## ADDED Requirements

### Requirement: Parâmetro de busca na API
As listagens paginadas SHALL aceitar o parâmetro opcional `q`. Sem `q` ou com `q` só de espaços, o resultado MUST ser o mesmo de hoje. Com `q`, MUST retornar apenas os registros em que algum campo pesquisável contém o termo, ignorando maiúsculas, minúsculas e acentos. Paginação, ordenação e `totalElements` MUST refletir o resultado filtrado. Termos com mais de 100 caracteres MUST ser rejeitados com 400 e errorCode `page.invalid.query`.

#### Scenario: Sem acento e sem diferenciar maiúsculas
- **WHEN** existe o colaborador "José Antônio" e a API recebe `GET /api/employees?q=jose antonio`
- **THEN** o colaborador aparece no resultado

#### Scenario: Paginação do resultado
- **WHEN** 25 obras contêm "galpão" e a API recebe `GET /api/projects?q=galpao&page=1&size=20`
- **THEN** a resposta traz as 5 obras restantes e `totalElements` igual a 25

#### Scenario: Termo longo demais
- **WHEN** a API recebe `q` com 101 caracteres
- **THEN** responde 400 com errorCode `page.invalid.query`

### Requirement: Campos pesquisáveis por listagem
Cada listagem SHALL pesquisar os campos abaixo. Em CPF e CNPJ, a comparação MUST usar só os dígitos do termo e do campo.

| Listagem | Campos |
|---|---|
| Obras | OS, descrição, nome do cliente |
| Clientes | nome, e-mail, cidade |
| Colaboradores | nome, CPF, e-mail |
| Centros de custo | nome, CNPJ |
| Restaurantes | nome, OS da obra, cidade |
| Refeições | nome do restaurante, OS da obra |
| Hospedagens | anfitrião, cidade, OS da obra |
| Usuários | nome, e-mail |

#### Scenario: Obra pelo cliente
- **WHEN** a obra OS-2026-007 é do cliente "Agroindustrial Campo Novo" e o usuário busca "campo novo" em Obras
- **THEN** a obra OS-2026-007 aparece no resultado

#### Scenario: CPF formatado
- **WHEN** um colaborador tem CPF 52998224725 e o usuário busca "529.982"
- **THEN** o colaborador aparece no resultado

#### Scenario: Refeição pela OS
- **WHEN** o usuário busca "OS-2026-010" em Refeições
- **THEN** aparecem as refeições dos restaurantes dessa obra

### Requirement: Campo de busca nas listagens
As listagens de obras, clientes, colaboradores, centros de custo, restaurantes, refeições, hospedagens e usuários SHALL exibir um campo de busca acima da lista, com placeholder indicando os campos pesquisados. A busca MUST ser aplicada ao digitar, depois de uma pausa curta, sem precisar de botão, e MUST ir para a URL como `?q=`.

#### Scenario: Buscar ao digitar
- **WHEN** o usuário digita "fundição" no campo de busca de Clientes e para de digitar
- **THEN** a lista mostra só os clientes correspondentes e a URL passa a conter `q=fundição`

#### Scenario: Link compartilhado
- **WHEN** o usuário abre `/obras?q=retrofit`
- **THEN** o campo já vem preenchido com "retrofit" e a lista já vem filtrada

#### Scenario: Limpar busca
- **WHEN** o usuário apaga o texto do campo ou usa a ação de limpar
- **THEN** a lista volta a mostrar todos os registros e o `q` sai da URL

### Requirement: Paginação com busca
Uma nova busca SHALL voltar para a primeira página. Os links de paginação MUST preservar o termo de busca.

#### Scenario: Próxima página mantém a busca
- **WHEN** a busca "montagem" tem 2 páginas e o usuário clica em "Próxima"
- **THEN** a URL contém `q=montagem&page=1` e a lista continua filtrada

#### Scenario: Nova busca na página 3
- **WHEN** o usuário está na página 3 e digita um novo termo
- **THEN** a lista mostra a página 1 do novo resultado

### Requirement: Resultado vazio
Quando a busca não encontrar registros, a listagem SHALL exibir "Nenhum resultado para" seguido do termo e uma ação para limpar a busca, em vez da mensagem de lista vazia do cadastro.

#### Scenario: Sem resultado
- **WHEN** o usuário busca "zzzz" em Restaurantes
- **THEN** a tela mostra "Nenhum resultado para “zzzz”" e o link "Limpar busca"
