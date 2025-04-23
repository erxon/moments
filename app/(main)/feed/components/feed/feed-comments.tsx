"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import type CommentType from "@/lib/types/comment.types";
import Comment from "@/components/comment";
import CommentSkeleton from "@/components/skeletons/comment";

export default function FeedComments({ image_id }: { image_id: string }) {
  const { data, isLoading, error } = useSWR(
    `/api/image/${image_id}/comments?number=1`,
    fetcher
  );

  if (error) {
    return <div>Something went wrong.</div>;
  }

  if (isLoading) {
    return <CommentSkeleton />;
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
