"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import type CommentType from "@/lib/types/comment.types";
import Comment from "@/components/comment";

export default function FeedComments({ image_id }: { image_id: string }) {
  const { data, isLoading, error } = useSWR(
    `/api/image/${image_id}/comments?number=1`,
    fetcher
  );

  if (error) {
    return <div>Something went wrong.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-[56px]" />
        <Skeleton className="w-full h-[56px]" />
      </div>
    );
  }

  return (
    <>
      <div>
        {data &&
          data.length > 0 &&
          data.map((comment: CommentType) => (
            <Comment key={comment.id} comment={comment} />
          ))}
      </div>
    </>
  );
}
