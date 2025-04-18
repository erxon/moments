//get top 3 galleries
import { createClient } from "@/utils/supabase/server";
import { authenticate } from "@/lib/auth.util";
import { follows } from "@/lib/follows.util";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const user = await authenticate();

    const { searchParams } = new URL(request.url);
    const number = searchParams.get("number") as unknown as number;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery")
      .select()
      .order("updated_at", { ascending: true })
      .limit(number)
      .eq("visibility", "public")
      .eq("user_id", user_id);

    const isFollowing = await follows(user.id, user_id);

    if (isFollowing) {
      const { data, error } = await supabase
        .from("gallery")
        .select()
        .order("updated_at", { ascending: true })
        .limit(number)
        .or("visibility.eq.public, visibility.eq.followers")
        .eq("user_id", user_id);

      if (error) {
        throw new Error(error.message);
      }

      return new Response(JSON.stringify(data), { status: 200 });
    }

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
