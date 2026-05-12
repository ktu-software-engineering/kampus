import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@/types";

export function isEduEmail(email: string): boolean {
  return email.endsWith(".edu.tr") && email.includes("@");
}

export function isKtuStudentEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@ogr.ktu.edu.tr");
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data ?? null;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: User["role"] | User["role"][]): Promise<User> {
  const user = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) redirect("/");
  return user;
}
