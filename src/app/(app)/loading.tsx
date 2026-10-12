export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Carregando">
      <div className="h-8 w-56 rounded bg-surface" />
      <div className="h-4 w-80 rounded bg-surface" />
      <div className="h-64 rounded border border-line/40 bg-surface/60" />
    </div>
  );
}
