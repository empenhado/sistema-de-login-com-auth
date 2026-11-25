
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  History,
  LogOut,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Não foi possível encerrar a sessão.");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Não foi possível realizar o logout. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-600 p-2">
            <ShieldCheck size={22} className="text-white" />
          </div>

          <span className="text-lg font-bold text-gray-900">
            Sistema de Login
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-indigo-600"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/usuarios"
            className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-indigo-600"
          >
            <Users size={17} />
            Usuários
          </Link>

          <Link
            href="/dashboard/atividades"
            className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-indigo-600"
          >
            <History size={17} />
            Atividades
          </Link>
        </nav>

        <div className="flex items-center">
          <button
            type="button"
            title="Sair"
            onClick={handleLogout}
            disabled={isLoading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}
