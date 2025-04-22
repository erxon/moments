"use client";

import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import type ImageType from "@/lib/types/image.types";

export default function FeedContent({ image }: { image: ImageType }) {
  const dateCreated = localeDateStringFormatter(
    new Date(image.created_at!).toLocaleDateString()
  );

  const timeCreated = localeTimeStringFormatter(
    new Date(image.created_at).toLocaleTimeString()
  );
  return (
    <div>
      <h1 className="font-semibold">{image.title}</h1>
      <div>
        <p className="text-sm mb-1">{image.description}</p>
        <p className="text-xs text-neutral-500">
          {dateCreated} {timeCreated}
        </p>
      </div>
    </div>
  );
}
