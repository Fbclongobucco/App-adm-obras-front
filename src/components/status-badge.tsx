export function StatusBadge({ done, doneLabel, openLabel }: { done: boolean; doneLabel: string; openLabel: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${
        done ? "bg-surface text-body" : "border border-highlight/30 text-highlight"
      }`}
    >
      {done ? doneLabel : openLabel}
    </span>
  );
}
