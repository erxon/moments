import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";
import { follows } from "@/lib/follows.util";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const { searchParams } = new URL(request.url);
    const gallery_id = searchParams.get("gallery_id");
    const user = await authenticate();
    const supabase = await createClient();

    const isFollower = await follows(user.id, user_id);

    if (isFollower) {
      const { data, error } = await supabase
        .from("image")
        .select()
        .or("visibility.eq.public, visibility.eq.followers")
        .eq("gallery_id", gallery_id)
        .eq("user_id", user_id);

      if (error) {
        throw new Error(error.message);
      }

      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      const { data, error } = await supabase
        .from("image")
        .select()
        .eq("visibility", "public")
        .eq("gallery_id", gallery_id)
        .eq("user_id", user_id);
      if (error) {
        throw new Error(error.message);
      }

      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
