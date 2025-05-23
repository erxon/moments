import { getProfileById } from "@/app/(main)/profile/components/profile-actions";
import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

/**
 * Handles a POST request to follow a user.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response indicating if the authenticated user is following the user with the specified ID.
 *
 * The function authenticates the user, extracts the 'following' JSON payload from the request, and checks if there's a record in the 'follows' table where the authenticated user is the follower and the specified ID is the following. If a record exists, returns a 400 status with an error message. Otherwise, it inserts a new record in the 'follows' table and returns a 200 status with a success message. If an error occurs, returns a 400 status with an error message.
 */
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

/**
 * Handles a GET request to retrieve the users that the authenticated user is following, and also the users that are following the authenticated user.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response containing the following and follower information of the authenticated user in JSON format.
 *
 * The function authenticates the user and fetches the following and follower information from the 'follows' table in the database. If an error occurs, it returns a 400 status with an error message.
 */
export async function GET(request: Request) {
  try {
    const user = await authenticate();
    if (user) {
      const supabase = await createClient();
      const following = await supabase
        .from("follows")
        .select(
          `following(id, first_name,middle_name,last_name, email, avatar)`
        )
        .eq("follower", user.id);
      const follower = await supabase
        .from("follows")
        .select(
          `follower(id, first_name, middle_name, last_name, email, avatar)`
        )
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
