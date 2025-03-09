"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { imageUpload } from "@/lib/image_upload.utils";
import { v2 as cloudinary } from "cloudinary";
import Profile from "@/lib/types/profile.types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getProfileById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profile").select().eq("id", id);

  if (error) {
    return encodedRedirect("error", "/protected", error.message);
  }

  return data[0] as Profile;
}

export async function createProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  const about = formData.get("about") as string;
  const avatar = formData.get("avatar") as File;

  if (about === "") {
    return encodedRedirect(
      "error",
      "/profile/new",
      "Please give a brief introduction about yourself"
    );
  }

  if (avatar) {
    const uploadAvatarURL = await imageUpload(avatar);

    if (uploadAvatarURL) {
      const { error } = await supabase.from("profile").insert({
        id: userId,
        about: about,
        avatar: uploadAvatarURL,
      });

      if (error) {
        return encodedRedirect("error", "/profile/new", error.message);
      }
    }
  } else {
    const { error } = await supabase.from("profile").insert({
      id: userId,
      about: about,
    });
    if (error) {
      return encodedRedirect("error", "/profile/new", error.message);
    }
  }

  return redirect("/protected");
}
