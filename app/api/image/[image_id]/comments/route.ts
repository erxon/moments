import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const { image_id } = await params;

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("image_id", image_id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const body = await request.json();
    const { image_id } = await params;
    const { comment } = body;
    console.log(body);
    const { error } = await supabase
      .from("comments")
      .insert({ user_id: user.id, image_id, comment: comment });

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Comment was added", { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
}
