import { authenticate } from "@/lib/auth.util";
import { imageUploadToCloudinary } from "@/lib/cloudinary.util";
import { createClient } from "@/utils/supabase/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File;

  try {
    const user = await authenticate();
    const supabase = await createClient();
    const gallery_id = formData.get("gallery_id")?.toString()!;
    const url = await imageUploadToCloudinary(
      file,
      "image-gallery-app",
      gallery_id
    );

    const data = {
      user_id: user.id,
      gallery_id: gallery_id,
      title: formData.get("title")?.toString(),
      description: formData.get("description")?.toString(),
      label: formData.get("label")?.toString(),
      visibility: formData.get("visibility")?.toString(),
      path: url,
    };

    const { error } = await supabase.from("image").insert({
      ...data,
    });

    const { data: images, error: getImagesError } = await supabase
      .from("image")
      .select("*")
      .eq("gallery_id", data.gallery_id)
      .eq("user_id", user.id);

    const imagesCount = images?.length || 0;

    const { error: updateGalleryError } = await supabase
      .from("gallery")
      .update({
        total_images: imagesCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.gallery_id)
      .eq("user_id", user.id);

    if (error || getImagesError || updateGalleryError) {
      console.log("Error inserting image:", error);
      console.log("Error getting images:", getImagesError);
      console.log("Error updating gallery:", updateGalleryError);
      throw new Error("Something went wrong while uploading the image.");
    }

    return new Response("Image uploaded successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response("Error uploading image", { status: 400 });
  }
}

export async function GET(request: Request) {}
