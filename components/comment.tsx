"use client";

import User from "./user";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import type Comment from "@/lib/types/comment.types";
import { Separator } from "./ui/separator";

export default function Comment({ comment }: { comment: Comment }) {
  const createdAtDate = localeDateStringFormatter(
    new Date(comment.created_at!).toLocaleDateString()
  );

  const createdAtTime = localeTimeStringFormatter(
    new Date(comment.created_at!).toLocaleTimeString()
  );

  return (
    <>
      <div className="mb-2">
        <User user_id={comment.user_id!} />
        <p className="text-sm mt-4">{comment.comment}</p>
        <p className="text-xs text-neutral-500">
          {createdAtDate} {createdAtTime}
        </p>
      </div>
      <Separator />
    </>
  );
}
