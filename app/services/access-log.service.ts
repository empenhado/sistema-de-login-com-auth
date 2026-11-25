import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
  AccessAction,
  AccessStatus,
} from "../../generated/prisma/client";

type AccessLogData = {
  userId?: number;
  email: string;
  action: AccessAction;
  status: AccessStatus;
  ip?: string;
};

export interface GetLogsParams {
  action?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class AccessLogService {
  static async create(data: AccessLogData) {
    try {
      return await prisma.accessLog.create({
        data: {
          userId: data.userId,
          email: data.email,
          action: data.action,
          status: data.status,
          ip: data.ip,
        },
      });
    } catch (error) {
      console.error("Erro ao registrar atividade:", error);
      return null;
    }
  }
  static async getLogs({
    action,
    status,
    page = 1,
    limit = 15,
  }: GetLogsParams) {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(50, Math.max(1, limit));
    const skip = (validPage - 1) * validLimit;

    const where: Prisma.AccessLogWhereInput = {};

    if (action && action !== "ALL") {
      where.action = action as any; // REGISTER | LOGIN | LOGOUT
    }

    if (status && status !== "ALL") {
      where.status = status as any; // SUCCESS | FAILURE | BLOCKED
    }

    const [logs, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        skip,
        take: validLimit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.accessLog.count({ where }),
    ]);

    return {
      logs,
      total,
      page: validPage,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  static async getRecentLogs(limit = 5) {
    return prisma.accessLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
