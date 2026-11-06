import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "enterprise-secret-shopsphere-jwt-2026-key"
);

export type UserRole = "customer" | "admin";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  [key: string]: unknown;
}

/**
 * Signs a JWT with user identity and RBAC role.
 */
export async function signAuthToken(payload: TokenPayload, expiresIn = "7d"): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT and extracts verified payload.
 */
export async function verifyAuthToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts Bearer token from authorization header.
 */
export function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
}

/**
 * RBAC permission gate for role validation.
 */
export function checkRole(role: UserRole, requiredRole: UserRole): boolean {
  if (requiredRole === "customer") return true;
  return role === "admin";
}
