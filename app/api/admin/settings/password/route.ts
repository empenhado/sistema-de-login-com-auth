import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { AuthService } from "@/app/services/auth.service";

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Preencha a senha atual e a nova senha." },
        { status: 400 }
      );
    }

    await AuthService.changePassword(
      auth.user.id,
      currentPassword,
      newPassword
    );

    return NextResponse.json(
      { message: "Senha atualizada com sucesso." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao atualizar senha.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}