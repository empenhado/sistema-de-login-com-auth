import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { DashboardService } from "@/app/services/dashboard.service";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const stats = await DashboardService.getStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("[GET_ADMIN_DASHBOARD_ERROR]:", error);
    return NextResponse.json(
      { error: "Erro ao carregar indicadores do dashboard." },
      { status: 500 }
    );
  }
}