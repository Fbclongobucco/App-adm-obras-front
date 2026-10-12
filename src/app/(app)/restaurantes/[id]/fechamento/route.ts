import { api } from "@/lib/api";
import { closingFileName, closingWorkbook, xlsxResponse } from "@/lib/closing-xlsx";
import { MEAL_SERVES, type Restaurant, type WeeklyClosing } from "@/lib/types";
import { weekParam } from "@/lib/week";

/** Planilha do fechamento semanal do restaurante (?semana=aaaa-mm-dd; sem semana, a semana padrao). */
export async function GET(request: Request, { params }: RouteContext<"/restaurantes/[id]/fechamento">) {
  const { id } = await params;
  const week = weekParam(new URL(request.url).searchParams.get("semana") ?? undefined);
  const [restaurant, closing] = await Promise.all([
    api<Restaurant>(`/api/restaurants/${id}`),
    api<WeeklyClosing>(`/api/restaurants/${id}/weekly-closing${week ? `?week=${week}` : ""}`),
  ]);
  // O restaurante tem no maximo uma refeicao com almoco e uma com jantar
  const lunch = restaurant.meals.find((meal) => MEAL_SERVES[meal.mealType].lunch);
  const dinner = restaurant.meals.find((meal) => MEAL_SERVES[meal.mealType].dinner);
  const buffer = await closingWorkbook({
    restaurant: restaurant.name,
    scope: null,
    project: [restaurant.project.os, restaurant.project.description].filter(Boolean).join(" · "),
    closing,
    prices: {
      lunch: lunch?.lunchPrice ?? null,
      dinner: dinner?.dinnerPrice ?? null,
      deliveryFee: restaurant.deliveryFee,
      soda: restaurant.sodaPrice,
    },
  });
  return xlsxResponse(buffer, closingFileName(restaurant.name, closing.selected ?? "sem-semana"));
}
