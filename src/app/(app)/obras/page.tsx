import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { StatusBadge } from "@/components/status-badge";
import { getPage, isAdmin } from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type { ProjectSummary } from "@/lib/types";

export default async function ProjectsPage({ searchParams }: PageProps<"/obras">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([
    getPage<ProjectSummary>("/api/projects", page, 20, "updatedAt,desc"),
    isAdmin(),
  ]);

  return (
    <>
      <PageHeader
        title="Obras"
        description="Ordenadas pela atualização mais recente. Exigem cliente e centro de custo."
        action={admin ? { href: "/obras/novo", label: "Nova obra" } : undefined}
      />
      <DataTable
        rows={result.content}
        empty="Nenhuma obra cadastrada."
        rowHref={(row) => `/obras/${row.id}`}
        columns={[
          { header: "OS", cell: (p) => <span className="font-mono font-medium">{p.os}</span>, className: "whitespace-nowrap" },
          { header: "Descrição", cell: (p) => p.description ?? "—" },
          { header: "Cliente", cell: (p) => <span className="font-medium">{p.client.name}</span> },
          { header: "Início", cell: (p) => formatDate(p.startDate), className: "whitespace-nowrap" },
          { header: "Total", cell: (p) => <span className="font-mono font-medium">{formatCurrency(p.totalPrice)}</span>, className: "whitespace-nowrap text-right" },
          { header: "Situação", cell: (p) => <StatusBadge done={p.isCompleted} doneLabel="Concluída" openLabel="Em andamento" /> },
          { header: "Atualizada em", cell: (p) => <span className="font-mono text-xs">{formatDateTime(p.updatedAt)}</span>, className: "whitespace-nowrap" },
        ]}
      />
      <Pagination href="/obras" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}
