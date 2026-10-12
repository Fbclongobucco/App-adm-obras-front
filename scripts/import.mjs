// Importa dados reais de uma planilha (abas Centros de custo, Clientes, Obras, Colaboradores) pela API.
// Uso: npm run import [-- caminho.xlsx]   (padrao: dados-reais/importacao.xlsx; le API_URL do .env.local)
// Valida a planilha inteira antes de cadastrar; com erro, nada e enviado.
// Reexecutar e seguro: centro de custo e cliente sao reaproveitados pelo nome, colaborador pelo CPF e obra pela OS.
// Carga em outro ambiente (ex.: backend com Postgres): API_URL=https://... SEED_EMAIL=... SEED_PASSWORD=... npm run import
// (variaveis ja definidas no shell prevalecem sobre o .env.local).
// A planilha tem dados pessoais (LGPD): fica em dados-reais/, fora do git.

import ExcelJS from "exceljs";

const API_URL = process.env.API_URL ?? "http://localhost:8080";
const EMAIL = process.env.SEED_EMAIL ?? "admin@admin.com";
const PASSWORD = process.env.SEED_PASSWORD ?? "admin123";
const FILE = process.argv[2] ?? "dados-reais/importacao.xlsx";
const PAGE_SIZE = 100;

const ROLES = {
  Montador: "MONTADOR",
  Encarregado: "ENCARREGADO",
  Supervisor: "SUPERVISOR",
  "Técnico de segurança": "TEC_SEGURANCA",
  "Alpinista industrial": "ALPINISTA",
};

let token;

async function call(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data?.errorCode ?? data?.message ?? JSON.stringify(data);
    throw new Error(`${method} ${path} -> HTTP ${res.status} (${detail})`);
  }
  return data;
}

async function listAll(path) {
  const items = [];
  for (let page = 0; ; page++) {
    const result = await call("GET", `${path}?page=${page}&size=${PAGE_SIZE}`);
    items.push(...result.content);
    if (result.last || result.content.length === 0) return items;
  }
}

// Leitura das celulas

/** Texto da celula, sem espacos nas pontas; null se vazia. Aceita rich text, hyperlink e formula. */
function text(cell) {
  let value = cell.value;
  if (value && typeof value === "object" && !(value instanceof Date)) {
    value = value.result ?? value.text ?? value.richText?.map((part) => part.text).join("") ?? null;
  }
  if (value === null || value === undefined) return null;
  const result = String(value).trim();
  return result === "" ? null : result;
}

const digits = (value) => (value ? value.replace(/\D/g, "") : null);
const key = (value) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

/** Data "aaaa-mm-dd" a partir de data do Excel ou de texto dd/mm/aaaa; undefined se invalida. */
function isoDate(cell) {
  const value = cell.value;
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const match = String(value).trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  return new Date(`${iso}T12:00:00Z`).toISOString().slice(0, 10) === iso ? iso : undefined;
}

function checkDigit(numbers, weights) {
  const rest = numbers.reduce((acc, digit, i) => acc + digit * weights[i], 0) % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function validCpf(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;
  const n = cpf.split("").map(Number);
  return checkDigit(n.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]) === n[9]
    && checkDigit(n.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) === n[10];
}

