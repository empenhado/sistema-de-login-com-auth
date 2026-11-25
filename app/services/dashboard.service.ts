import { prisma } from "@/lib/prisma";
import { AccessLogService } from "./access-log.service";

export class DashboardService {
  static async getStats() {
    const now = new Date();

    const [
      totalUsers,
      activeSessions,
      totalEvents,
      failedAttempts,
      recentLogs,
    ] = await Promise.all([
      // 1. Total de usuários cadastrados
      prisma.user.count(),

      // 2. Sessões ativas (não revogadas E com expiração futura)
      prisma.session.count({
        where: {
          revokedAt: null,
          expiresAt: {
            gt: now,
          },
        },
      }),

      // 3. Total de eventos de autenticação
      prisma.accessLog.count(),

      // 4. Quantidade de tentativas malsucedidas (FAILURE + BLOCKED)
      prisma.accessLog.count({
        where: {
          status: {
            in: ["FAILURE", "BLOCKED"],
          },
        },
      }),

      // 5. Últimas 5 atividades recentes
      AccessLogService.getRecentLogs(5),
    ]);

    return {
      totalUsers,
      activeSessions,
      totalEvents,
      failedAttempts,
      recentLogs,
    };
  }
}