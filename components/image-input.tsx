"use client";

import Image from "next/image";
import ProfilePicturePlaceholder from "../lib/assets/profile-picture-placeholder.png";
import { ImageUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function ImageInput({ name }: { name: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null | undefined>(null);

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function onSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  return (
    <div>
      <div>
        <Image
          src={file ? URL.createObjectURL(file) : ProfilePicturePlaceholder}
          width={1200}
          height={1200}
          className="w-[120px] h-[120px] object-cover rounded-full"
          alt="Profile Picture Placeholder"
        />
      </div>
      <label
        className="flex items-center text-primary"
        role="button"
        htmlFor="file"
      >
        <ImageUp className="mr-2" /> Add a photo
      </label>
      <input
        onChange={onSelectFile}
        name={name}
        id="file"
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        hidden
      />
    </div>
  );
}
