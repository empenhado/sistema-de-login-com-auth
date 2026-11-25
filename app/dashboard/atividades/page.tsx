"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/dashboard/Header";

interface LogItem {
  id: number;
  action: "REGISTER" | "LOGIN" | "LOGOUT";
  status: "SUCCESS" | "FAILURE" | "BLOCKED";
  email: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export default function AtividadesPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        action: actionFilter,
        status: statusFilter,
        page: String(page),
        limit: "15",
      });

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao carregar atividades");
      }

      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages || 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }, [actionFilter, statusFilter, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (type: "action" | "status", value: string) => {
    if (type === "action") setActionFilter(value);
    if (type === "status") setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <Header/>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Monitoramento de Atividades
          </h1>
          <p className="text-sm text-gray-500">
            Histórico de registros, logins e logouts do sistema
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
          <span className="text-sm text-gray-500">Total de eventos: </span>
          <span className="text-lg font-bold text-gray-900">{total}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Tipo de Evento
          </label>
          <select
            value={actionFilter}
            onChange={(e) => handleFilterChange("action", e.target.value)}
            className="px-3 py-2 border rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos os eventos</option>
            <option value="REGISTER">REGISTER (Cadastro)</option>
            <option value="LOGIN">LOGIN (Entrada)</option>
            <option value="LOGOUT">LOGOUT (Saída)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos os status</option>
            <option value="SUCCESS">SUCCESS (Sucesso)</option>
            <option value="FAILURE">FAILURE (Falha)</option>
            <option value="BLOCKED">BLOCKED (Bloqueado)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabela de Logs */}
      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <th className="py-3 px-4">Evento</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Usuário / E-mail</th>
              <th className="py-3 px-4">Data e Horário</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  Carregando registros...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  Nenhum registro encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isFailed =
                  log.status === "FAILURE" || log.status === "BLOCKED";

                return (
                  <tr
                    key={log.id}
                    className={
                      isFailed
                        ? "bg-red-50/70 hover:bg-red-100/70"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : log.status === "FAILURE"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {log.user ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {log.user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.email}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-600">
                          {log.email}{" "}
                          <span className="text-xs text-gray-400">
                            (não cadastrado)
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}