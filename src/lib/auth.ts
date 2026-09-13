import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "truanayangi_admin_session";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@truanayangi.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456";

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return session === "authenticated_admin";
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated_admin", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export function validateCredentials(email: string, pass: string): boolean {
  return email === ADMIN_EMAIL && pass === ADMIN_PASSWORD;
}
