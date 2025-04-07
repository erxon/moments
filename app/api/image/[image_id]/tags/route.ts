import { createClient } from "@/utils/supabase/server";
import { authenticate } from "@/lib/auth.util";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const { image_id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("image_tags")
      .select("tag_id, tag_name")
      .eq("image_id", image_id);

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
