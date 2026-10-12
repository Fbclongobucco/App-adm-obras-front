export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Carregando">
      <div className="h-8 w-56 rounded bg-line/30" />
      <div className="h-4 w-80 rounded bg-line/30" />
      <div className="panel h-64" />
    </div>
  );
}
