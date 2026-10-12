import { DeleteButton } from "@/components/delete-button";
import { LeaseProgress } from "@/components/lease-progress";
import { ProjectBanner } from "@/components/project-ref";
import { PageHeader } from "@/components/page-header";
import { apiOrNotFound, isAdmin } from "@/lib/api";
import { formatCurrency, formatDate, formatPhone } from "@/lib/format";
import { today } from "@/lib/today";
import type { Accommodation } from "@/lib/types";
import { deleteAccommodation } from "../actions";
import { RenewalForm, UndoRenewalButton } from "./lease";

/** Detalhe da hospedagem: locacao, periodos e renovacao. A edicao fica em /hospedagens/[id]/editar. */
export default async function AccommodationPage({ params }: PageProps<"/hospedagens/[id]">) {
  const { id } = await params;
  const [accommodation, admin, now] = await Promise.all([
    apiOrNotFound<Accommodation>(`/api/accommodations/${id}`),
    isAdmin(),
    today(),
  ]);
  const { periods } = accommodation;
  const last = periods[periods.length - 1];
  const facts: [string, string][] = [
    ["Entrada", formatDate(accommodation.startDate)],
    ["Valor por mês", formatCurrency(accommodation.monthlyPrice)],
    ["Término", formatDate(accommodation.endDate)],
    ["Total da locação", formatCurrency(accommodation.totalPrice)],
  ];

  return (
    <>
      <PageHeader title={accommodation.hostName}
        description={<>
          {accommodation.project ? `Hospedagem · OS ${accommodation.project.os}` : "Hospedagem sem obra"}
          {" · "}{formatPhone(accommodation.hostPhone)} · {accommodation.address.city}/{accommodation.address.state}
          {" · "}{accommodation.employees.length}/{accommodation.capacity} hóspedes
          {accommodation.isContract ? " · Com contrato" : ""}
        </>}
        action={admin ? { href: `/hospedagens/${id}/editar`, label: "Editar" } : undefined}>
        {admin && <DeleteButton action={deleteAccommodation.bind(null, id)} label="esta hospedagem" />}
      </PageHeader>
      {accommodation.project && <ProjectBanner project={accommodation.project} />}

      <section aria-label="Locação" className="panel mb-6 max-w-3xl space-y-4 px-5 py-4">
        <h2 className="font-heading text-base font-semibold text-title">Locação</h2>
        <LeaseProgress periods={periods} today={now} />
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-body">{label}</dt>
              <dd className="font-mono text-sm font-medium text-title">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="relative overflow-x-auto rounded border border-line/50">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-line/60 bg-surface text-xs uppercase tracking-wide text-title">
              <tr>
                <th className="px-3 py-2 font-semibold">Período</th>
                <th className="px-3 py-2 font-semibold">De</th>
                <th className="px-3 py-2 font-semibold">Até</th>
                <th className="px-3 py-2 text-right font-semibold">Dias</th>
                <th className="px-3 py-2 text-right font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/30">
              {periods.map((period, index) => (
                <tr key={period.id ?? period.startDate}>
                  <td className="px-3 py-1.5 text-body">{index === 0 ? "Entrada" : `Renovação ${index}`}</td>
                  <td className="px-3 py-1.5 font-mono text-title">{formatDate(period.startDate)}</td>
                  <td className="px-3 py-1.5 font-mono text-title">{formatDate(period.endDate)}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-title">{period.days}</td>
                  <td className="px-3 py-1.5 text-right font-mono whitespace-nowrap text-title">{formatCurrency(period.price)}</td>
                </tr>
              ))}
              <tr className="bg-surface/60 font-semibold text-title">
                <th scope="row" colSpan={3} className="px-3 py-2 text-left">Total</th>
                <td className="px-3 py-2 text-right font-mono">{periods.reduce((sum, period) => sum + period.days, 0)}</td>
                <td className="px-3 py-2 text-right font-mono whitespace-nowrap">{formatCurrency(accommodation.totalPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {admin && periods.length > 1 && (
          <UndoRenewalButton id={id} period={`${formatDate(last.startDate)} a ${formatDate(last.endDate)}`} />
        )}
        {admin && <RenewalForm accommodation={accommodation} />}
      </section>
    </>
  );
}
