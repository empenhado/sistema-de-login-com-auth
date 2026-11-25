import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { UserService } from "@/app/services/user.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "ID de usuário inválido." },
        { status: 400 }
      );
    }

    const user = await UserService.getUserById(numericId);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("[GET_ADMIN_USER_BY_ID_ERROR]:", error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes do usuário." },
      { status: 500 }
    );
  }
}