// Get images by gallery_id
import { createClient } from "@/utils/supabase/server";
import { authenticate } from "@/lib/auth.util";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gallery_id: string }> }
) {
  try {
    const { gallery_id } = await params;
    const user = await authenticate();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("image")
      .select("*")
      .eq("gallery_id", gallery_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return new Response("No images found", { status: 404 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return new Response("Error fetching images", { status: 400 });
  }
}
