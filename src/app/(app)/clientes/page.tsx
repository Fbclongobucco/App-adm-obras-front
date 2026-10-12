import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam } from "@/components/pagination";
import { getPage, isAdmin } from "@/lib/api";
import { formatDateTime, formatPhone } from "@/lib/format";
import type { ClientSummary } from "@/lib/types";

export default async function ClientsPage({ searchParams }: PageProps<"/clientes">) {
  const page = pageParam((await searchParams).page);
  const [result, admin] = await Promise.all([getPage<ClientSummary>("/api/clients", page), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Contratantes das obras."
        action={admin ? { href: "/clientes/novo", label: "Novo cliente" } : undefined}
      />
      <DataTable
        rows={result.content}
        empty="Nenhum cliente cadastrado."
        rowHref={(row) => `/clientes/${row.id}`}
        columns={[
          { header: "Nome", cell: (row) => row.name },
          { header: "E-mail", cell: (row) => row.email },
          { header: "Telefone", cell: (row) => <span className="font-mono font-medium">{formatPhone(row.phone)}</span>, className: "whitespace-nowrap" },
          { header: "Cidade", cell: (row) => `${row.address.city}/${row.address.state}` },
          { header: "Atualizado em", cell: (row) => <span className="font-mono text-xs">{formatDateTime(row.updatedAt)}</span>, className: "whitespace-nowrap" },
        ]}
      />
      <Pagination href="/clientes" page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}
