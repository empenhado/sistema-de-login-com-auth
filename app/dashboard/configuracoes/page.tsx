
import Header from "@/components/dashboard/Header";

export default function ConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Configurações
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gerencie as configurações da sua conta.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Nenhuma configuração disponível no momento.
          </p>
        </div>
      </main>
    </div>
  );
}
