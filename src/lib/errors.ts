// Mensagens em pt-BR para os errorCode da API. Codigo sem traducao cai na mensagem generica.
const MESSAGES: Record<string, string> = {
  "project.duplicate.os": "Já existe uma obra com esta OS.",
  "client.duplicate.email": "Já existe um cliente com este e-mail.",
  "employee.duplicate.email": "Já existe um colaborador com este e-mail.",
  "employee.duplicate.cpf": "Já existe um colaborador com este CPF.",
  "user.duplicate.email": "Já existe um usuário com este e-mail.",
  "meal.duplicate.type": "Esta obra já tem uma refeição deste tipo (almoço ou jantar).",
  "cost_center.in_use": "Centro de custo vinculado a colaboradores ou obras. Remova os vínculos antes de excluir.",
  "client.in_use": "Cliente vinculado a obras. Remova as obras antes de excluir.",
  "project.in_use": "Obra com restaurantes, refeições ou hospedagens. Remova esses registros antes de excluir.",
  "employee.in_use": "Colaborador vinculado a obras ou hospedagens. Remova os vínculos antes de excluir.",
  "restaurant.in_use": "Restaurante com refeições: não pode ser excluído nem mudar de obra.",
  "data.integrity_violation": "A operação conflita com dados existentes.",
  "project.invalid.meal": "A refeição informada não pertence a esta obra.",
  "restaurant.invalid.project": "Selecione a obra do restaurante.",
  "restaurant.invalid.name": "Nome do restaurante deve ter de 2 a 100 caracteres.",
  "restaurant.invalid.phone": "Telefone deve ter 10 ou 11 dígitos.",
  "meal.invalid.restaurant": "Selecione o restaurante.",
  "meal.invalid.price": "Preço deve ser maior que zero.",
  "meal.invalid.quantity": "Quantidade deve estar entre 1 e 10.000.",
  "meal.invalid.date.future": "A data da refeição não pode ser futura.",
  "meal.invalid.type": "Selecione o tipo de refeição.",
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
