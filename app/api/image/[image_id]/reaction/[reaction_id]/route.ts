import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ image_id: string; reaction_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();

    const { image_id, reaction_id } = await params;

    const { error } = await supabase
      .from("reactions")
      .delete()
      .eq("image_id", image_id)
      .eq("id", reaction_id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Reaction successfully removed", { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
