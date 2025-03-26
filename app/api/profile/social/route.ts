import { authenticate } from "@/lib/auth.util";
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

export async function GET(request: Request) {
  try {
    const user = await authenticate();
    if (user) {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("socials")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if (error) {
        return new Response(error.message, { status: 400 });
      }
      if (data.length > 0) {
        return new Response(JSON.stringify(data[0]), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
