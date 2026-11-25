"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/dashboard/Header";

interface SessionItem {
  id: number;
  tokenId: string;
  expiresAt: string;
  revokedAt: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
  };
}

export default function SessoesPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/sessions");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao carregar sessões");
      }
      const data = await res.json();
      setSessions(data.sessions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = async (id: number) => {
    if (!confirm("Deseja realmente encerrar esta sessão?")) return;

    setRevokingId(id);
    try {
      const res = await fetch(`/api/admin/sessions/${id}/revoke`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao revogar sessão");
      }

      await fetchSessions();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao encerrar sessão");
    } finally {
      setRevokingId(null);
    }
  };

  const getSessionStatus = (session: SessionItem) => {
    if (session.revokedAt) {
      return {
        label: "Revogada",
        badge: "bg-red-100 text-red-700",
        isActive: false,
      };
    }
    if (new Date(session.expiresAt) <= new Date()) {
      return {
        label: "Expirada",
        badge: "bg-amber-100 text-amber-800",
        isActive: false,
      };
    }
    return {
      label: "Ativa",
      badge: "bg-green-100 text-green-700",
      isActive: true,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciamento de Sessões
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Acompanhe e encerre sessões ativas dos usuários no sistema.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Usuário</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Expira em</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Carregando sessões...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Nenhuma sessão encontrada.
                  </td>
                </tr>
              ) : (
                sessions.map((session) => {
                  const status = getSessionStatus(session);

                  return (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-gray-600">
                        #{session.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {session.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.user.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${status.badge}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(session.expiresAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {status.isActive ? (
                          <button
                            onClick={() => handleRevoke(session.id)}
                            disabled={revokingId === session.id}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            {revokingId === session.id
                              ? "Encerrando..."
                              : "Encerrar Sessão"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}