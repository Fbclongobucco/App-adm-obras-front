# fechamento-refeicoes Specification

## Purpose
Fechamento semanal (segunda a domingo) das refeições de uma obra, por restaurante e por refeição, com as datas reais, os feriados e os dias extras da semana.

## Requirements

### Requirement: Semanas de fechamento
O sistema SHALL listar as semanas de calendário, de segunda a domingo, que têm pelo menos um dia dentro do período da obra. A primeira e a última semana MUST ser cortadas nas datas de início e de término da obra e marcadas como parciais. Se a obra não tem término, a lista MUST ir até a semana atual. Se a obra ainda não começou, a lista MUST ter só a semana do início. As semanas MUST vir em ordem cronológica.

#### Scenario: Obra de duas semanas completas
- **WHEN** a obra vai de segunda 05/10/2026 a domingo 18/10/2026
- **THEN** a lista tem 2 semanas: 05/10 a 11/10/2026 e 12/10 a 18/10/2026, nenhuma parcial

#### Scenario: Início e término no meio da semana
- **WHEN** a obra vai de quarta 07/10/2026 a sexta 16/10/2026
- **THEN** a lista tem "07/10 a 11/10/2026 (parcial)" e "12/10 a 16/10/2026 (parcial)"

#### Scenario: Obra sem término
- **WHEN** a obra começou em 05/10/2026, não tem término e hoje é 21/10/2026
- **THEN** a lista vai de 05/10 a 11/10/2026 até a semana de 19/10 a 25/10/2026

### Requirement: Semana selecionada
A tela SHALL oferecer as semanas num dropdown, com a semana atual marcada como "atual". A semana selecionada MUST ficar na URL, para recarregar e compartilhar. Sem semana na URL, a tela MUST abrir na semana atual, se ela estiver no período da obra. Antes do início da obra, MUST abrir na primeira semana; depois do término, na última. Uma semana inválida na URL MUST cair na semana padrão.

#### Scenario: Hoje dentro do período
- **WHEN** a obra vai de 05/10/2026 a 30/10/2026, hoje é 14/10/2026 e a URL não indica semana
- **THEN** o dropdown abre em "12/10 a 18/10/2026 (atual)"

#### Scenario: Obra encerrada
- **WHEN** a obra terminou em 16/10/2026 e hoje é 10/11/2026
- **THEN** o dropdown abre na última semana, "12/10 a 16/10/2026 (parcial)"

#### Scenario: Troca de semana
- **WHEN** o usuário escolhe outra semana no dropdown
- **THEN** a tabela passa a mostrar a semana escolhida e a URL registra a semana

### Requirement: Fechamento da semana
Para a semana selecionada, o sistema SHALL mostrar os 7 dias, de segunda a domingo, com data, dia da semana, situação, almoços, jantares, entregas, refrigerantes e valor. As situações são:
- **Fornecimento:** dia útil sem ajuste, com as quantidades e o custo por dia da refeição;
- **Fornecimento alterado:** dia útil com os números do dia informados pelo administrador, com o valor calculado a partir deles;
- **Sem fornecimento:** dia útil com esse ajuste, zerado;
- **Dia extra:** sábado ou domingo com esse ajuste, com as quantidades e o valor do ajuste;
- **Sem expediente:** sábado ou domingo sem ajuste, zerado;
- **Fora do período:** dia antes do início ou depois do término da obra, zerado.

A coluna de entregas MUST mostrar o total do dia (almoço + jantar). A linha de totais MUST mostrar dias de fornecimento (fornecimento + fornecimento alterado + dias extras), almoços, jantares, entregas, refrigerantes e valor. A soma dos valores de todas as semanas MUST ser igual ao total estimado da refeição.

#### Scenario: Semana com dia extra
- **WHEN** a refeição Almoço e jantar tem almoço 10 × R$ 25,00, jantar 8 × R$ 22,00, entrega R$ 8,00 no almoço e no jantar e refrigerante R$ 5,00 (R$ 452,00 por dia), a obra vai de 05/10/2026 a 16/10/2026 e o sábado 10/10/2026 é dia extra com 6 almoços
- **THEN** a semana de 05/10 a 11/10/2026 mostra 5 dias de fornecimento, 1 dia extra de R$ 163,00, domingo sem expediente, 6 dias de fornecimento no total e valor de R$ 2.423,00

#### Scenario: Semana com feriado
- **WHEN** na mesma refeição a segunda 12/10/2026 está sem fornecimento
- **THEN** a semana de 12/10 a 16/10/2026 mostra 12/10 sem fornecimento, 4 dias de fornecimento, sábado e domingo fora do período e valor de R$ 1.808,00

