"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageTags, Tag } from "@/lib/types/tags.types";

export default function Tags({ image_id }: { image_id: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/image/${image_id}/tags`,
    fetcher
  );

  if (error) return <div>Failed to load tags</div>;
  if (isLoading) return <Skeleton className="w-full h-6" />;

  console.log(data);

  if (data.length === 0)
    return <p className="text-sm text-neutral-500">No tags</p>;

  const tags = data as ImageTags[];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.tag_id.id}
            className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full"
          >
            {tag.tag_id.name}
          </span>
        ))}
      </div>
    </div>
  );
}
