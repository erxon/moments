import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

/**
 * Handles a GET request to verify if the authenticated user is following a specific user.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response indicating if the authenticated user is following the user with the specified ID.
 *
 * The function authenticates the user, extracts the 'id' search parameter from the request URL, and checks if there's a record in the 'follows' table where the authenticated user is the follower and the specified ID is the following. Returns "true" if a record exists, otherwise "false". If an error occurs, returns a 400 status with an error message.
 */

export async function GET(request: Request) {
  try {
    const user = await authenticate();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("follows")
      .select()
      .eq("follower", user.id)
      .eq("following", id);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      return new Response("true", { status: 200 });
    } else {
      return new Response("false", { status: 200 });
    }
  } catch (error) {
    return new Response("Something went wrong", { status: 400 });
  }
}
