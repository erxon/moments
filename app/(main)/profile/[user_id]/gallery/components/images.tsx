"use client";

import { fetcher } from "@/lib/swr.util";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import ImageType from "@/lib/types/image.types";
import ImageComponent from "./image";
import { ImageIcon } from "lucide-react";

export default function Images({
  user_id,
  gallery_id,
}: {
  user_id: string;
  gallery_id: string;
}) {
  const { data, isLoading, error } = useSWR(
    `/api/profile/${user_id}/gallery/images?gallery_id=${gallery_id}`,
    fetcher
  );

  if (error) {
    <div>Something went wrong.</div>;
  }
  if (isLoading) {
    return <Loading />;
  }

  const images = data as ImageType[];

  return (
    <>
      <div className="columns-1 md:columns-3 gap-4">
        {images && images.length > 0 ? (
          images.map((image) => <ImageComponent key={image.id} image={image} />)
        ) : (
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <ImageIcon className="w-4 h-4" />
            <p>This gallery is empty</p>
          </div>
        )}
      </div>
    </>
  );
}

function Loading() {
  return (
    <div className="columns-1 md:columns-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[300px] max-w-full object-full" />
      ))}
    </div>
  );
}
