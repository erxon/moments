"use client";

import Image from "next/image";
import ProfilePicturePlaceholder from "../lib/assets/profile-picture-placeholder.png";
import { UserIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ImageInput() {
  const [file, setFile] = useState<File | null>(null);

  function onSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="w-[120px] h-[120px] mb-4 flex items-center justify-center">
        {file ? (
          <Image
            src={file ? URL.createObjectURL(file) : ProfilePicturePlaceholder}
            width={1200}
            height={1200}
            className="w-[120px] h-[120px] object-cover rounded-full"
            alt="Profile Picture Placeholder"
          />
        ) : (
          <div className="outline outline-1 outline-neutral-500 w-[120px] h-[120px] flex items-center justify-center rounded-full">
            <UserIcon />
          </div>
        )}
      </div>
      <label
        className="text-center text-primary text-sm font-semibold"
        role="button"
        htmlFor="file"
      >
        Add a photo
      </label>
      <input
        onChange={onSelectFile}
        id="file"
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        hidden
      />
    </div>
  );
}
