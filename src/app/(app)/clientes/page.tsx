import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { getPage, isAdmin } from "@/lib/api";
import { formatDateTime, formatPhone } from "@/lib/format";
import type { ClientSummary } from "@/lib/types";

export default async function ClientsPage({ searchParams }: PageProps<"/clientes">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin] = await Promise.all([getPage<ClientSummary>("/api/clients", page, 20, undefined, q), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Contratantes das obras."
        action={admin ? { href: "/clientes/novo", label: "Novo cliente" } : undefined}
      />
      <SearchField href="/clientes" initial={q} placeholder="Buscar por nome, e-mail ou cidade" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/clientes" query={q} />
      ) : (
        <>
          <DataTable
            rows={result.content}
            empty="Nenhum cliente cadastrado."
            rowHref={(row) => `/clientes/${row.id}`}
            columns={[
              { header: "Nome", cell: (row) => row.name },
              { header: "E-mail", cell: (row) => row.email ?? "—" },
              { header: "Telefone", cell: (row) => <span className="font-mono font-medium">{formatPhone(row.phone)}</span>, className: "whitespace-nowrap" },
              { header: "Cidade", cell: (row) => `${row.address.city}/${row.address.state}` },
              { header: "Atualizado em", cell: (row) => <span className="font-mono text-xs">{formatDateTime(row.updatedAt)}</span>, className: "whitespace-nowrap" },
            ]}
          />
        </>
      )}
      <Pagination href="/clientes" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}
