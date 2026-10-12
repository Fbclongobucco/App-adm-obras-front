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
  email: string;
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
  email: string;
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
};

export type Restaurant = RestaurantSummary & { project: ProjectSummary };

export const MEAL_TYPES = { LUNCH: "Almoço", DINNER: "Jantar" } as const;
export type MealType = keyof typeof MEAL_TYPES;

export type MealSummary = Audit & {
  id: string;
  restaurant: RestaurantSummary;
  price: number;
  isBilled: boolean;
  mealType: MealType;
  quantity: number;
  date: string;
  totalPrice: number;
};

export type Meal = MealSummary & { project: ProjectSummary };

export type AccommodationSummary = Audit & {
  id: string;
  hostName: string;
  hostPhone: string;
  address: Address;
  capacity: number;
  days: number;
  isContract: boolean;
  totalPrice: number;
};

export type Accommodation = AccommodationSummary & {
  project: ProjectSummary | null;
  employees: EmployeeSummary[];
};

export type Project = ProjectSummary & {
  accommodations: AccommodationSummary[];
  employees: EmployeeSummary[];
  lunch: MealSummary | null;
  dinner: MealSummary | null;
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
