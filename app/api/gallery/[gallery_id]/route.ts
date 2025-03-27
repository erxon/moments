import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { gallery_id: string } }
) {
  try {
    const { gallery_id } = params;

    const user = await authenticate();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", gallery_id);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { gallery_id: string } }
) {
  try {
    const { gallery_id } = params;
    const body = await request.json();
    const { title, description, visibility } = body;

    const user = await authenticate();

    const supabase = await createClient();

    const { error } = await supabase
      .from("gallery")
      .update({
        title,
        description,
        visibility,
        updated_at: new Date().toISOString(),
      })
      .eq("id", gallery_id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Gallery was successfully updated", { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { gallery_id: string } }
) {
  try {
    const { gallery_id } = params;

    const user = await authenticate();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery")
      .delete()
      .eq("user_id", user.id)
      .eq("id", gallery_id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({ data: data, message: "Successfully deleted" }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
