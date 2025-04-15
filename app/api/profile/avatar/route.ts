import { imageUpload, imageDelete } from "@/lib/cloudinary.util";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/utils/supabase/server";
import { getProfileById } from "@/app/(main)/profile/components/profile-actions";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function PUT(request: Request) {
  //Delete current profile picture
  //Update current profile picture
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar_file") as File;

  const profile = await getProfileById(user.id);

  if (file) {
    try {
      if (profile.avatar) {
        //delete image
        await imageDelete(profile.avatar);
      }

      const url = await imageUpload(file);

      await supabase.from("profile").update({ avatar: url }).eq("id", user.id);

      return new Response("Profile picture successfully updated", {
        status: 200,
      });
    } catch (error) {
      return new Response("Something went wrong", { status: 400 });
    }
  }
}
