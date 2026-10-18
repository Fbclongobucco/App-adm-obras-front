import "server-only";
import ExcelJS from "exceljs";
import { DAY_STATUS, WEEKDAYS, type WeeklyClosing } from "@/lib/types";

/** Precos unitarios usados nas formulas; null quando nao se aplica (vale zero). */
export type ClosingPrices = {
  lunch: number | null;
  dinner: number | null;
  lunchDeliveryFee: number | null;
  dinnerDeliveryFee: number | null;
  soda: number | null;
};

export type ClosingSheetInput = {
  restaurant: string;
  /** Ex.: "Refeição Almoço" quando a exportacao e de uma refeicao. */
  scope: string | null;
  project: string;
  closing: WeeklyClosing;
  prices: ClosingPrices;
};

const FONT = "Arial";
const TITLE = "FF550E10";
const DARK = "FF252525";
const TEXT = "FF525252";
const LINE = "FF9A9A9A";
const SURFACE = "FFF1F1F1";
const MONEY = '"R$" #,##0.00';

const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`);
const brDate = (iso: string) => iso.split("-").reverse().join("/");

/** Nome de arquivo sem acentos nem espacos. */
export function closingFileName(name: string, weekStart: string): string {
  const slug = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `fechamento-${slug || "restaurante"}-${weekStart}.xlsx`;
}

/**
 * Planilha do fechamento semanal para o financeiro: um dia por linha, quantidades vindas da API e valores
 * por formula (quantidade x preco unitario), com o resultado gravado para leitores que nao recalculam.
 */
export async function closingWorkbook(input: ClosingSheetInput): Promise<ArrayBuffer> {
  const { closing, prices } = input;
  const week = closing.weeks.find((item) => item.start === closing.selected);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SOLER";
  const sheet = workbook.addWorksheet("Fechamento semanal", {
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9 },
  });
  sheet.columns = [
    { width: 12 }, { width: 10 }, { width: 24 }, { width: 10 }, { width: 14 }, { width: 10 }, { width: 14 },
    { width: 11 }, { width: 14 }, { width: 11 }, { width: 14 }, { width: 13 }, { width: 15 }, { width: 15 },
  ];
  const font = (bold = false, color = TEXT, size = 10) => ({ name: FONT, bold, color: { argb: color }, size });

  sheet.getCell("A1").value = "Fechamento semanal de refeições";
  sheet.getCell("A1").font = font(true, TITLE, 14);
  const info: [string, string][] = [
    ["Restaurante", input.scope ? `${input.restaurant} · ${input.scope}` : input.restaurant],
    ["Obra", input.project],
    ["Semana", week ? `${brDate(week.start)} a ${brDate(week.end)}${week.partial ? " (parcial)" : ""}` : "—"],
  ];
  info.forEach(([label, value], i) => {
    const row = sheet.getRow(3 + i);
    row.getCell(1).value = label;
    row.getCell(1).font = font(true, DARK);
    row.getCell(3).value = value;
    row.getCell(3).font = font();
  });

  // Precos unitarios: referenciados pelas formulas da tabela
  sheet.getCell("A7").value = "Preços unitários";
  sheet.getCell("A7").font = font(true, TITLE, 11);
  const priceRows: [string, number | null][] = [
    ["Almoço", prices.lunch],
    ["Jantar", prices.dinner],
    ["Entrega do almoço", prices.lunchDeliveryFee],
    ["Entrega do jantar", prices.dinnerDeliveryFee],
    ["Refrigerante", prices.soda],
  ];
  priceRows.forEach(([label, value], i) => {
    const row = sheet.getRow(8 + i);
    row.getCell(1).value = label;
    row.getCell(1).font = font(false, DARK);
    row.getCell(3).value = value ?? 0;
    row.getCell(3).numFmt = MONEY;
    row.getCell(3).font = font(false, DARK);
    if (value == null) {
      row.getCell(4).value = label.startsWith("Entrega") ? "sem taxa" : "não se aplica";
      row.getCell(4).font = font(false, TEXT, 9);
    }
  });
  const price = { lunch: "$C$8", dinner: "$C$9", lunchFee: "$C$10", dinnerFee: "$C$11", soda: "$C$12" };

  const headerRow = 14;
  const headers = ["Data", "Dia", "Situação", "Almoços", "Valor almoços", "Jantares", "Valor jantares",
    "Entregas almoço", "Valor entregas almoço", "Entregas jantar", "Valor entregas jantar", "Refrigerantes",
    "Valor refrig.", "Total do dia"];
  const head = sheet.getRow(headerRow);
  headers.forEach((label, i) => {
    const cell = head.getCell(i + 1);
    cell.value = label;
    cell.font = font(true, "FFFFFFFF");
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: DARK } };
    cell.alignment = { vertical: "middle", horizontal: i < 3 ? "left" : "right", wrapText: true };
  });
  head.height = 28;

  const unit = (value: number | null) => value ?? 0;
  closing.days.forEach((day, i) => {
    const r = headerRow + 1 + i;
    const row = sheet.getRow(r);
    const status = day.partialNoService ? "Sem fornecimento (parcial)" : DAY_STATUS[day.status];
    const lunchValue = day.lunchMeals * unit(prices.lunch);
    const dinnerValue = day.dinnerMeals * unit(prices.dinner);
    const lunchDeliveryValue = day.lunchDeliveries * unit(prices.lunchDeliveryFee);
    const dinnerDeliveryValue = day.dinnerDeliveries * unit(prices.dinnerDeliveryFee);
    const sodaValue = day.sodas * unit(prices.soda);
    row.values = [
      toDate(day.date), WEEKDAYS[day.weekday] ?? day.weekday, status,
      day.lunchMeals, { formula: `D${r}*${price.lunch}`, result: lunchValue },
      day.dinnerMeals, { formula: `F${r}*${price.dinner}`, result: dinnerValue },
      day.lunchDeliveries, { formula: `H${r}*${price.lunchFee}`, result: lunchDeliveryValue },
      day.dinnerDeliveries, { formula: `J${r}*${price.dinnerFee}`, result: dinnerDeliveryValue },
      day.sodas, { formula: `L${r}*${price.soda}`, result: sodaValue },
      {
        formula: `E${r}+G${r}+I${r}+K${r}+M${r}`,
        result: lunchValue + dinnerValue + lunchDeliveryValue + dinnerDeliveryValue + sodaValue,
      },
    ];
    const off = day.status === "OFF" || day.status === "OUT_OF_PERIOD";
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.font = font(false, off ? LINE : DARK);
      cell.border = { bottom: { style: "thin", color: { argb: LINE } } };
      if (col === 1) cell.numFmt = "dd/mm/yyyy";
      if ([5, 7, 9, 11, 13, 14].includes(col)) cell.numFmt = MONEY;
    });
  });

  const first = headerRow + 1;
  const last = headerRow + closing.days.length;
  const totalRow = sheet.getRow(last + 1);
  const t = closing.totals;
  const lunchDeliveries = closing.days.reduce((total, day) => total + day.lunchDeliveries, 0);
  const dinnerDeliveries = closing.days.reduce((total, day) => total + day.dinnerDeliveries, 0);
  const sum = (col: string, result: number) => ({ formula: `SUM(${col}${first}:${col}${last})`, result });
  totalRow.values = [
    "Semana", null, `${t.serviceDays} ${t.serviceDays === 1 ? "dia de fornecimento" : "dias de fornecimento"}`,
    sum("D", t.lunchMeals), sum("E", t.lunchMeals * unit(prices.lunch)),
    sum("F", t.dinnerMeals), sum("G", t.dinnerMeals * unit(prices.dinner)),
    sum("H", lunchDeliveries), sum("I", lunchDeliveries * unit(prices.lunchDeliveryFee)),
    sum("J", dinnerDeliveries), sum("K", dinnerDeliveries * unit(prices.dinnerDeliveryFee)),
    sum("L", t.sodas), sum("M", t.sodas * unit(prices.soda)),
    sum("N", t.price),
  ];
  totalRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.font = font(true, DARK);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SURFACE } };
    if ([5, 7, 9, 11, 13, 14].includes(col)) cell.numFmt = MONEY;
  });

  const note = sheet.getCell(`A${last + 3}`);
  note.value = "Quantidades e situação calculadas pelo sistema (ajustes por data incluídos). "
    + "Valores = quantidade × preço unitário da tabela acima.";
  note.font = font(false, TEXT, 9);
  return workbook.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}

export function xlsxResponse(buffer: ArrayBuffer, fileName: string): Response {
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
