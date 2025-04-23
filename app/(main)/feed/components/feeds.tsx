"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import ImageType from "@/lib/types/image.types";
import Feed from "./feed";
import { Image, ImagesIcon } from "lucide-react";
import FeedSkeleton from "@/components/skeletons/feed";

export default function Feeds() {
  const { data, isLoading, error } = useSWR("/api/feed", fetcher);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <FeedSkeleton />
        <FeedSkeleton />
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <>
      {/* Map Feed */}
      {data.length > 0 ? (
        data.map((feed: ImageType) => <Feed key={feed.id} image={feed} />)
      ) : (
        <div className="text-neutral-500 flex flex-col gap-4 items-center">
          <ImagesIcon />
          <p>Follow some users to see their images and galleries!</p>
        </div>
      )}
    </>
  );
}
