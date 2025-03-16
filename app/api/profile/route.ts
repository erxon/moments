import { createClient } from "@/utils/supabase/server";

/**
 * @description
 * Updates the profile of the currently authenticated user.
 *
 * @param {Request} request
 * @returns {Response}
 * @throws {Response} with status 400 if the request body is missing
 *                     required fields (first_name, last_name)
 * @throws {Response} with status 400 if the supabase update operation fails
 */

export async function POST(request: Request) {
  const body = await request.json();
  const { first_name, middle_name, last_name, about } = body;

  if (!first_name || !last_name) {
    return new Response("First name and last name are required", {
      status: 400,
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profile")
    .update({
      first_name,
      middle_name,
      last_name,
      about,
    })
    .eq("id", user?.id);

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response("Profile updated successfully", {
    status: 200,
  });
}
