"use server";
import { createClient } from "@/utils/supabase/server";

export async function follows(follower: string, following: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("follows")
      .select()
      .eq("follower", follower)
      .eq("following", following)
      .single();

    if (data) {
      return true;
    }
  } catch (error) {
    return false;
  }
}
