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
      .from("reactions")
      .select("*")
      .eq("image_id", image_id);

    if (error) {
      return new Response(null, { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(null, { status: 400 });
    }
  }
}
