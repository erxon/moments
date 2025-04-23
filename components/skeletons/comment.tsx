import { Skeleton } from "@radix-ui/themes";
import UserSkeleton from "./user";

export default function CommentSkeleton() {
  return (
    <div className="flex gap-4">
      <UserSkeleton />
      <div>
        <Skeleton className="w-full h-12" />
      </div>
    </div>
  );
}
