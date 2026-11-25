import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AuthService } from '@/app/services/auth.service';

export interface AdminContext {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN';
}

export async function requireAdmin(): Promise<
  { authorized: true; user: AdminContext } | { authorized: false; response: NextResponse }
> {
  try {
    const cookieStore = await cookies();
    // Confirme se o nome do seu cookie é 'token' (ajuste se for outro, ex: 'auth_token')
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Não autenticado. Token ausente.' },
          { status: 401 }
        ),
      };
    }

    // Reaproveita o método authenticate que já valida JWT + Sessão ativa no banco
    const user = await AuthService.authenticate(token);

    if (!user) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Sessão inválida, revogada ou expirada.' },
          { status: 401 }
        ),
      };
    }

    if (user.role !== 'ADMIN') {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Acesso negado. Permissão de administrador necessária.' },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'ADMIN',
      },
    };
  } catch (error) {
    console.error('[ADMIN_GUARD_ERROR]:', error);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Erro interno na validação de permissões.' },
        { status: 500 }
      ),
    };
  }
}