"use client";

import User from "@/components/user";
import Menu from "../menu";
import type ImageType from "@/lib/types/image.types";

export default function FeedHeader({
  image,
  className,
}: {
  image: ImageType;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <User user_id={image.user_id} className="mb-4" />
      <Menu image={image} />
    </div>
  );
}
