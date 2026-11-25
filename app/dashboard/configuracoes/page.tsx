"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";

export default function ConfiguracoesPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        text: "A nova senha e a confirmação não coincidem.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao alterar senha.");
      }

      setFeedback({ type: "success", text: data.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Erro inesperado.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Configurações do Sistema
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Parâmetros de segurança e gerenciamento da conta administrativa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parâmetros de Segurança Ativos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Políticas de Autenticação
            </h2>
            <p className="text-sm text-gray-500">
              Configurações técnicas aplicadas atualmente às sessões e tokens.
            </p>

            <div className="divide-y divide-gray-100 text-sm">
              <div className="py-3 flex justify-between">
                <span className="text-gray-600">Algoritmo JWT</span>
                <span className="font-mono font-semibold text-gray-900">
                  HS256
                </span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-gray-600">Tempo de Expiração do Token</span>
                <span className="font-semibold text-gray-900">15 minutos</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-gray-600">Armazenamento de Sessão</span>
                <span className="font-semibold text-gray-900">
                  Cookie HTTP-Only (SameSite: Lax)
                </span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-gray-600">Criptografia de Senhas</span>
                <span className="font-semibold text-gray-900">
                  Bcrypt (Salt Rounds: 10)
                </span>
              </div>
            </div>
          </div>

          {/* Alteração de Senha do Administrador */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Alterar Senha de Acesso
            </h2>
            <p className="text-sm text-gray-500">
              Atualize a senha da sua conta de administrador.
            </p>

            {feedback && (
              <div
                className={`p-3 rounded-lg text-sm border ${
                  feedback.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Atualizar Senha"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}