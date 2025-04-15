import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ user_id: string }>;
  }
) {
  try {
    const { user_id } = await params;
    const user = await authenticate();

    const supabase = await createClient();

    const { data: following, error: fetchFollowingError } = await supabase
      .from("follows")
      .select(
        `following (id, first_name, middle_name, last_name, email, avatar)`
      )
      .eq("follower", user_id);

    const { data: followers, error: fetchFollowersError } = await supabase
      .from("follows")
      .select(
        `follower (id, first_name, middle_name, last_name, email, avatar)`
      )
      .eq("following", user_id);

    if (fetchFollowingError || fetchFollowersError) {
      throw new Error(
        fetchFollowingError?.message || fetchFollowersError?.message
      );
    }

    return new Response(JSON.stringify({ following, followers }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