#### Scenario: Soma das semanas
- **WHEN** as duas semanas acima são somadas
- **THEN** o total é R$ 4.231,00, igual ao total estimado da refeição

#### Scenario: Semana com dia alterado
- **WHEN** a refeição Almoço e jantar tem almoço 10 × R$ 25,00, jantar 8 × R$ 22,00, entrega do almoço R$ 8,00, entrega do jantar R$ 10,00 e refrigerante R$ 5,00 (R$ 454,00 por dia), a obra vai de 05/10/2026 a 16/10/2026 e a quarta 14/10/2026 está alterada para 10 almoços, 9 jantares, 2 entregas no almoço e 1 no jantar, sem refrigerantes informados
- **THEN** a semana de 12/10 a 16/10/2026 mostra 14/10 como "Fornecimento alterado" com 3 entregas, 3 refrigerantes e R$ 489,00, 5 dias de fornecimento e valor de R$ 2.305,00

#### Scenario: Restaurante com refeições separadas
- **WHEN** o restaurante tem uma refeição Almoço (10 × R$ 25,00) e outra Jantar (8 × R$ 22,00), com entrega de R$ 8,00 no almoço e no jantar e refrigerante de R$ 5,00, sem ajustes, numa semana com 5 dias úteis
- **THEN** o fechamento do restaurante mostra por dia 10 almoços, 8 jantares, 2 entregas, 2 refrigerantes e R$ 452,00, e na semana R$ 2.260,00

### Requirement: Feriado na semana
Um administrador SHALL poder marcar um dia útil da semana como "Sem fornecimento" e desmarcar, com observação opcional. No detalhe da refeição, a ação vale só para ela. No detalhe do restaurante, MUST valer para todas as refeições do restaurante: aplica a todas ou a nenhuma. As regras e mensagens são as dos ajustes por data.

#### Scenario: Feriado no restaurante
- **WHEN** o administrador marca 12/10/2026 como sem fornecimento no restaurante com as refeições Almoço e Jantar
- **THEN** as duas refeições passam a ter o ajuste "Sem fornecimento" em 12/10/2026, e a semana mostra o dia zerado

#### Scenario: Conflito em uma das refeições
- **WHEN** a refeição Jantar já tem ajuste em 12/10/2026 e o administrador marca o feriado nessa data no restaurante
- **THEN** nada é gravado e a tela mostra "Já existe um ajuste nesta data."

#### Scenario: Desmarcar feriado
- **WHEN** o administrador desmarca o feriado de 12/10/2026 no restaurante
- **THEN** o ajuste "Sem fornecimento" dessa data é removido de todas as refeições do restaurante, e o dia volta a fornecimento

### Requirement: Dia extra na semana
Um administrador SHALL poder incluir e remover "Dia extra" em sábado ou domingo da semana, informando as quantidades e uma observação opcional. No detalhe do restaurante, o formulário MUST pedir as quantidades de cada refeição. O ajuste MUST ser criado só nas refeições com alguma quantidade maior que zero, e pelo menos uma refeição MUST ter quantidade. A inclusão MUST ser atômica.

#### Scenario: Sábado só com almoço no restaurante
- **WHEN** o administrador inclui dia extra em 10/10/2026 no restaurante com 6 almoços na refeição Almoço e 0 jantares na refeição Jantar
- **THEN** só a refeição Almoço recebe o ajuste, e o dia vale R$ 163,00

#### Scenario: Sem quantidade
- **WHEN** o administrador inclui dia extra com todas as quantidades zeradas
- **THEN** nada é gravado e a tela pede ao menos uma quantidade maior que zero

### Requirement: Somente leitura para operador
Um usuário OPERADOR SHALL ver as semanas e o fechamento, sem ações de feriado, de dia extra nem de edição do dia.

#### Scenario: Operador na semana
- **WHEN** um OPERADOR abre o fechamento semanal de um restaurante
- **THEN** vê o dropdown, a tabela e os totais, sem botões de edição

### Requirement: Exportação da semana
O fechamento semanal SHALL oferecer o download de uma planilha (.xlsx) da semana selecionada, com restaurante, obra, período da semana e uma linha por dia: data, dia da semana, situação, almoços, jantares, entregas do almoço, entregas do jantar, refrigerantes e os valores de cada item calculados pelos preços unitários, pela taxa de entrega de cada refeição e pelo preço do refrigerante, mais o total do dia. A planilha MUST ter a linha de totais da semana, e o total MUST ser igual ao valor da semana na tela.

