import "server-only";
import { connection } from "next/server";

const dateInSaoPaulo = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });

/**
 * Data de hoje em America/Sao_Paulo, "aaaa-mm-dd". Le o relogio so depois de connection(),
 * porque com Cache Components ler a data durante o prerender quebra o build.
 */
export async function today(): Promise<string> {
  await connection();
  return dateInSaoPaulo.format(new Date());
}
