import { prisma } from "@/lib/prisma";
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
}