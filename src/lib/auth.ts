import Admin from "../models/Admin";

export async function validateAdmin(email: any, password: any): Promise<boolean> {
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return false;
  }
  const admin = await Admin.findOne({ email, password });
  return !!admin;
}
