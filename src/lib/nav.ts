export type NavItem = { href: string; label: string; icon: string };
export type NavSection = { title?: string; items: NavItem[] };

// Ordem segue as dependencias: cadastros base antes da obra, e a obra antes do que depende dela.
export const NAV: NavSection[] = [
  { items: [{ href: "/", label: "Dashboard", icon: "M3 12l9-8 9 8M5 10v10h14V10" }] },
  {
    title: "Cadastros",
    items: [
      { href: "/centros-de-custo", label: "Centros de custo", icon: "M4 6h16M4 12h16M4 18h10" },
      { href: "/clientes", label: "Clientes", icon: "M4 20V8l8-4 8 4v12M9 20v-6h6v6" },
      { href: "/colaboradores", label: "Colaboradores", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0" },
    ],
  },
  {
    title: "Obras",
    items: [
      { href: "/obras", label: "Obras", icon: "M3 20h18M5 20V10l7-5 7 5v10M9 20v-5h6v5" },
      { href: "/restaurantes", label: "Restaurantes", icon: "M7 3v8a2 2 0 002 2v8M11 3v8M15 3c0 6 4 6 4 10h-4v8" },
      { href: "/refeicoes", label: "Refeições", icon: "M4 11h16a8 8 0 01-16 0zM12 3v4" },
      { href: "/hospedagens", label: "Hospedagens", icon: "M3 19V7M3 13h18v6M7 13V9h6a3 3 0 013 3v1" },
    ],
  },
  {
    title: "Administração",
    items: [{ href: "/usuarios", label: "Usuários", icon: "M16 11a3 3 0 100-6 3 3 0 000 6zM8 13a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M14 20a6 6 0 018 0" }],
  },
];
