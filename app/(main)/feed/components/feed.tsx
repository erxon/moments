"use client";

import ImageType from "@/lib/types/image.types";
import FeedImage from "./feed/feed-image";
import FeedContent from "./feed/feed-content";
import FeedComments from "./feed/feed-comments";
import FeedHeader from "./feed/feed-header";
import FeedFooter from "./feed/feed-footer";

export default function Feed({ image }: { image: ImageType }) {
  return (
    <div className="rounded-lg border mb-4">
      <div className="p-4 flex flex-col gap-4">
        <FeedHeader image={image} />
        <FeedContent image={image} />
      </div>
      <FeedImage image={image} />
      <div className="flex flex-col gap-2 p-4">
        <FeedFooter
          image={image}
          image_id={image.id}
          gallery_id={image.gallery_id}
        />
        <FeedComments image_id={image.id} />
      </div>
    </div>
  );
}
