import { createClient } from "@/utils/supabase/server";
import { authenticate } from "@/lib/auth.util";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const { image_id } = await params;
    const { id: user_id } = user;

    const { data, error } = await supabase
      .from("reactions")
      .select("*")
      .eq("image_id", image_id)
      .eq("user_id", user_id)
      .single();

    if (error) {
      return new Response(JSON.stringify(null), { status: 200 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(JSON.stringify(null), { status: 200 });
    }
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();

    const supabase = await createClient();

    const { image_id } = await params;
    const { id: user_id } = user;
    const body = await request.json();
    const { gallery_id } = body;

    const { data, error } = await supabase.from("reactions").insert({
      image_id,
      user_id,
      gallery_id,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response("You reacted to the post", { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
