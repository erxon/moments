import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const user = await authenticate();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const supabase = await createClient();

    if (query === null) {
      return new Response("Please enter a search term", { status: 400 });
    }

    const { data, error } = await supabase
      .from("profile")
      .select(
        `
        id,
        first_name,
        middle_name,
        last_name,
        email,
        avatar,
        about,
        created_at
        `
      )
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`);

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return new Response("Something went wrong", { status: 400 });
  }
}
