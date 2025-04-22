import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const user = await authenticate();

    const supabase = await createClient();

    //Fetch followed users
    const { data: followedUsers, error: errorFetchingFollowedUsers } =
      await supabase.from("follows").select("*").eq("follower", user.id);

    //Fetch latest uploads of the followed users
    const { data: latestUploads, error: errorFetchingLatestUploads } =
      await supabase.rpc("get_latest_posts_for_users", {
        user_ids: [followedUsers?.map((user) => user.following)],
      });

    if (errorFetchingFollowedUsers || errorFetchingLatestUploads) {
      throw new Error("Something went wrong.");
    }

    return new Response(JSON.stringify(latestUploads), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
