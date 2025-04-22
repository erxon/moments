"use client";

import Reaction from "../feed-actions/reaction";
import CommentTrigger from "../feed-actions/comment-trigger";
import { Heart } from "lucide-react";
import ImageType from "@/lib/types/image.types";
import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@radix-ui/themes";

export default function FeedFooter({
  image,
  image_id,
  gallery_id,
}: {
  image: ImageType;
  image_id: string;
  gallery_id: string;
}) {
  return (
    <div>
      <div>
        <FeedReactions image_id={image_id} />
      </div>
      <div className="p-4 flex items-center gap-4">
        <Reaction image_id={image_id} gallery_id={gallery_id} />
        <CommentTrigger image={image} />
      </div>
    </div>
  );
}

function FeedReactions({ image_id }: { image_id: string }) {
  const { data, isLoading, error } = useSWR(
    `/api/image/${image_id}/reaction/reactions`,
    fetcher
  );

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <Skeleton className="w-[50px] h-4" />;
  }

  const reactions = data as any[];

  return (
    <>
      <div className="flex items-center gap-1 px-4">
        <Heart className="w-4 h-4" fill="red" strokeWidth={0} />
        <p className="text-xs">
          {reactions && reactions.length > 0
            ? `${reactions.length} liked this image`
            : "Be the first to like this post"}{" "}
        </p>
      </div>
    </>
  );
}
