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
      .from("images_tags")
      .select(
        `
        id,
        image_id,
        user_id,
        tag_id (id, name)
        `
      )
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const { image_id } = await params;
    const { searchParams } = new URL(request.url);
    const tag_id = searchParams.get("tag_id");
    const supabase = await createClient();

    const { error } = await supabase
      .from("images_tags")
      .delete()
      .eq("image_id", image_id)
      .eq("tag_id", tag_id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Tag successfully removed", { status: 200 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const { image_id } = await params;
    const { name, tag_id } = await request.json();
    const supabase = await createClient();

    if (name) {
      const { data, error } = await supabase
        .from("tags")
        .insert({ name })
        .select("*");
      if (data) {
        const tag_id = data[0].id as string;
        await addTagToImage(image_id, tag_id, user.id);
      }
    }

    if (tag_id) {
      const data = await checkForExistingImageTagPair(image_id, tag_id);
      if (!data) {
        await addTagToImage(image_id, tag_id, user.id);
      }
    }

    return new Response("Tag successfully added", { status: 200 });
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}

async function checkForExistingImageTagPair(image_id: string, tag_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("images_tags")
    .select("*")
    .eq("image_id", image_id)
    .eq("tag_id", tag_id);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length > 0) {
    throw new Error("Tag already exists in the image");
  }

  return data;
}

async function addTagToImage(
  image_id: string,
  tag_id: string,
  user_id: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from("images_tags").insert({
    image_id,
    tag_id,
    user_id: user_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return new Response("Tag successfully added to the image", { status: 200 });
}
