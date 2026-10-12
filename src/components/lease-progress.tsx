import { formatDate } from "@/lib/format";
import { leaseStatus, type LeaseState } from "@/lib/lease";
import type { AccommodationPeriod } from "@/lib/types";

const BAR: Record<LeaseState, string> = {
  UPCOMING: "bg-line",
  ACTIVE: "bg-title",
  ENDING_SOON: "bg-warning",
  ENDING: "bg-accent",
  EXPIRED: "bg-accent",
};

const TEXT: Record<LeaseState, string> = {
  UPCOMING: "text-body",
  ACTIVE: "text-body",
  ENDING_SOON: "font-medium text-warning",
  ENDING: "font-medium text-accent",
  EXPIRED: "font-medium text-accent",
};

function days(count: number) {
  return count === 1 ? "1 dia" : `${count} dias`;
}

/**
 * Barra do periodo atual da locacao, com os dias ate o termino. Laranja com 14 dias ou menos, vermelha com
 * menos de 7 e cheia quando vencida. O texto acompanha a cor, para nao depender so dela.
 */
export function LeaseProgress({ periods, today, compact, className }: {
  periods: AccommodationPeriod[];
  today: string;
  compact?: boolean;
  className?: string;
}) {
  const status = leaseStatus(periods, today);
  const text = {
    UPCOMING: `Entrada em ${formatDate(status.current.startDate)}`,
    EXPIRED: `Vencida há ${days(-status.remainingDays)}`,
  }[status.state as "UPCOMING" | "EXPIRED"]
    ?? (status.remainingDays === 0 ? "Termina hoje" : `Faltam ${days(status.remainingDays)}`);
  const period = `${formatDate(status.current.startDate)} a ${formatDate(status.current.endDate)}`;

  return (
    <div className={className}>
      <div className={`flex flex-wrap items-baseline justify-between gap-x-3 ${compact ? "mb-1 text-xs" : "mb-1.5 text-sm"}`}>
        <span className={TEXT[status.state]}>{text}</span>
        {!compact && <span className="font-mono text-xs text-body">Período atual: {period}</span>}
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={status.percent}
        aria-valuetext={`${text}. Período atual ${period}, ${status.percent}% decorrido`}
        aria-label="Período atual da locação"
        className={`${compact ? "h-1.5" : "h-2"} overflow-hidden rounded-full bg-surface ring-1 ring-line/30 ring-inset`}
      >
        <div className={`h-full rounded-full ${BAR[status.state]}`} style={{ width: `${status.percent}%` }} />
      </div>
    </div>
  );
}
