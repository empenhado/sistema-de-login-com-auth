
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, Users, History, LogOut } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-600 p-2">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            Sistema de Login
          </span>
        </Link>

        {/* Navegação */}
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

        {/* Perfil */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">
                Nome do Usuário
            </p>
            <p className="text-xs text-gray-500">
              Administrador
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            U
          </div>

          <button
            type="button"
            title="Sair"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
          </button>
        </div>

      </div>
    </header>
  );
}
