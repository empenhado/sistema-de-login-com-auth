"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  History,
  KeyRound,
  Settings,
  LogOut,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/usuarios", label: "Usuários", icon: Users },
    { href: "/dashboard/atividades", label: "Atividades", icon: History },
    { href: "/dashboard/sessoes", label: "Sessões", icon: KeyRound },
    { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
  ];

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

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm transition ${
                  isActive
                    ? "font-medium text-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
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