// Dados ficticios de desenvolvimento, cadastrados pela API como o front faz.
// Uso: npm run seed   (le API_URL do .env.local; SEED_EMAIL/SEED_PASSWORD com perfil ADMIN)
// Nao roda se ja houver obra cadastrada, a menos que receba --force.

const API_URL = process.env.API_URL ?? "http://localhost:8080";
const EMAIL = process.env.SEED_EMAIL ?? "admin@admin.com";
const PASSWORD = process.env.SEED_PASSWORD ?? "admin123";
const FORCE = process.argv.includes("--force");

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
    throw new Error(`${method} ${path} -> HTTP ${res.status} (${detail})\n  corpo: ${JSON.stringify(body)}`);
  }
  return data;
}

const post = (path, body) => call("POST", path, body);
const put = (path, body) => call("PUT", path, body);

// CPF e CNPJ com digito verificador valido, gerados a partir de um numero (mesma entrada, mesmo valor).
function checkDigits(base, weights) {
  const sum = base.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function cpf(n) {
  const base = String(100000000 + n * 7919).slice(-9).split("").map(Number);
  const d1 = checkDigits(base, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = checkDigits([...base, d1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [...base, d1, d2].join("");
}

function cnpj(n) {
  const base = (String(10000000 + n * 104729).slice(-8) + "0001").split("").map(Number);
  const d1 = checkDigits(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = checkDigits([...base, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [...base, d1, d2].join("");
}

function address(street, number, neighborhood, city, state, zipCode) {
  return { street, number, neighborhood, city, state, zipCode, country: "Brasil" };
}

/** Data "aaaa-mm-dd" a n dias de hoje (negativo = passado). */
function day(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

/** Proxima data (aaaa-mm-dd) a partir de `from`, ate `to`, cujo dia da semana atende `match` (0 = domingo). */
function nextDate(from, to, match) {
  const date = new Date(`${from}T12:00:00Z`);
  const limit = new Date(`${to}T12:00:00Z`);
  while (date <= limit) {
    if (match(date.getUTCDay())) return date.toISOString().slice(0, 10);
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return null;
}

/**
 * Ajustes de exemplo: sabado com 6 almocos, um dia util sem fornecimento e o dia util seguinte alterado
 * (uma janta a menos e duas entregas no almoco).
 */
async function seedAdjustments(mealId, mealType, start, end) {
  const saturday = nextDate(start, end, (weekday) => weekday === 6);
  const weekday = nextDate(start, end, (weekday) => weekday >= 1 && weekday <= 5);
  if (saturday) {
    await post(`/api/meals/${mealId}/adjustments`, {
      date: saturday, type: "EXTRA_DAY", note: "Sábado trabalhado",
      // So as refeicoes servidas pelo tipo recebem quantidade
      lunchQuantity: mealType === "DINNER" ? null : 6,
      dinnerQuantity: mealType === "DINNER" ? 4 : mealType === "LUNCH_AND_DINNER" ? 0 : null,
    });
  }
  if (weekday) {
    await post(`/api/meals/${mealId}/adjustments`, {
      date: weekday, type: "NO_SERVICE", lunchQuantity: null, dinnerQuantity: null, note: "Feriado",
    });
    const after = new Date(`${weekday}T12:00:00Z`);
    after.setUTCDate(after.getUTCDate() + 1);
    const changed = nextDate(after.toISOString().slice(0, 10), end, (day) => day >= 1 && day <= 5);
    if (changed) {
      const lunch = mealType !== "DINNER";
      const dinner = mealType !== "LUNCH";
      await put(`/api/meals/${mealId}/adjustments/${changed}`, {
        type: "CHANGED", note: "Uma equipe a menos no jantar",
        lunchQuantity: lunch ? 8 : null, dinnerQuantity: dinner ? 5 : null,
        lunchDeliveries: lunch ? 2 : null, dinnerDeliveries: null, sodas: null,
      });
    }
  }
}

const COST_CENTERS = ["Centro Industrial Norte", "Centro de Manutenção Sul", "Centro de Montagem Leste"];

const CLIENTS = [
  { name: "Agroindustrial Campo Novo", email: "compras@camponovo.example", phone: "1932145000",
    address: address("Rodovia SP-101", "4500", "Distrito Industrial", "Campinas", "SP", "13054700") },
  { name: "Têxtil Serra Clara", email: "engenharia@serraclara.example", phone: "1135209000",
    address: address("Avenida das Nações", "1200", "Jardim Industrial", "Sorocaba", "SP", "18087000") },
  // Sem e-mail: o campo e opcional para clientes
  { name: "Fundição Vale Azul", email: null, phone: "3133418800",
    address: address("Rua dos Metalúrgicos", "85", "Cidade Industrial", "Contagem", "MG", "32210000") },
];

const EMPLOYEES = [
  ["Rafael Moreira Dutra", "ENCARREGADO"],
  ["Lucas Ferraz Pimentel", "MONTADOR"],
  ["Bruno Teixeira Lacerda", "MONTADOR"],
  ["Diego Arantes Coelho", "ALPINISTA"],
  ["Marcos Vieira Bastos", "TEC_SEGURANCA"],
  ["Tiago Mendes Salvador", "SUPERVISOR"],
  ["André Fontes Queiroz", "MONTADOR"],
  ["Felipe Rocha Antunes", "ALPINISTA"],
  ["Gustavo Lima Prado", "MONTADOR"],
  ["Henrique Souza Barreto", "ENCARREGADO"],
];

const PROJECTS = [
  "Retrofit de cobertura do galpão 1",
  "Reforço estrutural das tesouras do galpão 2",
  "Substituição de calhas e rufos do bloco administrativo",
  "Fabricação e montagem de passarela metálica",
  "Remoção de amianto e nova cobertura termoacústica",
  "Manutenção preventiva de lanternim",
  "Manutenção corretiva de domus e telhas translúcidas",
  "Fabricação e montagem de mezanino metálico",
  "Instalação de linha de vida na cobertura",
  "Retrofit de cobertura da área de caldeiras",
  "Alpinismo industrial para inspeção de fachada",
  "Fabricação e montagem de estrutura para pipe rack",
];

// Indice da obra -> restaurante (6 primeiras obras, com almoco e jantar).
const RESTAURANTS = [
  ["Cantina Boa Mesa", "1932205000"],
  ["Restaurante Sabor da Serra", "1532418000"],
  ["Marmitaria do Trecho", "3133524000"],
  ["Restaurante Panela de Ferro", "1932336000"],
  ["Cozinha Industrial Bom Prato", "1532127000"],
  ["Restaurante Fogão a Lenha", "3133019000"],
];

// [anfitriao, telefone, capacidade, entrada (dias a partir de hoje), valor por mes, renovacoes]
// Entradas escalonadas para a barra da locacao: em andamento, laranja (ate 14 dias), vermelha (menos de 7),
// vencida e uma renovada por mais um mes.
const ACCOMMODATIONS = [
  ["Pousada Recanto do Vale", "1998123400", 4, -5, "2400.00", 0],
  ["Hotel Estrada Real", "1597456700", 4, -20, "3000.00", 0],
  ["Pousada Serra Clara", "1599871200", 4, -27, "3600.00", 0],
  ["Hotel Campo Novo", "1998564300", 4, -40, "4200.00", 0],
  ["Pousada Bela Vista", "1998771100", 2, -45, "2800.00", 1],
];

async function main() {
  console.log(`API: ${API_URL}`);
  ({ accessToken: token } = await post("/api/auth/login", { email: EMAIL, password: PASSWORD }));

  const existing = await call("GET", "/api/projects?size=1");
  if (existing.totalElements > 0 && !FORCE) {
    console.log(`Já existem ${existing.totalElements} obra(s). Seed não executado (use --force para rodar mesmo assim).`);
    return;
  }

  const costCenters = [];
  for (const [i, name] of COST_CENTERS.entries()) {
    costCenters.push(await post("/api/cost-centers", { name, cnpj: cnpj(i + 1) }));
  }

  const clients = [];
  for (const client of CLIENTS) clients.push(await post("/api/clients", client));

  const employees = [];
  for (const [i, [name, role]] of EMPLOYEES.entries()) {
    const login = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().split(" ");
    employees.push(await post("/api/employees", {
      name,
      // O ultimo colaborador fica sem e-mail, que e opcional
      email: i === EMPLOYEES.length - 1 ? null : `${login[0]}.${login.at(-1)}@equipe.example`,
      cpf: cpf(i + 1),
      phone: `1999${String(1000000 + i * 1371).slice(-7)}`,
      address: null,
      birthDate: `${1975 + i * 2}-0${(i % 9) + 1}-15`,
      costCenterId: costCenters[i % costCenters.length].id,
      role,
    }));
  }

  // Criadas da mais antiga para a mais recente: a ultima criada aparece primeiro no dashboard.
  const projects = [];
  for (const [i, description] of PROJECTS.entries()) {
    const done = i < 2;
    projects.push(await post("/api/projects", {
      os: `OS-2026-${String(i + 1).padStart(3, "0")}`,
      description,
      costCenterId: costCenters[i % costCenters.length].id,
      clientId: clients[i % clients.length].id,
      startDate: day(-120 + i * 10),
      // Em andamento: termino previsto em parte das obras, para o total estimado das refeicoes
      endDate: done ? day(-30 + i * 5) : i % 3 === 0 ? null : day(30 + i * 5),
      isCompleted: done,
      employeeIds: [employees[i % employees.length].id, employees[(i + 3) % employees.length].id],
      accommodationIds: [],
    }));
  }

  const recent = projects.slice(-6);
  let meals = 0;
  let adjusted = false;
  for (const [i, [name, phone]] of RESTAURANTS.entries()) {
    const project = recent[i];
    const city = CLIENTS[PROJECTS.indexOf(project.description) % CLIENTS.length].address;
    const restaurant = await post("/api/restaurants", {
      name,
      phone,
      address: { ...city, street: "Rua do Comércio", number: String(100 + i * 25), zipCode: city.zipCode },
      projectId: project.id,
      // Metade dos restaurantes cobra entrega (o primeiro com taxa diferente no jantar); refrigerante
      // (1 por entrega) em parte deles
      lunchDeliveryFee: i % 2 === 0 ? "8.00" : null,
      dinnerDeliveryFee: i === 0 ? "10.00" : i % 2 === 0 ? "8.00" : null,
      sodaPrice: i % 3 === 0 ? null : "5.00",
    });
    // Alterna um restaurante com almoco e jantar e um com refeicoes cadastradas separadamente
    const lunch = { lunchQuantity: 8, lunchPrice: "32.50" };
    const dinner = { dinnerQuantity: 6, dinnerPrice: "28.00" };
    const servings = i % 2 === 0
      ? [{ mealType: "LUNCH_AND_DINNER", ...lunch, ...dinner }]
      : [{ mealType: "LUNCH", ...lunch }, { mealType: "DINNER", ...dinner }];
    for (const serving of servings) {
      const meal = await post("/api/meals", { restaurantId: restaurant.id, isBilled: serving.mealType !== "DINNER", ...serving });
      meals++;
      // Primeira refeicao com obra com termino: um sabado trabalhado e um dia util sem fornecimento
      if (!adjusted && project.endDate) {
        await seedAdjustments(meal.id, serving.mealType, project.startDate, project.endDate);
        adjusted = true;
      }
    }
  }

  for (const [i, [hostName, hostPhone, capacity, entry, monthlyPrice, renewals]] of ACCOMMODATIONS.entries()) {
    const project = recent[i];
    const city = CLIENTS[PROJECTS.indexOf(project.description) % CLIENTS.length].address;
    const accommodation = await post("/api/accommodations", {
      hostName,
      hostPhone,
      address: { ...city, street: "Avenida Central", number: String(300 + i * 40) },
      capacity,
      isContract: i % 2 === 0,
      startDate: day(entry),
      monthlyPrice,
      projectId: project.id,
      employeeIds: [employees[i * 2].id, employees[i * 2 + 1].id],
    });
    // Renovacao pela sugestao da API: mais um mes pelo valor mensal
    for (let r = 0; r < renewals; r++) await post(`/api/accommodations/${accommodation.id}/renewals`, {});
  }

  console.log(
    `Seed concluído: ${costCenters.length} centros de custo, ${clients.length} clientes, ` +
      `${employees.length} colaboradores, ${projects.length} obras, ${RESTAURANTS.length} restaurantes, ` +
      `${meals} refeições, ${ACCOMMODATIONS.length} hospedagens.`,
  );
}

main().catch((error) => {
  console.error(`Seed interrompido: ${error.message}`);
  process.exit(1);
});
