import { formatDate } from "@/lib/format";
import { projectProgress, type ProgressState } from "@/lib/progress";
import type { ProjectSummary } from "@/lib/types";

function days(count: number) {
  return count === 1 ? "1 dia" : `${count} dias`;
}

const BAR: Record<Exclude<ProgressState, "open">, string> = {
  running: "bg-title",
  upcoming: "bg-title",
  done: "bg-line",
  late: "bg-accent",
};

/** Prazo decorrido da obra (tempo, nao avanco fisico). `today` vem de lib/today. */
export function ProjectProgress({ project, today, className }: {
  project: Pick<ProjectSummary, "startDate" | "endDate" | "isCompleted">;
  today: string;
  className?: string;
}) {
  const progress = projectProgress(project, today);

  if (progress.state === "open") {
    return (
      <p className={`text-sm text-body ${className ?? ""}`}>
        Sem término definido · {days(progress.elapsedDays)} decorrido{progress.elapsedDays === 1 ? "" : "s"}
      </p>
    );
  }

  const text = {
    running: `Prazo: ${progress.elapsedDays} de ${days(progress.totalDays ?? 0)}`,
    upcoming: `Inicia em ${formatDate(project.startDate)}`,
    late: `Atrasada há ${days(progress.lateDays)}`,
    done: "Concluída",
  }[progress.state];
  const percent = progress.percent ?? 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className={progress.state === "late" ? "font-medium text-accent" : "text-body"}>{text}</span>
        <span className="font-mono font-medium text-title">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${text} (${percent}%)`}
        aria-label="Prazo decorrido da obra"
        className="h-2 overflow-hidden rounded-full bg-surface ring-1 ring-line/30 ring-inset"
      >
        <div className={`h-full rounded-full ${BAR[progress.state]}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