#### Scenario: Exportar a semana com dia extra
- **WHEN** o usuário exporta a semana de 05/10 a 11/10/2026 do restaurante com Almoço (R$ 25,00), Jantar (R$ 22,00), entrega R$ 8,00 no almoço e no jantar, refrigerante R$ 5,00 e dia extra no sábado com 6 almoços
- **THEN** a planilha tem 7 linhas de dias, o sábado com 6 almoços, 1 entrega do almoço, 0 entregas do jantar, 1 refrigerante e R$ 163,00, e o total da semana é R$ 2.423,00

#### Scenario: Exportar a semana com dia alterado
- **WHEN** o usuário exporta a semana de 12/10 a 16/10/2026 da refeição do cenário "Semana com dia alterado"
- **THEN** a linha de 14/10 tem 2 entregas do almoço a R$ 8,00 (R$ 16,00), 1 entrega do jantar a R$ 10,00 (R$ 10,00), 3 refrigerantes e R$ 489,00, e o total da semana é R$ 2.305,00

### Requirement: Detalhe sem formulário de edição
O detalhe do restaurante e o da refeição SHALL mostrar os dados e os fechamentos sem o formulário de edição. A edição MUST ficar numa página própria, acessível por "Editar" no cabeçalho, só para administrador. O fechamento semanal MUST ocupar a largura disponível sem rolagem horizontal interna; em telas estreitas, os dias MUST aparecer em lista.

#### Scenario: Editar pelo cabeçalho
- **WHEN** o administrador clica em "Editar" no detalhe do restaurante
- **THEN** abre a página de edição com o formulário, e ao salvar volta para a lista

#### Scenario: Operador
- **WHEN** um OPERADOR abre o detalhe do restaurante
- **THEN** não vê o botão "Editar"

### Requirement: Dia alterado na semana
Um administrador SHALL poder editar um dia útil com fornecimento na semana, informando almoços, jantares, entregas do almoço, entregas do jantar, refrigerantes e uma observação opcional. O formulário MUST abrir preenchido com os números atuais do dia e mostrar só os campos das refeições servidas e, para refrigerantes, só quando o restaurante fornece. Entregas e refrigerantes vazios MUST usar o padrão. Ao salvar, o dia MUST passar a "Fornecimento alterado". Um dia alterado MUST oferecer "Editar" e "Restaurar padrão"; restaurar remove a alteração e o dia volta a "Fornecimento". Dia sem fornecimento MUST NOT oferecer "Editar" até o feriado ser desmarcado.

No detalhe do restaurante, o formulário MUST pedir os números de cada refeição, e a gravação MUST ser atômica. Uma refeição com todas as quantidades zeradas MUST ficar sem fornecimento nesse dia, e pelo menos uma refeição MUST ter quantidade maior que zero. "Restaurar padrão" no restaurante MUST remover os ajustes da data em todas as refeições dele.

#### Scenario: Uma janta a mais
- **WHEN** o administrador edita a quarta 14/10/2026 da refeição Almoço e jantar (padrão 10 almoços e 8 jantares) e informa 9 jantares, sem mudar o resto
- **THEN** o dia passa a "Fornecimento alterado" com 9 jantares, e o valor do dia e da semana são recalculados

#### Scenario: Restaurar padrão
- **WHEN** o administrador clica em "Restaurar padrão" em 14/10/2026
- **THEN** o dia volta a "Fornecimento" com 10 almoços, 8 jantares e o custo por dia da refeição

#### Scenario: Restaurante com jantar suspenso no dia
- **WHEN** no restaurante com as refeições Almoço e Jantar o administrador edita 14/10/2026 e informa 10 almoços e 0 jantares
- **THEN** a refeição Jantar fica sem fornecimento em 14/10/2026, a refeição Almoço fica com o padrão, e o dia do restaurante mostra 10 almoços, 0 jantares e 1 entrega

#### Scenario: Erro em uma refeição do restaurante
- **WHEN** no restaurante o administrador informa entregas do jantar maiores que zero com 0 jantares
- **THEN** nada é gravado e a tela mostra a mensagem do erro

### Requirement: Edição do dia extra
O dia extra SHALL usar o mesmo formulário do dia alterado, com entregas do almoço, entregas do jantar e refrigerantes opcionais. Um dia extra já incluído MUST oferecer "Editar", que abre o formulário preenchido e grava sem remover o ajuste, e "Remover".

#### Scenario: Incluir jantares no sábado
- **WHEN** o sábado 10/10/2026 é dia extra com 6 almoços (R$ 163,00) na refeição com entrega do almoço R$ 8,00, entrega do jantar R$ 10,00 e refrigerante R$ 5,00, e o administrador edita para 6 almoços e 4 jantares a R$ 22,00
- **THEN** o dia extra passa a valer R$ 266,00 (R$ 238,00 de marmitas, 1 entrega do almoço, 1 entrega do jantar e 2 refrigerantes)
