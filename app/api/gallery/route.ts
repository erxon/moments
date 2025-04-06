import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const user = await authenticate();

    const body = await request.json();
    const { title, description, visibility } = body;

    const supabase = await createClient();

    const { error } = await supabase.from("gallery").insert({
      user_id: user.id,
      title,
      description,
      visibility,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response("New gallery is successfully created", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
}

//Get all gallery
export async function GET(request: Request) {
  try {
    const user = await authenticate();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery")
      .select()
      .order("updated_at")
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
