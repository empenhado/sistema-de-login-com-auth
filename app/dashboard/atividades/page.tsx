
import Header from "@/components/dashboard/Header";

export default function AtividadesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Histórico de acessos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulte os registros de autenticação do sistema.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Nenhuma atividade registrada.
          </p>
        </div>
      </main>
    </div>
  );
}
