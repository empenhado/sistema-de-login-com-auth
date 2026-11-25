import { NextResponse } from "next/server";
import { AuthService } from "@/app/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Informe o e-mail e a senha." },
        { status: 400 }
      );
    }

    const result = await AuthService.login(
      email.trim().toLowerCase(),
      password
    );

    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso.",
        user: result.user,
      },
      { status: 200 }
    );

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "E-mail ou senha inválidos."
    ) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    console.error("Erro ao realizar login:", error);

    return NextResponse.json(
      { message: "Erro interno ao realizar login." },
      { status: 500 }
    );
  }
}