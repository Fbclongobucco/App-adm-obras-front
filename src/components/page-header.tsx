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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-title">{title}</h1>
        {description && <div className="mt-1 text-[15px] text-body">{description}</div>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {action && (
          <Link
            href={action.href}
            className="rounded bg-highlight px-4 py-2 text-sm font-semibold text-white hover:bg-accent"
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
