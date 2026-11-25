import Link from "next/link";
import { connection } from "next/server";
import Header from "@/components/dashboard/Header";
import { DashboardService } from "@/app/services/dashboard.service";

export default async function DashboardPage() {
  await connection();

  const {
    totalUsers,
    activeSessions,
    totalEvents,
    failedAttempts,
    recentLogs,
  } = await DashboardService.getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral em tempo real da autenticação e sessões do sistema.
          </p>
        </div>

        {/* Cards de Indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Usuários Cadastrados</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Sessões Ativas</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {activeSessions}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Total de Eventos</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {totalEvents}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Tentativas Malsucedidas</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {failedAttempts}
            </p>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Atividades Recentes
            </h2>
            <Link
              href="/dashboard/atividades"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Ver histórico completo →
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              Nenhuma atividade registrada ainda.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 text-sm">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-semibold text-gray-900">
                      {log.action}
                    </span>{" "}
                    —{" "}
                    <span className="text-gray-600">
                      {log.user?.name
                        ? `${log.user.name} (${log.email})`
                        : log.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        log.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}