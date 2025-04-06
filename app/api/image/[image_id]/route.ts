import { createClient } from "@/utils/supabase/server";
import { authenticate } from "@/lib/auth.util";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();
    const { image_id } = await params;
    const { title, description, label, visibility } = await request.json();

    const { error } = await supabase
      .from("image")
      .update({
        title,
        description,
        label,
        visibility,
        updated_at: new Date().toISOString(),
      })
      .eq("id", image_id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Image updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating image:", error);
    return new Response("Error updating image", { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const supabase = await createClient();
    const { image_id } = await params;

    const { error } = await supabase
      .from("image")
      .delete()
      .eq("id", image_id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Image deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return new Response("Error deleting image", { status: 400 });
  }
}
