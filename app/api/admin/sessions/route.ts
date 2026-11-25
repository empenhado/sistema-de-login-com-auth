import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { AuthService } from "@/app/services/auth.service";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const sessions = await AuthService.listSessions();
    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("[GET_ADMIN_SESSIONS_ERROR]:", error);
    return NextResponse.json(
      { error: "Erro ao listar sessões." },
      { status: 500 }
    );
  }
}