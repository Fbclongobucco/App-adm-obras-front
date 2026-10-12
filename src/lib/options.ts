import "server-only";
import type { Option } from "@/components/form/fields";
import { listAll } from "@/lib/api";
import type { CostCenter, EmployeeSummary, ProjectSummary, RestaurantSummary } from "@/lib/types";

// Opcoes dos campos de selecao, carregadas no servidor.

export async function costCenterOptions(): Promise<Option[]> {
  const items = await listAll<CostCenter>("/api/cost-centers");
  return items.map((c) => ({ value: c.id, label: c.name }));
}

export async function clientOptions(): Promise<Option[]> {
  const items = await listAll<{ id: string; name: string }>("/api/clients");
  return items.map((c) => ({ value: c.id, label: c.name }));
}

export function projectLabel(p: ProjectSummary): string {
  return p.description ? `${p.os} · ${p.client.name} · ${p.description}` : `${p.os} · ${p.client.name}`;
}

export async function projectOptions(): Promise<Option[]> {
  const items = await listAll<ProjectSummary>("/api/projects");
  return items.map((p) => ({ value: p.id, label: projectLabel(p) }));
}

export async function employeeOptions(): Promise<Option[]> {
  const items = await listAll<EmployeeSummary>("/api/employees");
  return items.map((e) => ({ value: e.id, label: `${e.name} · ${e.costCenter.name}` }));
}

/** Restaurantes com a obra no rotulo; a refeicao herda a obra do restaurante. */
export async function restaurantOptions(): Promise<Option[]> {
  const items = await listAll<RestaurantSummary & { project: ProjectSummary }>("/api/restaurants");
  return items.map((r) => ({ value: r.id, label: `${r.name} · OS ${r.project.os} · ${r.project.client.name}` }));
}
