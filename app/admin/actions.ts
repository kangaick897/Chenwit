"use server";

import { redirect } from "next/navigation";

import { resolveAdminEmail } from "@/lib/admin-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getRedirectTarget(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/admin/")) {
    return "/admin/dashboard";
  }

  return value;
}

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const next = getRedirectTarget(formData.get("next"));

  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    redirect("/admin?error=missing");
  }

  const supabase = await createServerSupabaseClient();
  const email = resolveAdminEmail(username);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/admin?error=invalid");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    redirect("/admin?error=unauthorized");
  }

  redirect(next);
}

export async function logoutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  redirect("/admin");
}
