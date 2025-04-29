"use server";

import { v2 as cloudinary } from "cloudinary";

export async function imageToBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  return buffer;
}

export async function imageToBase64(file: File) {
  const buffer = await imageToBuffer(file);
  return Buffer.from(buffer).toString("base64");
}

export async function imageUploadToCloudinary(
  file: File,
  folder: string,
  gallery_id: string
) {
  try {
    const buffer = await imageToBuffer(file);
    const uploadImageURL: string | undefined = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "image-gallery-app",
              tags: [`image-gallery-${gallery_id}`],
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

    return uploadImageURL;
  } catch (error) {
    throw new Error("Something went wrong");
  }
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

export async function getPublicIdFromUrl(url: string) {
  const splitUrl = url.split("/");
  const imageName = splitUrl[splitUrl.length - 1];
  const publicId = imageName.split(".")[0];

  return publicId;
}

export async function imageDelete(url: string, folder: string) {
  try {
    const splitUrl = url.split("/");
    const imageName = splitUrl[splitUrl.length - 1];
    const publicId = imageName.split(".")[0];

    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function avatarDelete(url: string) {
  try {
    const splitUrl = url.split("/");
    const imageName = splitUrl[splitUrl.length - 1];
    const publicId = imageName.split(".")[0];

    await cloudinary.uploader.destroy(`${publicId}`);
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function imageBulkDelete(tag: string) {
  try {
    await cloudinary.api.delete_resources_by_tag(tag);
    return true;
  } catch (error) {
    return false;
  }
}
