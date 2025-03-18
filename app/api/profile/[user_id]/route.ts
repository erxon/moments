import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const { user_id } = await params;

  try {
    const user = await authenticate();

    if (user) {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("profile")
        .select()
        .eq("id", user_id);

      if (error) {
        return new Response(error.message, { status: 400 });
      }

      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
