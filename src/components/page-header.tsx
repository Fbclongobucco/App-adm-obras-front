import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  action?: { href: string; label: string };
  children?: ReactNode;
};

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    // Acoes sempre no alto, a direita: o titulo quebra linha ao lado delas em vez de empurra-las para baixo
    <div className="mb-6 flex items-start justify-between gap-3 border-b border-line/60 pb-4 sm:gap-4">
      <div className="min-w-[40%] flex-1">
        <h1 className="font-heading text-xl font-bold tracking-tight break-words text-title sm:text-2xl">{title}</h1>
        {description && <div className="mt-1 text-[0.9375rem] text-body">{description}</div>}
      </div>
      {/* Ate 60% da largura; o que nao couber quebra linha dentro da area, ainda a direita */}
      <div className="flex max-w-[60%] flex-wrap items-center justify-end gap-2 sm:gap-3">
        {children}
        {action && (
          <Link
            href={action.href}
            className="rounded bg-highlight px-4 py-2 text-sm font-semibold whitespace-nowrap text-white hover:bg-accent"
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
