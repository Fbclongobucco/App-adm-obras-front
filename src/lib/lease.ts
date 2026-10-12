import type { AccommodationPeriod } from "@/lib/types";

// Situacao da locacao da hospedagem em dias corridos, pelo "hoje" do usuario (lib/today), como o prazo da obra.

export type LeaseState = "UPCOMING" | "ACTIVE" | "ENDING_SOON" | "ENDING" | "EXPIRED";

/** Laranja com 14 dias ou menos ate o termino; vermelho com menos de 7. */
export const ENDING_SOON_DAYS = 14;
export const ENDING_DAYS = 7;

export type LeaseStatus = {
  state: LeaseState;
  /** Periodo atual: o que contem hoje; antes da entrada, o primeiro; depois do termino, o ultimo. */
  current: AccommodationPeriod;
  /** Dias do periodo atual ja decorridos, contando hoje (0 antes da entrada). */
  elapsedDays: number;
  /** 0-100 do periodo atual. */
  percent: number;
  /** Dias de hoje ate o termino da locacao (0 no dia do termino); negativo quando vencida. */
  remainingDays: number;
};

const DAY = 86_400_000;

/** "aaaa-mm-dd" como dia UTC, sem fuso nem horario de verao. */
function toDay(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / DAY;
}

export function leaseStatus(periods: AccommodationPeriod[], today: string): LeaseStatus {
  const now = toDay(today);
  const first = periods[0];
  const last = periods[periods.length - 1];
  const remainingDays = toDay(last.endDate) - now;
  if (now < toDay(first.startDate)) {
    return { state: "UPCOMING", current: first, elapsedDays: 0, percent: 0, remainingDays };
  }
  if (remainingDays < 0) {
    return { state: "EXPIRED", current: last, elapsedDays: last.days, percent: 100, remainingDays };
  }
  const current = periods.find((period) => toDay(period.startDate) <= now && now <= toDay(period.endDate)) ?? last;
  const elapsedDays = now - toDay(current.startDate) + 1;
  const state: LeaseState = remainingDays < ENDING_DAYS ? "ENDING"
    : remainingDays <= ENDING_SOON_DAYS ? "ENDING_SOON" : "ACTIVE";
  return { state, current, elapsedDays, percent: Math.round((elapsedDays / current.days) * 100), remainingDays };
}
