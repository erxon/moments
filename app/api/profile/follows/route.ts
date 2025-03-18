import { getProfileById } from "@/app/(main)/profile/profile-actions";
import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  //follow
  const body = await request.json();
  const { following } = body;

  try {
    const supabase = await createClient();
    const user = await authenticate();

    if (user) {
      //check if the user is already following the profile
      const checkIfAlreadyFollowing = await supabase
        .from("follows")
        .select()
        .eq("follower", user.id)
        .eq("following", following);
      if (
        checkIfAlreadyFollowing.data &&
        checkIfAlreadyFollowing.data.length > 0
      ) {
        return new Response("You are already following this profile", {
          status: 400,
        });
      }

      const { error } = await supabase.from("follows").insert({
        follower: user.id,
        following: following,
      });

      if (error) {
        return new Response("Something went wrong", { status: 400 });
      }

      return new Response("Successfully followed", { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}

export async function GET(request: Request) {
  try {
    const user = await authenticate();
    if (user) {
      const supabase = await createClient();
      const following = await supabase
        .from("follows")
        .select(`following(id, first_name,middle_name,last_name, avatar)`)
        .eq("follower", user.id);
      const follower = await supabase
        .from("follows")
        .select(`follower(id, first_name, middle_name, last_name, avatar)`)
        .eq("following", user.id);

      const result = { following: following.data, follower: follower.data };

      return new Response(JSON.stringify(result), { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}

export async function DELETE(request: Request) {
  //unfollow a user
  try {
    const body = await request.json();
    const { following } = body;
    const user = await authenticate();

    if (user) {
      const supabase = await createClient();
      await supabase
        .from("follows")
        .delete()
        .eq("follower", user.id)
        .eq("following", following);

      return new Response("Successfully unfollowed", { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
