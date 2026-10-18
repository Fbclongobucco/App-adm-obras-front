import { api } from "@/lib/api";
import { closingFileName, closingWorkbook, xlsxResponse } from "@/lib/closing-xlsx";
import { MEAL_TYPES, type Meal, type WeeklyClosing } from "@/lib/types";
import { weekParam } from "@/lib/week";

/** Planilha do fechamento semanal de uma refeicao (?semana=aaaa-mm-dd; sem semana, a semana padrao). */
export async function GET(request: Request, { params }: RouteContext<"/refeicoes/[id]/fechamento">) {
  const { id } = await params;
  const week = weekParam(new URL(request.url).searchParams.get("semana") ?? undefined);
  const [meal, closing] = await Promise.all([
    api<Meal>(`/api/meals/${id}`),
    api<WeeklyClosing>(`/api/meals/${id}/weekly-closing${week ? `?week=${week}` : ""}`),
  ]);
  const buffer = await closingWorkbook({
    restaurant: meal.restaurant.name,
    scope: `Refeição ${MEAL_TYPES[meal.mealType]}`,
    project: [meal.project.os, meal.project.description].filter(Boolean).join(" · "),
    closing,
    prices: {
      lunch: meal.lunchPrice,
      dinner: meal.dinnerPrice,
      lunchDeliveryFee: meal.restaurant.lunchDeliveryFee,
      dinnerDeliveryFee: meal.restaurant.dinnerDeliveryFee,
      soda: meal.sodaPrice,
    },
  });
  return xlsxResponse(buffer, closingFileName(`${meal.restaurant.name} ${MEAL_TYPES[meal.mealType]}`,
    closing.selected ?? "sem-semana"));
}
