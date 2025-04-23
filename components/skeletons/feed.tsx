import { Skeleton } from "../ui/skeleton";

export default function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[120px] h-4" />
          <Skeleton className="w-[100px] h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-[200px]" />
      <div className="flex gap-2 justify-between">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>
    </div>
  );
}
