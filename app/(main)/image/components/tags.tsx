"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "@/lib/types/tags.types";

interface ImagesTags {
  id: string;
  image_id: string;
  tag_id: Tag;
  user_id: string;
}

export default function Tags({ image_id }: { image_id: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/image/${image_id}/tags`,
    fetcher
  );

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <Skeleton className="w-[100px] h-4" />
        <Skeleton className="w-[80px] h-4" />
        <Skeleton className="w-[120px] h-4" />
      </div>
    );
  }

  const tags = data as ImagesTags[];

  return (
    <>
      <div className="flex gap-2">
        {tags.map((tag) => (
          <div
            key={tag.tag_id.id}
            className="bg-secondary text-sm p-1 px-2 rounded-full"
          >
            {tag.tag_id.name}
          </div>
        ))}
      </div>
    </>
  );
}
