import { Suspense } from "react";
import ImageView from "./image";
import { Skeleton } from "@/components/ui/skeleton";
import Comments from "../components/comments/comments";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params,
}: {
  params: Promise<{ image_id: string }>;
}) {
  const { image_id } = await params;
  return (
    <>
      <div className="lg:grid lg:grid-cols-6 flex flex-col gap-4">
        <div className="lg:col-span-4 px-4">
          <Suspense fallback={<Loading />}>
            <ImageView image_id={image_id} />
          </Suspense>
        </div>
        <div className="lg:col-span-2 px-2 mb-4">
          <Comments image_id={image_id} />
        </div>
      </div>
    </>
  );
}

function Loading() {
  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <div className="flex gap-2 items-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[230px] h-4" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[500px]" />
        <div className="flex gap-2">
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[100px] h-4" />
        </div>
      </div>
    </div>
  );
}
