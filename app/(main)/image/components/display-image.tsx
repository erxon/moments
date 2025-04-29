"use client";

import Image from "next/image";
import { TagIcon } from "lucide-react";
import Visibility from "@/components/visibility";

export default function DisplayImage({
  image,
  title,
  description,
  label,
}: {
  image: string;
  title: string;
  description: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Image
        className="rounded-lg"
        width={1000}
        height={1000}
        alt={description}
        src={image}
      />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
      <ImageLabel label={label} />
    </div>
  );
}

function ImageLabel({ label }: { label: string }) {
  return (
    <div className="flex gap-2 items-center">
      <TagIcon className="w-4 h-4 text-neutral-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
