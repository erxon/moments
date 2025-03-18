import { getProfileById } from "@/app/(main)/profile/profile-actions";
import { createClient } from "@/utils/supabase/server";

async function authenticate() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    return null;
  }
}

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

export async function GET() {
  try {
    const user = await authenticate();
    if (user) {
      const profile = await getProfileById(user?.id);
      return new Response(JSON.stringify(profile), { status: 200 });
    } else {
      return new Response("Unauthorized", { status: 401 });
    }
  } catch (error) {
    return new Response("Something went wrong. Please try again later.", {
      status: 400,
    });
  }
}
