import Profile from "@/lib/types/profile.types";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { facebook, twitter, instagram } = body;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("socials")
    .select()
    .eq("user_id", user?.id);

  if (data && data.length === 0) {
    const { error } = await supabase
      .from("socials")
      .insert({
        user_id: user?.id,
        facebook,
        twitter,
        instagram,
      })
      .eq("user_id", user?.id);
    if (error) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Socials were added successfully", { status: 200 });
  } else {
    const { error } = await supabase
      .from("socials")
      .update({
        facebook,
        twitter,
        instagram,
      })
      .eq("user_id", user?.id);
    if (error) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Socials were updated successfully", { status: 200 });
  }
}
