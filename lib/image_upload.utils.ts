"use server";

import { v2 as cloudinary } from "cloudinary";

export async function imageToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  return buffer;
}

export async function imageUpload(file: File) {
  const { resources: avatar } = await cloudinary.api.resources_by_tag(
    "photo-gallery-users",
    { context: true }
  );

  const buffer = await imageToBuffer(file);
  //handle image upload here
  try {
    const uploadAvatarURL: string | undefined = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              tags: ["photo-gallery-users"],
            },
            function (error, result) {
              if (error) {
                reject(error);
                return;
              }
              resolve(result?.url);
            }
          )
          .end(buffer);
      }
    );
    return uploadAvatarURL;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}
