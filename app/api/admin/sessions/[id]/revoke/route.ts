import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { AuthService } from "@/app/services/auth.service";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const sessionId = Number(id);

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: "ID de sessão inválido." },
        { status: 400 }
      );
    }

    await AuthService.revokeSessionById(sessionId);

    return NextResponse.json(
      { message: "Sessão encerrada com sucesso." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Erro ao revogar sessão.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}