import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ProjectGrid } from "@/components/project-card";
import { getPage } from "@/lib/api";
import { NAV } from "@/lib/nav";
import { today } from "@/lib/today";
import type { ProjectSummary } from "@/lib/types";

const COUNTERS = [
  { label: "Obras", path: "/api/projects", href: "/obras" },
  { label: "Colaboradores", path: "/api/employees", href: "/colaboradores" },
  { label: "Clientes", path: "/api/clients", href: "/clientes" },
  { label: "Restaurantes", path: "/api/restaurants", href: "/restaurantes" },
  { label: "Hospedagens", path: "/api/accommodations", href: "/hospedagens" },
  { label: "Centros de custo", path: "/api/cost-centers", href: "/centros-de-custo" },
];

/** Icones dos indicadores: os mesmos do menu, pelo href. */
const NAV_ICONS = Object.fromEntries(NAV.flatMap((section) => section.items).map((item) => [item.href, item.icon]));

export default async function DashboardPage() {
  const [now, recent, ...totals] = await Promise.all([
    today(),
    getPage<ProjectSummary>("/api/projects", 0, 6, "updatedAt,desc"),
    ...COUNTERS.map((counter) => getPage(counter.path, 0, 1)),
  ]);

  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral dos cadastros e das obras alteradas por último." />

      <section aria-label="Totais" className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(min(14rem,100%),1fr))] gap-4">
        {COUNTERS.map((counter, index) => (
          <Link
            key={counter.href}
            href={counter.href}
            className="panel flex items-center gap-4 px-4 py-4 transition-shadow hover:border-line hover:shadow-md"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface text-highlight">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={NAV_ICONS[counter.href]} />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold break-words uppercase tracking-wide text-body">{counter.label}</span>
              <span className="mt-0.5 block font-mono text-3xl font-medium leading-tight text-title">
                {totals[index].totalElements}
              </span>
            </span>
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
        <ProjectGrid projects={recent.content} today={now} empty="Nenhuma obra cadastrada." />
      </section>
    </>
  );
}
