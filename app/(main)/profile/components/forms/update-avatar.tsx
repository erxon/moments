"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import ProfilePicturePlaceholder from "@/lib/assets/profile-picture-placeholder.png";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function UpdateAvatar({ avatar }: { avatar?: string }) {
  const [file, setFile] = useState<File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageSubmit = async (
    event?: React.FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();

    setIsLoading(true);

    if (file) {
      const result = await axios({
        method: "PUT",
        url: "/api/profile/avatar",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          avatar_file: file,
        },
      });

      if (result.status === 200) {
        toast.success(result.data, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      } else {
        toast.error(result.data, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 rounded-md">
      <div className="flex items-center gap-3">
        {!file ? (
          <Image
            alt="Profile picture"
            src={avatar ? avatar : ProfilePicturePlaceholder}
            width={1200}
            height={1200}
            className="w-24 h-24 object-cover rounded-full"
          />
        ) : (
          <Image
            alt="Profile picture"
            src={file && URL.createObjectURL(file)}
            width={1200}
            height={1200}
            className="w-24 h-24 object-cover rounded-full"
          />
        )}

        <form className="flex items-center gap-2" onSubmit={handleImageSubmit}>
          <Input
            name="avatar_file"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0])}
          />
          <Button disabled={isLoading} type="submit">
            {!isLoading ? "Save" : "Saving..."}
          </Button>
        </form>
      </div>
    </div>
  );
}
