import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AccessLogService } from "./access-log.service";
import { Prisma } from "@/generated/prisma/client";

export interface ListUsersParams {
  search?: string;
  page?: number;
  limit?: number;
}

export class UserService {
  // Buscar todos os usuários
  static async findAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Buscar usuário pelo ID
  static async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Buscar usuário pelo e-mail
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Criar um novo usuário
  static async create(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const { name, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await AccessLogService.create({
        email,
        action: "REGISTER",
        status: "FAILURE",
      });

      throw new Error("Este e-mail já está cadastrado.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await AccessLogService.create({
      userId: user.id,
      email: user.email,
      action: "REGISTER",
      status: "SUCCESS",
    });

    return user;
  }
  static async listUsers({ search = "", page = 1, limit = 10 }: ListUsersParams) {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(50, Math.max(1, limit));
    const skip = (validPage - 1) * validLimit;

    const where: Prisma.UserWhereInput = search.trim()
      ? {
          OR: [
            { name: { contains: search.trim(), mode: "insensitive" } },
            { email: { contains: search.trim(), mode: "insensitive" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: validLimit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page: validPage,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  static async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            sessions: true,
            accessLogs: true,
          },
        },
      },
    });
  }
}
