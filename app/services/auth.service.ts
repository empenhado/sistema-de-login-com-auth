import bcrypt from "bcryptjs";
import { UserService } from "./user.service";
import { AccessLogService } from "./access-log.service";
import { generateToken, verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export class AuthService {
  // Realizar login
  static async login(email: string, password: string) {
    const user = await UserService.findByEmail(email);

    if (!user) {
      await AccessLogService.create({
        email,
        action: "LOGIN",
        status: "FAILURE",
      });

      throw new Error("E-mail ou senha inválidos.");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      await AccessLogService.create({
        userId: user.id,
        email,
        action: "LOGIN",
        status: "FAILURE",
      });

      throw new Error("E-mail ou senha inválidos.");
    }

    // Gerar JWT
    const { token, tokenId, expiresAt } = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Registrar sessão
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenId,
        expiresAt,
      },
    });

    // Registrar login bem-sucedido
    await AccessLogService.create({
      userId: user.id,
      email: user.email,
      action: "LOGIN",
      status: "SUCCESS",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // Validar sessão do usuário
  static async validateSession(tokenId: string) {
    const session = await prisma.session.findUnique({
      where: { tokenId },
      include: { user: true },
    });

    if (!session || session.revokedAt) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };
  }

  // Autenticar uma requisição
  static async authenticate(token: string) {
    const payload = await verifyToken(token);

    if (!payload) {
      return null;
    }

    const user = await this.validateSession(payload.tokenId);

    if (!user || user.id !== payload.userId) {
      return null;
    }

    return user;
  }

  // Encerrar sessão do usuário
  static async logout(token: string) {
    const payload = await verifyToken(token);

    if (!payload) {
      throw new Error("Token inválido ou expirado.");
    }

    const session = await prisma.session.findUnique({
      where: {
        tokenId: payload.tokenId,
      },
      include: {
        user: true,
      },
    });

    if (!session || session.revokedAt) {
      throw new Error("Sessão não encontrada ou já encerrada.");
    }

    // Revogar sessão
    await prisma.session.update({
      where: {
        tokenId: payload.tokenId,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    // Registrar logout
    await AccessLogService.create({
      userId: session.userId,
      email: session.user.email,
      action: "LOGOUT",
      status: "SUCCESS",
    });

    return {
      message: "Logout realizado com sucesso.",
    };
  }
}