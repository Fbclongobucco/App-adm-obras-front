import Link from "next/link";
import type { ReactNode } from "react";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T extends { id: string }> = {
  rows: T[];
  columns: Column<T>[];
  /** Linha inteira clicavel. Links dentro das celulas precisam da classe "relative z-10". */
  rowHref?: (row: T) => string;
  empty: string;
};

export function DataTable<T extends { id: string }>({ rows, columns, rowHref, empty }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="rounded border border-line/30 bg-white px-4 py-6 text-center text-sm text-body">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto rounded border border-line/30 bg-white">
      <table className="w-full text-left text-[15px]">
        <thead className="border-b border-line/30 text-xs uppercase tracking-wide text-body">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={`px-4 py-3 font-semibold ${column.className ?? ""}`}>
                {column.header}
              </th>
            ))}
            {rowHref && <th className="w-px" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/20">
          {rows.map((row) => (
            <tr key={row.id} className={rowHref ? "group relative cursor-pointer hover:bg-surface/70" : undefined}>
              {columns.map((column, index) => (
                <td key={column.header} className={`px-4 py-3 text-title ${column.className ?? ""}`}>
                  {index === 0 && rowHref ? (
                    <Link
                      href={rowHref(row)}
                      className="font-medium after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-highlight"
                    >
                      {column.cell(row)}
                    </Link>
                  ) : (
                    column.cell(row)
                  )}
                </td>
              ))}
              {rowHref && (
                <td className="px-4 py-3 text-right text-line group-hover:text-highlight" aria-hidden>
                  <svg viewBox="0 0 24 24" className="inline size-4" fill="none" stroke="currentColor" strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
