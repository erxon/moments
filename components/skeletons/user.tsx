import { Skeleton } from "../ui/skeleton";

export default function UserSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="w-[42px] h-[42px] rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-[100px] h-4" />
        <Skeleton className="w-[120px] h-4" />
      </div>
    </div>
  );
}
