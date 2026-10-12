import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ProjectSummary } from "@/lib/types";

/** Obras vinculadas a um registro (cliente, colaborador). Somente leitura. */
export function ProjectsTable({ title, projects, showClient = true }: {
  title: string;
  projects: ProjectSummary[];
  showClient?: boolean;
}) {
  return (
    <section className="mt-10 max-w-5xl">
      <h2 className="mb-3 font-heading text-lg font-semibold text-title">{title}</h2>
      <DataTable
        rows={projects}
        empty="Nenhuma obra vinculada."
        rowHref={(p) => `/obras/${p.id}`}
        columns={[
          { header: "OS", cell: (p) => <span className="font-mono font-medium">{p.os}</span>, className: "whitespace-nowrap" },
          ...(showClient ? [{ header: "Cliente", cell: (p: ProjectSummary) => <span className="font-medium">{p.client.name}</span> }] : []),
          { header: "Descrição", cell: (p) => p.description ?? "—" },
          { header: "Início", cell: (p) => formatDate(p.startDate), className: "whitespace-nowrap" },
          { header: "Total", cell: (p) => <span className="font-mono font-medium">{formatCurrency(p.totalPrice)}</span>, className: "whitespace-nowrap text-right" },
          { header: "Situação", cell: (p) => <StatusBadge done={p.isCompleted} doneLabel="Concluída" openLabel="Em andamento" /> },
        ]}
      />
    </section>
  );
}
