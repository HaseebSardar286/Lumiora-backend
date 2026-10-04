import Admin from "../models/Admin";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase().replace(/^["']|["']$/g, "");
}

export async function validateAdmin(email: any, password: any): Promise<boolean> {
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return false;
  }
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = password.replace(/^["']|["']$/g, "");
  if (!normalizedEmail || !normalizedPassword) {
    return false;
  }

  // Prefer exact match on normalized email; also try original trim for legacy rows
  const admin =
    (await Admin.findOne({ email: normalizedEmail, password: normalizedPassword })) ||
    (await Admin.findOne({ email: email.trim(), password: normalizedPassword }));
  return !!admin;
}
