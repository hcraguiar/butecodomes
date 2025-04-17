// app/bars/page.tsx
export default function BarsPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Butecos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Aqui entra a listagem de cards de bares futuramente */}
        <div className="border rounded-md p-4 bg-muted text-muted-foreground">
          Nenhum bar cadastrado ainda.
        </div>
      </div>
    </div>
  );
}
