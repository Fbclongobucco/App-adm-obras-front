// Mensagens em pt-BR para os errorCode da API. Codigo sem traducao cai na mensagem generica.
const MESSAGES: Record<string, string> = {
  "project.duplicate.os": "Já existe uma obra com esta OS.",
  "client.duplicate.email": "Já existe um cliente com este e-mail.",
  "employee.duplicate.email": "Já existe um colaborador com este e-mail.",
  "employee.duplicate.cpf": "Já existe um colaborador com este CPF.",
  "user.duplicate.email": "Já existe um usuário com este e-mail.",
  "meal.duplicate.type": "Esta obra já tem refeição cadastrada para almoço ou jantar.",
  "cost_center.in_use": "Centro de custo vinculado a colaboradores ou obras. Remova os vínculos antes de excluir.",
  "client.in_use": "Cliente vinculado a obras. Remova as obras antes de excluir.",
  "project.in_use": "Obra com restaurantes, refeições ou hospedagens. Remova esses registros antes de excluir.",
  "employee.in_use": "Colaborador vinculado a obras ou hospedagens. Remova os vínculos antes de excluir.",
  "restaurant.in_use": "Restaurante com refeições: não pode ser excluído nem mudar de obra.",
  "data.integrity_violation": "A operação conflita com dados existentes.",
  "restaurant.invalid.project": "Selecione a obra do restaurante.",
  "restaurant.invalid.name": "Nome do restaurante deve ter de 2 a 100 caracteres.",
  "restaurant.invalid.phone": "Telefone deve ter 10 ou 11 dígitos.",
  "meal.invalid.restaurant": "Selecione o restaurante.",
  "meal.invalid.lunch_price": "Preço deve ser maior que zero.",
  "meal.invalid.dinner_price": "Preço deve ser maior que zero.",
  "meal.invalid.lunch_quantity": "Quantidade do almoço deve estar entre 1 e 10.000.",
  "meal.invalid.dinner_quantity": "Quantidade do jantar deve estar entre 1 e 10.000.",
  "meal.invalid.type": "Selecione o tipo de refeição.",
  "meal.adjustment.duplicate.date": "Já existe um ajuste nesta data.",
  "meal.adjustment.invalid.date": "A data deve estar dentro do período da obra.",
  "meal.adjustment.invalid.extra_day": "Dia extra deve ser sábado ou domingo; dias úteis já são contados.",
  "meal.adjustment.invalid.no_service": "Sem fornecimento só se aplica a dias úteis.",
  "meal.adjustment.invalid.quantity": "Informe a quantidade de pelo menos uma refeição.",
  "meal.adjustment.not_found": "Não há ajuste nesta data.",
  "accommodation.invalid.start_date": "Informe a data de entrada.",
  "accommodation.invalid.monthly_price": "Valor por mês deve ser maior que zero.",
  "accommodation.invalid.renewal_end": "A data final deve ser igual ou posterior ao início da renovação.",
  "accommodation.invalid.renewal_price": "O valor da renovação deve ser maior que zero.",
  "accommodation.lease.renewed": "Desfaça as renovações para alterar a data de entrada.",
  "accommodation.lease.first_period": "O primeiro período da locação não pode ser removido.",
  "restaurant.invalid.delivery_fee": "Taxa de entrega deve ser maior que zero.",
  "restaurant.invalid.soda_price": "Preço do refrigerante deve ser maior que zero.",
  "project.invalid.end_date": "A data de término não pode ser anterior à de início.",
  "project.invalid.cost_center": "Selecione o centro de custo.",
  "project.invalid.client": "Selecione o cliente.",
  "employee.invalid.cpf": "CPF inválido.",
  "employee.invalid.cost_center": "Selecione o centro de custo.",
  "employee.invalid.birth_date": "Data de nascimento inválida ou futura.",
  "employee.invalid.phone": "Telefone deve ter 10 ou 11 dígitos.",
  "cost_center.invalid.cnpj": "CNPJ inválido.",
  "client.invalid.phone": "Telefone deve ter 10 ou 11 dígitos.",
  "user.invalid.password.blank": "Informe a senha.",
  "user.invalid.password.length": "A senha deve ter pelo menos 6 caracteres.",
  "address.invalid.zip_code": "CEP deve ter 8 dígitos.",
  "address.invalid.state": "UF deve ter 2 letras.",
  "address.invalid.state.blank": "Informe a UF.",
  "page.invalid.sort": "Ordenação inválida.",
  forbidden: "Seu perfil não tem permissão para esta operação.",
};

const PREFIX_MESSAGES: [string, string][] = [
  [".not_found", "Registro não encontrado. Ele pode ter sido excluído."],
  [".invalid.email", "E-mail inválido."],
  [".invalid.name", "Nome inválido: verifique o tamanho mínimo e máximo."],
  ["address.invalid", "Endereço incompleto ou inválido."],
];

export function errorMessage(errorCode: string | undefined, fallback?: string): string {
  if (errorCode && MESSAGES[errorCode]) return MESSAGES[errorCode];
  if (errorCode) {
    for (const [fragment, message] of PREFIX_MESSAGES) {
      if (errorCode.includes(fragment)) return message;
    }
  }
  return fallback ?? "Não foi possível concluir a operação.";
}
