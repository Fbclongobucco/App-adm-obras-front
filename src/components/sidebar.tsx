"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Menu com o item ativo destacado. Fica dentro de <Suspense>, porque a rota so e conhecida em execucao. */
export function Sidebar() {
  return <SidebarNav pathname={usePathname()} />;
}

/** Menu sem item ativo (pathname null), usado como fallback do <Suspense>. */
export function SidebarNav({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Menu principal" className="flex flex-col gap-5 px-3 py-5">
      {NAV.map((section, index) => (
        <div key={section.title ?? index} className="space-y-1">
          {section.title && (
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-body">
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
                className={`flex items-center gap-3 rounded-r border-l-2 px-3 py-2 text-sm font-medium ${
                  active
                    ? "border-accent bg-surface text-highlight"
                    : "border-transparent text-title hover:bg-surface"
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor"
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
