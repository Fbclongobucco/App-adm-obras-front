import { PageHeader } from "@/components/page-header";
import { Pagination, pageParam, queryParam } from "@/components/pagination";
import { SearchEmpty, SearchField } from "@/components/search-field";
import { ProjectGrid } from "@/components/project-card";
import { getPage, isAdmin } from "@/lib/api";
import { today } from "@/lib/today";
import type { ProjectSummary } from "@/lib/types";

export default async function ProjectsPage({ searchParams }: PageProps<"/obras">) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const q = queryParam(params.q);
  const [result, admin, now] = await Promise.all([
    getPage<ProjectSummary>("/api/projects", page, 20, "updatedAt,desc", q),
    isAdmin(),
    today(),
  ]);

  return (
    <>
      <PageHeader
        title="Obras"
        description="Ordenadas pela atualização mais recente. Exigem cliente e centro de custo."
        action={admin ? { href: "/obras/novo", label: "Nova obra" } : undefined}
      />
      <SearchField href="/obras" initial={q} placeholder="Buscar por OS, descrição ou cliente" />
      {q && result.totalElements === 0 ? (
        <SearchEmpty href="/obras" query={q} />
      ) : (
        <>
          <ProjectGrid projects={result.content} today={now} empty="Nenhuma obra cadastrada." showUpdatedAt />
        </>
      )}
      <Pagination href="/obras" query={q} page={page} totalPages={result.totalPages} totalElements={result.totalElements} />
    </>
  );
}
