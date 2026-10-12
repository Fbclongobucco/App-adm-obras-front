import type { ProjectSummary } from "@/lib/types";

// Prazo decorrido da obra em dias corridos. Mede tempo, nao avanco fisico.

export type ProgressState = "done" | "open" | "upcoming" | "late" | "running";

export type ProjectProgress = {
  state: ProgressState;
  /** 0-100; null quando a obra nao tem termino. */
  percent: number | null;
  elapsedDays: number;
  totalDays: number | null;
  lateDays: number;
};

const DAY = 86_400_000;

/** "aaaa-mm-dd" como dia UTC, sem fuso nem horario de verao. */
function toDay(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / DAY;
}

export function projectProgress(
  project: Pick<ProjectSummary, "startDate" | "endDate" | "isCompleted">,
  today: string,
): ProjectProgress {
  const start = toDay(project.startDate);
  const now = toDay(today);
  const elapsedDays = Math.max(0, now - start);

  if (project.isCompleted) {
    const totalDays = project.endDate ? Math.max(1, toDay(project.endDate) - start) : null;
    return { state: "done", percent: 100, elapsedDays, totalDays, lateDays: 0 };
  }
  if (!project.endDate) {
    return { state: "open", percent: null, elapsedDays, totalDays: null, lateDays: 0 };
  }

  const end = toDay(project.endDate);
  // Termino igual ao inicio conta como obra de um dia
  const totalDays = Math.max(1, end - start);
  if (now < start) return { state: "upcoming", percent: 0, elapsedDays: 0, totalDays, lateDays: 0 };
  if (now > end) return { state: "late", percent: 100, elapsedDays, totalDays, lateDays: now - end };
  return {
    state: "running",
    percent: Math.floor((elapsedDays / totalDays) * 100),
    elapsedDays,
    totalDays,
    lateDays: 0,
  };
}
