import { formatCurrency } from "@/lib/format";
import { BILLING_PERIODS, type BillingPeriod, type MealProjection } from "@/lib/types";

const PERIODS = Object.keys(BILLING_PERIODS) as BillingPeriod[];

const ROWS: { key: keyof Omit<MealProjection, "period" | "workingDays">; label: string }[] = [
  { key: "lunchMeals", label: "Almoços" },
  { key: "dinnerMeals", label: "Jantares" },
  { key: "deliveries", label: "Entregas" },
  { key: "sodas", label: "Refrigerantes" },
];

const quantity = new Intl.NumberFormat("pt-BR");

/**
 * Quadro de fechamento por periodo (projecao fixa calculada pela API). Recebe as projecoes de
 * uma ou mais refeicoes e soma por periodo; linhas zeradas em todos os periodos sao omitidas.
 */
export function PeriodTable({ projections }: { projections: MealProjection[] }) {
  const totals = PERIODS.map((period) => {
    const items = projections.filter((p) => p.period === period);
    return {
      period,
      workingDays: items[0]?.workingDays ?? 0,
      lunchMeals: items.reduce((sum, p) => sum + p.lunchMeals, 0),
      dinnerMeals: items.reduce((sum, p) => sum + p.dinnerMeals, 0),
      deliveries: items.reduce((sum, p) => sum + p.deliveries, 0),
      sodas: items.reduce((sum, p) => sum + p.sodas, 0),
      price: items.reduce((sum, p) => sum + p.price, 0),
    };
  });
  const rows = ROWS.filter((row) => totals.some((total) => total[row.key] > 0));

  return (
    <div className="overflow-x-auto rounded border border-line/50">
      <table className="w-full min-w-[26rem] text-right text-sm">
        <thead className="border-b border-line/60 bg-surface text-xs uppercase tracking-wide text-title">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">
              <span className="sr-only">Item</span>
            </th>
            {totals.map((total) => (
              <th key={total.period} className="px-3 py-2 font-semibold whitespace-nowrap">
                {BILLING_PERIODS[total.period]}
                <span className="block font-mono text-[0.6875rem] font-normal normal-case tracking-normal text-body">
                  {total.workingDays} {total.workingDays === 1 ? "dia útil" : "dias úteis"}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/30">
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row" className="px-3 py-1.5 text-left font-medium text-body">{row.label}</th>
              {totals.map((total) => (
                <td key={total.period} className="px-3 py-1.5 font-mono text-title">{quantity.format(total[row.key])}</td>
              ))}
            </tr>
          ))}
          <tr className="bg-surface/60">
            <th scope="row" className="px-3 py-2 text-left font-semibold text-title">Valor</th>
            {totals.map((total) => (
              <td key={total.period} className="px-3 py-2 font-mono font-semibold whitespace-nowrap text-title">
                {formatCurrency(total.price)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
