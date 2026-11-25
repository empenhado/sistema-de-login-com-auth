
import Link from "next/link";
import { Users, History, Settings, ArrowRight } from "lucide-react";

const actions = [
  {
    title: "Gerenciar usuários",
    description: "Visualize e gerencie os usuários cadastrados.",
    href: "/dashboard/usuarios",
    icon: Users,
  },
  {
    title: "Histórico de acessos",
    description: "Consulte os registros de autenticação.",
    href: "/dashboard/atividades",
    icon: History,
  },
  {
    title: "Configurações",
    description: "Gerencie as informações da sua conta.",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
];

export default function QuickActions() {
  return (
    <section>
      <h2 className="mb-4 font-semibold text-gray-900">
        Acesso rápido
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-start justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex gap-3">
                <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                  <Icon size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {action.description}
                  </p>
                </div>
              </div>

              <ArrowRight
                size={17}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
