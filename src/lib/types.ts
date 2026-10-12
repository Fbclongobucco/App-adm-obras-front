// Contrato da API (App-adm-obras). Datas LocalDate como "aaaa-mm-dd"; instantes em ISO-8601 UTC.

export type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type Audit = { createdAt: string; updatedAt: string };

export type Address = {
  id?: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  neighborhood: string;
  zipCode: string;
};

/** Endereco enviado nas requisicoes; campos nulos sao rejeitados pela API com o codigo do campo. */
export type AddressInput = { [K in keyof Omit<Address, "id">]: string | null };

export type CostCenter = Audit & { id: string; name: string; cnpj: string };

export type ClientSummary = Audit & {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: Address;
};

export type ProjectSummary = Audit & {
  id: string;
  os: string;
  description: string | null;
  costCenter: CostCenter;
  startDate: string;
  endDate: string | null;
  client: ClientSummary;
  totalPrice: number;
  isCompleted: boolean;
};

export type Client = ClientSummary & { projects: ProjectSummary[] };

export const EMPLOYEE_ROLES = {
  MONTADOR: "Montador",
  ENCARREGADO: "Encarregado",
  SUPERVISOR: "Supervisor",
  TEC_SEGURANCA: "Técnico de segurança",
  ALPINISTA: "Alpinista industrial",
} as const;
export type EmployeeRole = keyof typeof EMPLOYEE_ROLES;

export type EmployeeSummary = Audit & {
  id: string;
  name: string;
  email: string | null;
  cpf: string;
  phone: string | null;
  address: Address | null;
  birthDate: string;
  costCenter: CostCenter;
  role: EmployeeRole;
};

export type Employee = EmployeeSummary & { projects: ProjectSummary[] };

export type RestaurantSummary = Audit & {
  id: string;
  name: string;
  phone: string | null;
  address: Address | null;
  /** Taxa por entrega; null quando o restaurante nao cobra. */
  deliveryFee: number | null;
  /** Preco do refrigerante, 1 por entrega em todas as refeicoes; null quando nao fornece. */
  sodaPrice: number | null;
};

export type Restaurant = RestaurantSummary & { project: ProjectSummary; meals: MealSummary[] };

export const MEAL_TYPES = { LUNCH: "Almoço", DINNER: "Jantar", LUNCH_AND_DINNER: "Almoço e jantar" } as const;
export type MealType = keyof typeof MEAL_TYPES;

/** Refeicoes servidas por tipo: define quais pares quantidade/preco sao exigidos. */
export const MEAL_SERVES: Record<MealType, { lunch: boolean; dinner: boolean }> = {
  LUNCH: { lunch: true, dinner: false },
  DINNER: { lunch: false, dinner: true },
  LUNCH_AND_DINNER: { lunch: true, dinner: true },
};

/**
 * Alimentacao contratada da obra, sem data. Quantidade e preco sao por dia e ficam null
 * para a refeicao nao servida. workingDays e totalPrice ficam null se a obra nao tem termino.
 */
export type MealSummary = Audit & {
  id: string;
  restaurant: RestaurantSummary;
  mealType: MealType;
  isBilled: boolean;
  lunchQuantity: number | null;
  lunchPrice: number | null;
  dinnerQuantity: number | null;
  dinnerPrice: number | null;
  /** Preco do refrigerante do restaurante (somente leitura), 1 por entrega; null quando nao fornece. */
  sodaPrice: number | null;
  deliveriesPerDay: number;
  mealsDailyPrice: number;
  deliveryDailyPrice: number;
  sodaDailyPrice: number;
  /** Marmitas + entrega + refrigerante. */
  dailyPrice: number;
  workingDays: number | null;
  /** Dias uteis menos os dias sem fornecimento; null sem termino. */
  serviceDays: number | null;
  noServiceDays: number;
  extraDays: number;
  extraDaysPrice: number;
  /** Custo por dia x dias de fornecimento + dias extras. */
  totalPrice: number | null;
  projections: MealProjection[];
};

export const ADJUSTMENT_TYPES = { EXTRA_DAY: "Dia extra", NO_SERVICE: "Sem fornecimento" } as const;
export type AdjustmentType = keyof typeof ADJUSTMENT_TYPES;

