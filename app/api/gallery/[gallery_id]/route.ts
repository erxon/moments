import { authenticate } from "@/lib/auth.util";
import { imageBulkDelete } from "@/lib/cloudinary.util";
import { createClient } from "@/utils/supabase/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gallery_id: string }> }
) {
  try {
    const { gallery_id } = await params;

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
  { params }: { params: Promise<{ gallery_id: string }> }
) {
  try {
    const { gallery_id } = await params;
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
  { params }: { params: Promise<{ gallery_id: string }> }
) {
  try {
    const { gallery_id } = await params;

    const user = await authenticate();

    const supabase = await createClient();

    //Delete images in the gallery
    const { data: galleryImages, error: errorFetchingGalleryImages } =
      await supabase
        .from("image")
        .select()
        .eq("user_id", user.id)
        .eq("gallery_id", gallery_id);

    if (galleryImages && galleryImages.length > 0) {
      await imageBulkDelete(`image-gallery-${gallery_id}`);

      const { error } = await supabase
        .from("image")
        .delete()
        .eq("gallery_id", gallery_id)
        .eq("user_id", user.id);

      if (error) {
        throw new Error(error.message);
      }
    }

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
      JSON.stringify({
        data: data,
        message: "Gallery was successfully deleted",
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