function validCnpj(cnpj) {
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1+$/.test(cnpj)) return false;
  const n = cnpj.split("").map(Number);
  return checkDigit(n.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === n[12]
    && checkDigit(n.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === n[13];
}

/** Linhas preenchidas de uma aba, como { linha, celula(coluna) }; ignora linhas sem a primeira coluna. */
function rows(workbook, name) {
  const sheet = workbook.getWorksheet(name);
  if (!sheet) throw new Error(`Aba "${name}" não encontrada em ${FILE}.`);
  const result = [];
  sheet.eachRow((row, number) => {
    if (number > 1 && text(row.getCell(1))) result.push({ line: number, cell: (col) => row.getCell(col) });
  });
  return result;
}

function parse(workbook) {
  const errors = [];
  const fail = (sheet, line, message) => errors.push(`${sheet}, linha ${line}: ${message}`);
  const required = (sheet, line, label, value) => {
    if (!value) fail(sheet, line, `${label} obrigatório.`);
    return value;
  };

  const costCenters = rows(workbook, "Centros de custo").map(({ line, cell }) => {
    const cnpj = digits(text(cell(2)));
    if (!cnpj) fail("Centros de custo", line, "CNPJ obrigatório.");
    else if (!validCnpj(cnpj)) fail("Centros de custo", line, "CNPJ inválido.");
    return { name: text(cell(1)), cnpj };
  });

  const clients = rows(workbook, "Clientes").map(({ line, cell }) => {
    const s = "Clientes";
    const phone = required(s, line, "Telefone", digits(text(cell(3))));
    const address = {
      street: required(s, line, "Rua", text(cell(4))),
      number: required(s, line, "Número", text(cell(5))),
      neighborhood: required(s, line, "Bairro", text(cell(6))),
      city: required(s, line, "Cidade", text(cell(7))),
      state: required(s, line, "UF", text(cell(8))?.toUpperCase()),
      zipCode: required(s, line, "CEP", digits(text(cell(9)))),
      country: "Brasil",
    };
    if (address.state && !/^[A-Z]{2}$/.test(address.state)) fail(s, line, "UF deve ter 2 letras.");
    if (address.zipCode && address.zipCode.length !== 8) fail(s, line, "CEP deve ter 8 dígitos.");
    return { name: text(cell(1)), email: text(cell(2)), phone, address };
  });

  const costCenterNames = new Set(costCenters.map((c) => key(c.name)));
  const clientNames = new Set(clients.map((c) => key(c.name)));
  const reference = (sheet, line, label, value, known) => {
    if (value && !known.has(key(value))) fail(sheet, line, `${label} "${value}" não está na aba ${label === "Cliente" ? "Clientes" : "Centros de custo"}.`);
  };

  const projects = rows(workbook, "Obras").map(({ line, cell }) => {
    const s = "Obras";
    const client = required(s, line, "Cliente", text(cell(3)));
    const costCenter = required(s, line, "Centro de custo", text(cell(4)));
    reference(s, line, "Cliente", client, clientNames);
    reference(s, line, "Centro de custo", costCenter, costCenterNames);
    const startDate = isoDate(cell(5));
    const endDate = isoDate(cell(6));
    if (startDate === undefined || endDate === undefined) fail(s, line, "Data inválida (use dd/mm/aaaa).");
    if (startDate === null) fail(s, line, "Início obrigatório.");
    if (startDate && endDate && endDate < startDate) fail(s, line, "Término anterior ao início.");
    const completed = text(cell(7));
    if (!completed) fail(s, line, "Concluída obrigatório (Sim ou Não).");
    else if (!["sim", "nao"].includes(key(completed))) fail(s, line, `Concluída deve ser Sim ou Não, não "${completed}".`);
    return {
      os: text(cell(1)), description: text(cell(2)), client, costCenter, startDate, endDate,
      isCompleted: completed ? key(completed) === "sim" : false,
    };
  });

  const projectOs = new Set(projects.map((p) => p.os));
  const cpfs = new Map();
  const employees = rows(workbook, "Colaboradores").map(({ line, cell }) => {
    const s = "Colaboradores";
    const roleLabel = required(s, line, "Função", text(cell(2)));
    if (roleLabel && !ROLES[roleLabel]) fail(s, line, `Função "${roleLabel}" inválida. Use: ${Object.keys(ROLES).join(", ")}.`);
    const cpf = required(s, line, "CPF", digits(text(cell(3))));
    if (cpf && !validCpf(cpf)) fail(s, line, "CPF inválido.");
    if (cpf && cpfs.has(cpf)) fail(s, line, `CPF repetido (também na linha ${cpfs.get(cpf)}).`);
    if (cpf) cpfs.set(cpf, line);
    const birthDate = isoDate(cell(4));
    if (birthDate === undefined) fail(s, line, "Nascimento inválido (use dd/mm/aaaa).");
    if (birthDate === null) fail(s, line, "Nascimento obrigatório.");
    const costCenter = required(s, line, "Centro de custo", text(cell(7)));
    reference(s, line, "Centro de custo", costCenter, costCenterNames);
    const projectList = (text(cell(8)) ?? "").split(";").map((os) => os.trim()).filter(Boolean);
    for (const os of projectList) if (!projectOs.has(os)) fail(s, line, `Obra "${os}" não está na aba Obras.`);
    return {
      name: text(cell(1)), role: ROLES[roleLabel], cpf, birthDate,
      phone: required(s, line, "Telefone", digits(text(cell(5)))), email: text(cell(6)), costCenter, projects: projectList,
    };
  });

  return { errors, costCenters, clients, projects, employees };
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(FILE);
  const data = parse(workbook);
  if (data.errors.length > 0) {
    console.error(`Planilha com ${data.errors.length} pendência(s). Nada foi cadastrado.\n`);
    for (const error of data.errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`API: ${API_URL}`);
  ({ accessToken: token } = await call("POST", "/api/auth/login", { email: EMAIL, password: PASSWORD }));
  const count = { created: 0, reused: 0 };

  /** Cadastra o item se nao existir pela chave; devolve um mapa chave -> id. */
  async function upsert(path, items, existingKey, itemKey, body) {
    const ids = new Map((await listAll(path)).map((item) => [existingKey(item), item.id]));
    for (const item of items) {
      const k = itemKey(item);
      if (ids.has(k)) {
        count.reused++;
        continue;
      }
      ids.set(k, (await call("POST", path, body(item))).id);
      count.created++;
    }
    return ids;
  }

  const costCenters = await upsert("/api/cost-centers", data.costCenters, (c) => key(c.name), (c) => key(c.name),
    (c) => ({ name: c.name, cnpj: c.cnpj }));
  const clients = await upsert("/api/clients", data.clients, (c) => key(c.name), (c) => key(c.name), (c) => c);
  const employees = await upsert("/api/employees", data.employees, (e) => e.cpf, (e) => e.cpf, (e) => ({
    name: e.name, email: e.email, cpf: e.cpf, phone: e.phone, address: null, birthDate: e.birthDate,
    costCenterId: costCenters.get(key(e.costCenter)), role: e.role,
  }));
  await upsert("/api/projects", data.projects, (p) => p.os, (p) => p.os, (p) => ({
    os: p.os, description: p.description, costCenterId: costCenters.get(key(p.costCenter)),
    clientId: clients.get(key(p.client)), startDate: p.startDate, endDate: p.endDate, isCompleted: p.isCompleted,
    employeeIds: data.employees.filter((e) => e.projects.includes(p.os)).map((e) => employees.get(e.cpf)),
    accommodationIds: [],
  }));

  console.log(
    `Importação concluída: ${data.costCenters.length} centros de custo, ${data.clients.length} clientes, ` +
      `${data.employees.length} colaboradores, ${data.projects.length} obras ` +
      `(${count.created} cadastrados, ${count.reused} já existiam).`,
  );
}

main().catch((error) => {
  console.error(`Importação interrompida: ${error.message}`);
  process.exit(1);
});
