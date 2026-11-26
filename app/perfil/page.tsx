import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/app/services/auth.service";
import LogoutButton from "@/components/LogoutButton";

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await AuthService.authenticate(token);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <span className="inline-block mt-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {user.role === "ADMIN" ? "Administrador" : "Usuário"}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">E-mail</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>

         
          
        </div>

        <div className="pt-2 flex flex-col gap-2">
          {user.role === "ADMIN" && (
            <Link
              href="/dashboard"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Ir para o Painel Administrativo
            </Link>
          )}

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}