/** Excecao de fornecimento numa data: dia extra (fim de semana) ou sem fornecimento (dia util). */
export type MealAdjustment = {
  id: string;
  date: string;
  weekday: string;
  type: AdjustmentType;
  lunchQuantity: number | null;
  dinnerQuantity: number | null;
  note: string | null;
  deliveries: number;
  sodas: number;
  price: number;
  /** Falso quando a data ficou fora do periodo atual da obra (nao entra no total). */
  inPeriod: boolean;
};

export const WEEKDAYS: Record<string, string> = {
  MONDAY: "Segunda", TUESDAY: "Terça", WEDNESDAY: "Quarta", THURSDAY: "Quinta",
  FRIDAY: "Sexta", SATURDAY: "Sábado", SUNDAY: "Domingo",
};

export const DAY_STATUS = {
  SERVICE: "Fornecimento",
  NO_SERVICE: "Sem fornecimento",
  EXTRA_DAY: "Dia extra",
  OFF: "Sem expediente",
  OUT_OF_PERIOD: "Fora do período",
} as const;
export type DayStatus = keyof typeof DAY_STATUS;

/** Semana de fechamento (segunda a domingo); start e end cortados no periodo da obra. */
export type ClosingWeek = { start: string; end: string; partial: boolean; current: boolean };

export type DayClosing = {
  date: string;
  weekday: string;
  status: DayStatus;
  /** No restaurante: parte das refeicoes sem fornecimento num dia em que outra fornece. */
  partialNoService: boolean;
  lunchMeals: number;
  dinnerMeals: number;
  deliveries: number;
  sodas: number;
  price: number;
  adjustmentIds: string[];
};

/** Fechamento semanal calculado pela API; selected e o inicio da semana exibida (null se a obra nao tem semanas). */
export type WeeklyClosing = {
  weeks: ClosingWeek[];
  selected: string | null;
  days: DayClosing[];
  totals: { serviceDays: number; lunchMeals: number; dinnerMeals: number; deliveries: number; sodas: number; price: number };
};

export const BILLING_PERIODS = {
  DAY: "Dia",
  WEEK: "Semana",
  FORTNIGHT: "15 dias",
  MONTH: "Mês",
} as const;
export type BillingPeriod = keyof typeof BILLING_PERIODS;

/** Projecao fixa por periodo de fechamento: valores diarios x dias uteis do periodo. */
export type MealProjection = {
  period: BillingPeriod;
  workingDays: number;
  lunchMeals: number;
  dinnerMeals: number;
  deliveries: number;
  sodas: number;
  price: number;
};

export type Meal = MealSummary & { project: ProjectSummary; adjustments: MealAdjustment[] };

export type AccommodationSummary = Audit & {
  id: string;
  hostName: string;
  hostPhone: string;
  address: Address;
  capacity: number;
  isContract: boolean;
  /** Data de entrada: inicio do primeiro periodo. */
  startDate: string;
  /** Valor do mes de locacao; sugestao das renovacoes. */
  monthlyPrice: number;
  /** Fim do ultimo periodo. */
  endDate: string;
  /** Soma dos periodos. */
  totalPrice: number;
  periods: AccommodationPeriod[];
};

/** Periodo de locacao: o primeiro comeca na entrada; cada renovacao, no dia seguinte ao fim do anterior. */
export type AccommodationPeriod = { id: string | null; startDate: string; endDate: string; days: number; price: number };

export type Accommodation = AccommodationSummary & {
  project: ProjectSummary | null;
  employees: EmployeeSummary[];
  /** Sugestao da proxima renovacao (+1 mes, valor mensal). */
  nextRenewal: AccommodationPeriod;
};

export type Project = ProjectSummary & {
  accommodations: AccommodationSummary[];
  employees: EmployeeSummary[];
  meals: MealSummary[];
  restaurants: RestaurantSummary[];
};

export const USER_ROLES = { ADMIN: "Administrador", OPERADOR: "Operador" } as const;
export type UserRole = keyof typeof USER_ROLES;

export type User = Audit & {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: UserRole[];
};
