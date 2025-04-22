"use client";

import Image from "next/image";
import type ImageType from "@/lib/types/image.types";

export default function FeedImage({ image }: { image: ImageType }) {
  return (
    <div>
      <Image
        width={1000}
        height={1000}
        className="h-[300px] object-contain bg-neutral-100"
        src={image.path}
        alt={image.title}
      />
    </div>
  );
}
