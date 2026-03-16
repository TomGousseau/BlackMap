import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

// Auto-generate JWT_SECRET if not set, persist across hot reloads
const globalForAuth = globalThis as unknown as { jwtSecret?: string };
if (!globalForAuth.jwtSecret) {
  globalForAuth.jwtSecret = process.env.JWT_SECRET || randomBytes(32).toString("hex");
}
const secret = new TextEncoder().encode(globalForAuth.jwtSecret);

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token);
}
