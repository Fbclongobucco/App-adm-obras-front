import Link from "next/link";
import { ProjectProgress } from "@/components/project-progress";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type { ProjectSummary } from "@/lib/types";

/** Card de obra com prazo decorrido; o card inteiro leva ao detalhe. */
export function ProjectCard({ project, today, showUpdatedAt }: {
  project: ProjectSummary;
  today: string;
  showUpdatedAt?: boolean;
}) {
  return (
    <Link
      href={`/obras/${project.id}`}
      className="panel flex flex-col gap-3 p-5 transition-shadow hover:border-line hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 truncate font-mono text-base font-semibold text-title" title={project.os}>{project.os}</span>
        <span className="shrink-0"><StatusBadge done={project.isCompleted} doneLabel="Concluída" openLabel="Em andamento" /></span>
      </div>
      <div className="min-h-[3em]">
        <p className="line-clamp-2 font-medium text-title">{project.description ?? "—"}</p>
        <p className="mt-0.5 text-sm text-body">{project.client.name}</p>
      </div>
      <ProjectProgress project={project} today={today} />
      <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-1 border-t border-line/30 pt-3 text-sm">
        <span className="text-body">
          <span className="whitespace-nowrap">{formatDate(project.startDate)}</span>
          {" → "}
          <span className="whitespace-nowrap">{formatDate(project.endDate)}</span>
          {showUpdatedAt && (
            <span className="block font-mono text-xs">Atualizada em {formatDateTime(project.updatedAt)}</span>
          )}
        </span>
        <span className="shrink-0 font-mono font-medium whitespace-nowrap text-title">{formatCurrency(project.totalPrice)}</span>
      </div>
    </Link>
  );
}

/** Grade responsiva de cards de obra. */
export function ProjectGrid({ projects, today, empty, showUpdatedAt }: {
  projects: ProjectSummary[];
  today: string;
  empty: string;
  showUpdatedAt?: boolean;
}) {
  if (projects.length === 0) {
    return <p className="panel px-4 py-6 text-center text-sm text-body">{empty}</p>;
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} today={today} showUpdatedAt={showUpdatedAt} />
      ))}
    </div>
  );
}
