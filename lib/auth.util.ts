import { createClient } from "@/utils/supabase/server";

export async function authenticate() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }
    return user;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}
