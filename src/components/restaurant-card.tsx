import Link from "next/link";
import { PeriodTable } from "@/components/period-table";
import { formatCurrency, formatPhone } from "@/lib/format";
import type { Restaurant } from "@/lib/types";

/** Quantidades por dia somando as refeicoes do restaurante (a partir da projecao do dia). */
function dailyTotals(restaurant: Restaurant) {
  const day = restaurant.meals.flatMap((meal) => meal.projections).filter((p) => p.period === "DAY");
  return [
    { label: "Almoços", value: day.reduce((sum, p) => sum + p.lunchMeals, 0) },
    { label: "Jantares", value: day.reduce((sum, p) => sum + p.dinnerMeals, 0) },
    { label: "Entregas", value: day.reduce((sum, p) => sum + p.deliveries, 0) },
    { label: "Refrigerantes", value: day.reduce((sum, p) => sum + p.sodas, 0) },
  ];
}

/** Taxa unica quando almoco e jantar cobram o mesmo; senao as duas, com "sem taxa" na vazia. */
export function DeliveryFee({ lunch, dinner }: { lunch: number | null; dinner: number | null }) {
  if (lunch === dinner) return <>{lunch == null ? "Sem taxa" : `${formatCurrency(lunch)} por entrega`}</>;
  const fee = (value: number | null) => (value == null ? "sem taxa" : formatCurrency(value));
  return <>{`Almoço ${fee(lunch)} · Jantar ${fee(dinner)}`}</>;
}

export function SodaPrice({ value }: { value: number | null }) {
  return <>{value == null ? "Sem refrigerante" : `Refrigerante: ${formatCurrency(value)} por entrega`}</>;
}

/** Card do restaurante com quantidades por dia e o quadro de fechamento por periodo. */
export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const projections = restaurant.meals.flatMap((meal) => meal.projections);
  return (
    <Link
      href={`/restaurantes/${restaurant.id}`}
      className="panel flex min-w-0 flex-col gap-4 p-5 transition-shadow hover:border-line hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
    >
      <div className="min-w-0">
        <p className="font-heading text-lg font-semibold break-words text-title">{restaurant.name}</p>
        <p className="mt-0.5 text-sm break-words text-body">
          OS <span className="font-mono">{restaurant.project.os}</span> · {restaurant.project.client.name}
        </p>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-body">
          <span className="font-mono">{formatPhone(restaurant.phone)}</span>
          <span>Entrega: <DeliveryFee lunch={restaurant.lunchDeliveryFee} dinner={restaurant.dinnerDeliveryFee} /></span>
          <span><SodaPrice value={restaurant.sodaPrice} /></span>
        </p>
      </div>

      {restaurant.meals.length === 0 ? (
        <p className="rounded border border-dashed border-line/60 px-3 py-3 text-sm text-body">
          Nenhuma refeição cadastrada.
        </p>
      ) : (
        <>
          <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(9rem,100%),1fr))] gap-2">
            {dailyTotals(restaurant).map((item) => (
              <div key={item.label} className="rounded bg-surface px-3 py-2">
                <dt className="text-xs font-semibold break-words uppercase tracking-wide text-body">{item.label} por dia</dt>
                <dd className="font-mono text-xl font-medium text-title">{item.value}</dd>
              </div>
            ))}
          </dl>
          <PeriodTable projections={projections} />
        </>
      )}
    </Link>
  );
}
