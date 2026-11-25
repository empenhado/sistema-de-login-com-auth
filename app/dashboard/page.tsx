
import {
  Users,
  UserCheck,
  Activity,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">

        {/* Título */}
        <section>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Bem-vinda ao painel de controle do sistema.
          </p>
        </section>

        {/* Estatísticas */}
        <section>
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900">
              Visão geral
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Indicadores gerais de autenticação e usuários.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total de usuários"
              value="—"
              description="Usuários cadastrados"
              icon={<Users size={21} className="text-indigo-600" />}
              iconColor="bg-indigo-50"
            />

            <StatCard
              title="Acessos realizados"
              value="—"
              description="Registros de autenticação"
              icon={<Activity size={21} className="text-blue-600" />}
              iconColor="bg-blue-50"
            />

            <StatCard
              title="Acessos bem-sucedidos"
              value="—"
              description="Autenticações concluídas"
              icon={<UserCheck size={21} className="text-green-600" />}
              iconColor="bg-green-50"
            />

            <StatCard
              title="Segurança"
              value="—"
              description="Status do sistema"
              icon={<ShieldCheck size={21} className="text-purple-600" />}
              iconColor="bg-purple-50"
            />
          </div>
        </section>

        {/* Atividades recentes */}
        <RecentActivity />

        {/* Atalhos */}
        <QuickActions />

      </main>
    </div>
  );
}
