import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { AccessLogService } from "@/app/services/access-log.service";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "ALL";
    const status = searchParams.get("status") || "ALL";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 15;

    const result = await AccessLogService.getLogs({
      action,
      status,
      page,
      limit,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[GET_ADMIN_LOGS_ERROR]:", error);
    return NextResponse.json(
      { error: "Erro ao consultar registros de atividades." },
      { status: 500 }
    );
  }
}