import { createClient } from "@/utils/supabase/server";
import { authenticate } from "@/lib/auth.util";

export async function GET(request: Request) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const { data, error } = await supabase.from("tags").select();

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const { name } = await request.json();

    const { data, error } = await supabase
      .from("tags")
      .insert({ name })
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
