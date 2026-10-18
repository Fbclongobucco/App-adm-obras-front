"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Menu com o item ativo destacado, no desktop e no painel do celular. Fica dentro de <Suspense>, porque a
 * rota so e conhecida em execucao. {@code onNavigate}: chamado ao escolher um item (o painel fecha).
 */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return <NavMenu pathname={usePathname()} onNavigate={onNavigate} />;
}

/** Itens de {@link NAV} por secao; sem item ativo quando pathname e null (fallback do <Suspense>). */
export function NavMenu({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return (
    <nav aria-label="Menu principal" className="flex flex-col gap-5 px-3 py-5">
      {NAV.map((section, index) => (
        <div key={section.title ?? index} className="space-y-1.5">
          {section.title && (
            <p className="px-3 pb-0.5 text-xs font-semibold uppercase tracking-widest text-white/70">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const active = pathname != null && isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-md border px-3 py-2.5 text-[0.9375rem] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-white ${
                  active
                    ? "border-white bg-white font-semibold text-title shadow-[inset_3px_0_0_var(--color-accent)]"
                    : "border-white/10 bg-white/[0.06] font-medium text-white hover:border-white/25 hover:bg-white/[0.12]"
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-[1.125rem] shrink-0" fill="none" stroke="currentColor"
                  strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
