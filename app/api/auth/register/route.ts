import { NextResponse } from "next/server";
import { UserService } from "@/app/services/user.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    const user = await UserService.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    return NextResponse.json(
      {
        message: "Usuário cadastrado com sucesso.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Este e-mail já está cadastrado."
    ) {
      return NextResponse.json(
        { message: error.message },
        { status: 409 }
      );
    }

    console.error("Erro ao cadastrar usuário:", error);

    return NextResponse.json(
      { message: "Erro interno ao realizar cadastro." },
      { status: 500 }
    );
  }
}