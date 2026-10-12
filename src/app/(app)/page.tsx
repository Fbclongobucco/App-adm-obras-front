import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getPage } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Project } from "@/lib/types";

const COUNTERS = [
  { label: "Obras", path: "/api/projects", href: "/obras" },
  { label: "Colaboradores", path: "/api/employees", href: "/colaboradores" },
  { label: "Clientes", path: "/api/clients", href: "/clientes" },
  { label: "Restaurantes", path: "/api/restaurants", href: "/restaurantes" },
  { label: "Hospedagens", path: "/api/accommodations", href: "/hospedagens" },
  { label: "Centros de custo", path: "/api/cost-centers", href: "/centros-de-custo" },
];

export default async function DashboardPage() {
  const [recent, ...totals] = await Promise.all([
    getPage<Project>("/api/projects", 0, 10, "updatedAt,desc"),
    ...COUNTERS.map((counter) => getPage(counter.path, 0, 1)),
  ]);

  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral dos cadastros e das obras alteradas por último." />

      <section aria-label="Totais" className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {COUNTERS.map((counter, index) => (
          <Link
            key={counter.href}
            href={counter.href}
            className="rounded border border-line/30 bg-white px-4 py-3 hover:border-highlight"
          >
            <span className="block text-xs font-semibold uppercase tracking-wide text-body">{counter.label}</span>
            <span className="mt-1 block font-mono text-2xl font-medium text-title">{totals[index].totalElements}</span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="recentes">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="recentes" className="font-heading text-lg font-semibold text-title">
            Últimas obras atualizadas
          </h2>
          <Link href="/obras" className="text-sm font-medium text-highlight hover:underline">
            Ver todas
          </Link>
        </div>
        <DataTable
          rows={recent.content}
          empty="Nenhuma obra cadastrada."
          rowHref={(project) => `/obras/${project.id}`}
          columns={[
            { header: "OS", cell: (p) => <span className="font-mono font-medium">{p.os}</span>, className: "whitespace-nowrap" },
            { header: "Descrição", cell: (p) => p.description ?? "—" },
            { header: "Cliente", cell: (p) => <span className="font-medium">{p.client.name}</span> },
            { header: "Início", cell: (p) => formatDate(p.startDate), className: "whitespace-nowrap" },
            {
              header: "Situação",
              cell: (p) => <StatusBadge done={p.isCompleted} doneLabel="Concluída" openLabel="Em andamento" />,
            },
            {
              header: "Atualizada em",
              cell: (p) => <span className="font-mono text-xs">{formatDateTime(p.updatedAt)}</span>,
              className: "whitespace-nowrap",
            },
          ]}
        />
      </section>
    </>
  );
}
