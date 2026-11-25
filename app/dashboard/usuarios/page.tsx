
import Header from "@/components/dashboard/Header";

export default function UsuariosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Usuários
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gerenciamento de usuários cadastrados no sistema.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Nenhum usuário para exibir.
          </p>
        </div>
      </main>
    </div>
  );
}
