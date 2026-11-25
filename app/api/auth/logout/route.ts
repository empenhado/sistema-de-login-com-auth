import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Nenhuma sessão ativa encontrada." },
        { status: 401 }
      );
    }

    await AuthService.logout(token);

    const response = NextResponse.json(
      { message: "Logout realizado com sucesso." },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Erro ao realizar logout:", error);

    const response = NextResponse.json(
      { message: "Não foi possível encerrar a sessão." },
      { status: 401 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  }
}