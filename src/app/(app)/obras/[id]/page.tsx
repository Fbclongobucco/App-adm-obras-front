import Link from "next/link";
import type { ReactNode } from "react";
import { DataTable } from "@/components/data-table";
import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { ClientLine } from "@/components/project-ref";
import { StatusBadge } from "@/components/status-badge";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { formatCurrency, formatDate, formatPhone } from "@/lib/format";
import { clientOptions, costCenterOptions, employeeOptions } from "@/lib/options";
import { MEAL_TYPES, type MealSummary, type Project } from "@/lib/types";
import { deleteProject, saveProject } from "../actions";
import { ProjectForm } from "../form";

function Related({ title, add, children }: { title: string; add?: { href: string; label: string }; children: ReactNode }) {
  return (
    <section className="mt-10 max-w-5xl">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-heading text-lg font-semibold text-title">{title}</h2>
        {add && (
          <Link href={add.href} className="text-sm font-medium text-highlight hover:underline">
            {add.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/obras/[id]">) {
  const { id } = await params;
  const [project, admin, clients, costCenters, employees] = await Promise.all([
    apiOrNotFound<Project>(`/api/projects/${id}`),
    isAdmin(),
    clientOptions(),
    costCenterOptions(),
    employeeOptions(),
  ]);
  const meals = [project.lunch, project.dinner].filter((meal): meal is MealSummary => meal != null);

  return (
    <>
      <PageHeader
        title={project.os}
        description={
          <>
            {project.description && <p>{project.description}</p>}
            <p className="mt-1"><ClientLine project={project} /></p>
          </>
        }
      >
        <StatusBadge done={project.isCompleted} doneLabel="Concluída" openLabel="Em andamento" />
        <span className="font-mono text-sm text-title">{formatCurrency(project.totalPrice)}</span>
        {admin && <DeleteButton action={deleteProject.bind(null, id)} label="esta obra" />}
      </PageHeader>

      <ProjectForm action={saveProject.bind(null, id)} clients={clients} costCenters={costCenters}
        employees={employees} value={project} readOnly={!admin} />

      <Related title="Restaurantes"
        add={admin ? { href: `/restaurantes/novo?obra=${id}`, label: "Novo restaurante" } : undefined}>
        <DataTable
          rows={project.restaurants}
          empty="Nenhum restaurante. Cadastre um para lançar refeições."
          rowHref={(r) => `/restaurantes/${r.id}`}
          columns={[
            { header: "Nome", cell: (r) => r.name },
            { header: "Telefone", cell: (r) => <span className="font-mono font-medium">{formatPhone(r.phone)}</span> },
            { header: "Cidade", cell: (r) => (r.address ? `${r.address.city}/${r.address.state}` : "—") },
          ]}
        />
      </Related>

      <Related title="Refeições"
        add={admin && project.restaurants.length > 0 ? { href: "/refeicoes/novo", label: "Nova refeição" } : undefined}>
        <DataTable
          rows={meals}
          empty="Nenhuma refeição lançada."
          rowHref={(m) => `/refeicoes/${m.id}`}
          columns={[
            { header: "Tipo", cell: (m) => MEAL_TYPES[m.mealType] },
            { header: "Restaurante", cell: (m) => m.restaurant.name },
            { header: "Data", cell: (m) => formatDate(m.date) },
            { header: "Qtd.", cell: (m) => <span className="font-mono font-medium">{m.quantity}</span>, className: "text-right" },
            { header: "Total", cell: (m) => <span className="font-mono font-medium">{formatCurrency(m.totalPrice)}</span>, className: "text-right" },
            { header: "Faturada", cell: (m) => (m.isBilled ? "Sim" : "Não") },
          ]}
        />
      </Related>

      <Related title="Hospedagens"
        add={admin ? { href: `/hospedagens/novo?obra=${id}`, label: "Nova hospedagem" } : undefined}>
        <DataTable
          rows={project.accommodations}
          empty="Nenhuma hospedagem vinculada."
          rowHref={(a) => `/hospedagens/${a.id}`}
          columns={[
            { header: "Anfitrião", cell: (a) => a.hostName },
            { header: "Cidade", cell: (a) => `${a.address.city}/${a.address.state}` },
            { header: "Diárias", cell: (a) => <span className="font-mono font-medium">{a.days}</span>, className: "text-right" },
            { header: "Total", cell: (a) => <span className="font-mono font-medium">{formatCurrency(a.totalPrice)}</span>, className: "text-right" },
          ]}
        />
      </Related>
    </>
  );
}
