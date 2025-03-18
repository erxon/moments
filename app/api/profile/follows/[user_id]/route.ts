import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const { user_id } = await params;

  try {
    const user = await authenticate();

    if (user) {
      const supabase = await createClient();
      const following = await supabase
        .from("follows")
        .select("following")
        .eq("follower", user_id);
      const follower = await supabase
        .from("follows")
        .select("follower")
        .eq("following", user_id);

      const result = { following: following.data, follower: follower.data };

      return new Response(JSON.stringify(result), { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
