import Link from "next/link";
import type { ProjectSummary } from "@/lib/types";

/** Obra identificada por OS, cliente e descricao, com link proprio (acima do link da linha da tabela). */
export function ProjectRef({ project }: { project: ProjectSummary }) {
  return (
    <Link href={`/obras/${project.id}`} className="relative z-10 block max-w-sm hover:underline">
      <span className="block text-sm">
        <span className="font-mono font-medium text-title">{project.os}</span>
        <span className="text-body"> · </span>
        <span className="font-medium text-title">{project.client.name}</span>
      </span>
      {project.description && <span className="block truncate text-sm text-body">{project.description}</span>}
    </Link>
  );
}

/** Cliente da obra, em destaque, com link para o cadastro do cliente. */
export function ClientLine({ project }: { project: ProjectSummary }) {
  return (
    <span className="text-[0.9375rem] text-body">
      Cliente{" "}
      <Link href={`/clientes/${project.client.id}`} className="relative z-10 font-semibold text-title hover:underline">
        {project.client.name}
      </Link>
    </span>
  );
}

/** Faixa no topo do detalhe de um registro que pertence a uma obra. */
export function ProjectBanner({ project, label = "Obra" }: { project: ProjectSummary; label?: string }) {
  return (
    <div className="panel mb-6 max-w-3xl border-l-[3px] border-l-accent px-4 py-3">
      <Link href={`/obras/${project.id}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 hover:underline">
        <span className="text-xs font-semibold uppercase tracking-wide text-body">{label}</span>
        <span className="font-mono font-medium text-title">{project.os}</span>
        {project.description && <span className="text-title">{project.description}</span>}
      </Link>
      <div className="mt-1">
        <ClientLine project={project} />
      </div>
    </div>
  );
}
