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

/** Obras exibidas em destaque: tres fileiras na grade larga. */
const RECENT_PROJECTS = 9;

export default async function DashboardPage() {
  const [now, recent, ...totals] = await Promise.all([
    today(),
    getPage<ProjectSummary>("/api/projects", 0, RECENT_PROJECTS, "updatedAt,desc"),
    ...COUNTERS.map((counter) => getPage(counter.path, 0, 1)),
  ]);

  return (
    <>
      <PageHeader title="Dashboard" description="Totais dos cadastros e obras alteradas por último." />

      {/* Faixa compacta: as obras sao o destaque e precisam caber na primeira tela */}
      <section aria-label="Totais"
        className="panel mb-8 grid grid-cols-2 divide-line/30 lg:grid-cols-3 min-[83.75rem]:grid-cols-6 min-[83.75rem]:divide-x">
        {COUNTERS.map((counter, index) => (
          <Link
            key={counter.href}
            href={counter.href}
            className="flex min-w-0 items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-surface sm:py-3"
          >
            <svg viewBox="0 0 24 24" className="size-[1.125rem] shrink-0 text-highlight" fill="none" stroke="currentColor"
              strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={NAV_ICONS[counter.href]} />
            </svg>
            <span className="min-w-0">
              {/* Rotulo de varias palavras quebra linha em vez de cortar */}
              <span className="block text-[0.6875rem] leading-tight font-semibold break-words uppercase text-body">
                {counter.label}
              </span>
              <span className="block font-mono text-xl font-medium leading-tight text-title">
                {totals[index].totalElements}
              </span>
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="obras">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <div>
            <h2 id="obras" className="font-heading text-xl font-semibold text-title">Obras</h2>
            <p className="text-sm text-body">Alteradas por último</p>
          </div>
          <Link href="/obras" className="shrink-0 text-sm font-medium text-highlight hover:underline">
            Ver todas
          </Link>
        </div>
        <ProjectGrid projects={recent.content} today={now} empty="Nenhuma obra cadastrada." />
      </section>
    </>
  );
}
