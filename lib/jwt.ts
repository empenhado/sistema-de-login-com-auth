import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET não foi definida.");
}

const secretKey = new TextEncoder().encode(secret);

export async function generateToken(user: {
  id: number;
  email: string;
  role: string;
}) {
  const tokenId = randomUUID();

  const token = await new SignJWT({
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id.toString())
    .setJti(tokenId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secretKey);

  return {
    token,
    tokenId,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  };
}

// Validar JWT
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (!payload.sub || !payload.jti) {
      return null;
    }

    return {
      userId: Number(payload.sub),
      tokenId: payload.jti,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}