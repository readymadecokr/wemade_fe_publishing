import { eq } from "drizzle-orm";
import { admins } from "../drizzle/schema";
import { getDb } from "./db";

const BUILT_IN_ADMIN_PASSWORDS: Record<string, string> = {
  cyanima: "0000",
  blue0246: "0000",
};

export function encodeAdminPassword(password: string) {
  return Buffer.from(password).toString("base64");
}

export async function authenticateAdminCredentials(username: string, password: string) {
  const builtInPassword = BUILT_IN_ADMIN_PASSWORDS[username];
  if (builtInPassword && password === builtInPassword) return { id: null, username };

  const db = await getDb();
  if (!db) return null;
  const [admin] = await db
    .select({ id: admins.id, username: admins.username, passwordHash: admins.passwordHash, isActive: admins.isActive })
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1);

  if (!admin || admin.isActive !== 1 || admin.passwordHash !== encodeAdminPassword(password)) return null;
  return { id: admin.id, username: admin.username };
}
