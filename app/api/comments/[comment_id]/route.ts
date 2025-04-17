import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ comment_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const body = await request.json();
    const { comment_id } = await params;
    const { comment } = body;

    const { error } = await supabase
      .from("comments")
      .update({
        comment: comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", comment_id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Comment updated", { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ comment_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const { comment_id } = await params;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", comment_id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Comment deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
}
