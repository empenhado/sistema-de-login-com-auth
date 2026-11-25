import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { UserService } from "@/app/services/user.service";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const result = await UserService.listUsers({ search, page, limit });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[GET_ADMIN_USERS_ERROR]:", error);
    return NextResponse.json(
      { error: "Erro ao listar usuários." },
      { status: 500 }
    );
  }
}