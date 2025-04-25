import { createClient } from "@/utils/supabase/server";
import { authenticate } from "@/lib/auth.util";
import { v2 as cloudinary } from "cloudinary";
import { imageDelete } from "@/lib/cloudinary.util";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ image_id: string }> }
) {
  try {
    const user = await authenticate();
    const { image_id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("image")
      .select()
      .eq("id", image_id);

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}

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

    const { data: deletedImage, error } = await supabase
      .from("image")
      .delete()
      .eq("id", image_id)
      .eq("user_id", user.id)
      .select();

    if (deletedImage && deletedImage.length > 0) {
      //Delete the actual image in cloudinary
      await imageDelete(deletedImage[0].path, "image-gallery-app");
      const deletedImageGalleryId = deletedImage[0].gallery_id;

      const { data: numberOfImages, error: getImagesError } = await supabase
        .from("image")
        .select()
        .eq("gallery_id", deletedImageGalleryId)
        .eq("user_id", user.id);

      const total_images = numberOfImages?.length || 0;

      const { error: updatedGalleryError } = await supabase
        .from("gallery")
        .update({
          total_images: total_images,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("id", deletedImageGalleryId);

      if (updatedGalleryError || getImagesError) {
        console.error("Error getting images:", getImagesError);
        console.error("Error updating gallery:", updatedGalleryError);
        throw new Error("Something went wrong while deleting the image.");
      }
    }

    if (error) {
      throw new Error(error.message);
    }

    return new Response("Image deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return new Response("Error deleting image", { status: 400 });
  }
}
