# Sistema Web de Autenticação e Gerenciamento de Acessos com JWT

Aplicação web de autenticação e gerenciamento de acessos desenvolvida com **Next.js, TypeScript, PostgreSQL e Prisma ORM**. O projeto utiliza JSON Web Tokens (JWT) para autenticação, bcrypt para proteção de senhas e controle de acesso baseado em papéis (RBAC).

## Tecnologias utilizadas

- **Next.js 16** — framework para desenvolvimento web.
- **React 19** — construção da interface.
- **TypeScript** — tipagem estática.
- **PostgreSQL** — banco de dados relacional.
- **Prisma ORM 7** — modelagem e comunicação com o banco de dados.
- **JWT (jose)** — geração e validação de tokens.
- **bcryptjs** — hash e verificação de senhas.
- **Tailwind CSS 4** — estilização da interface.
- **Docker Compose** — gerenciamento do banco de dados em ambiente local.

## Funcionalidades

### Autenticação
- Cadastro de usuários.
- Login com e-mail e senha.
- Criptografia de senhas utilizando hash bcrypt.
- Autenticação baseada em JWT.
- Gerenciamento de sessões no banco de dados.
- Logout com revogação de sessão.

### Controle de acesso
- Controle de permissões baseado em papéis (RBAC).
- Dois níveis de acesso: `ADMIN` e `USER`.
- Proteção de rotas do dashboard.
- Acesso ao dashboard restrito a usuários administradores.

### Registro de atividades
- Registro de tentativas de login.
- Registro de cadastros.
- Registro de logouts.
- Armazenamento do status das operações de autenticação.

## Estrutura do projeto

```text
login-system/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       ├── cadastro/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       ├── logout/
│   │       └── register/
│   ├── dashboard/
│   │   ├── atividades/
│   │   ├── configuracoes/
│   │   ├── usuarios/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── services/
│       ├── access-log.service.ts
│       ├── auth.service.ts
│       └── user.service.ts
├── components/
│   └── dashboard/
├── lib/
│   ├── jwt.ts
│   └── prisma.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── docker-compose.yml
├── prisma7.config.ts
├── .env.example
└── package.json
```

## Requisitos

Antes de começar, você precisará ter instalado:

- Node.js.
- npm.
- Docker e Docker Compose.
- Git.

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd login-system
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie seu arquivo `.env` a partir do modelo:

```bash
cp .env.example .env
```

Configure as variáveis:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO"
JWT_SECRET="SEU_SEGREDO_JWT"
```

Ajuste a conexão de acordo com as configurações do PostgreSQL definidas no `docker-compose.yml`.

Para gerar um segredo JWT aleatório, você pode utilizar:

```bash
openssl rand -base64 32
```

**Importante:** nunca compartilhe ou envie o arquivo `.env` para o repositório.

### 4. Iniciar o PostgreSQL

Com o Docker em execução:

```bash
docker compose up -d
```

Esse comando inicia o serviço PostgreSQL configurado no Docker Compose.

### 5. Configurar o banco de dados

Aplicar as migrations existentes:

```bash
npx prisma migrate deploy
```

Gerar o Prisma Client:

```bash
npx prisma generate
```

### 6. Executar a aplicação

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

## Rotas da aplicação

| Rota | Descrição |
|---|---|
| `/login` | Página de autenticação |
| `/login/cadastro` | Cadastro de usuários |
| `/dashboard` | Painel administrativo |
| `/dashboard/usuarios` | Seção de usuários |
| `/dashboard/atividades` | Seção de atividades |
| `/dashboard/configuracoes` | Seção de configurações |

O dashboard é protegido por autenticação e autorização: somente usuários com o papel `ADMIN` podem acessá-lo.

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro de usuário |
| POST | `/api/auth/login` | Autenticação |
| POST | `/api/auth/logout` | Encerramento da sessão |

## Banco de dados

O sistema utiliza PostgreSQL com Prisma ORM.

O banco possui três modelos principais:

- **User:** armazena os dados dos usuários, incluindo e-mail, hash da senha e papel de acesso.
- **Session:** armazena as sessões, identificadores dos tokens, datas de expiração e revogação.
- **AccessLog:** registra eventos de autenticação, seus respectivos status e informações disponíveis.

Os papéis de acesso são definidos pelo enum `Role`:

- `ADMIN`: usuário com permissão para acessar o dashboard administrativo.
- `USER`: usuário padrão, sem acesso ao dashboard administrativo.

Novos usuários recebem automaticamente o papel `USER`. A promoção para `ADMIN` é realizada diretamente no banco de dados.

## Desenvolvimento

Para verificar os tipos TypeScript:

```bash
npx tsc --noEmit
```

Para executar a verificação de código:

```bash
npm run lint
```

Para gerar a versão de produção:

```bash
npm run build
```

## Segurança

O projeto implementa algumas medidas de segurança:

- Senhas armazenadas por meio de hash bcrypt.
- Tokens JWT assinados com segredo definido por variável de ambiente.
- Cookie de autenticação configurado como `HttpOnly`.
- Controle de expiração e revogação de sessões.
- Verificação de autenticação e autorização nas rotas protegidas.

**Observação:** este projeto tem finalidade educacional e de demonstração. Antes de utilizá-lo em produção, são necessários testes adicionais e uma revisão de segurança.

## Integrantes

- Ester Martins
- Bruno Vital

