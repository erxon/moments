"use server";
import { createClient } from "@/utils/supabase/server";

export async function authenticate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  return user;
}
