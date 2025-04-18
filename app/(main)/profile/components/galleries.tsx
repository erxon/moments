"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import Gallery from "@/lib/types/gallery.types";
import GalleryLink from "../../home/components/gallery-link";

export default function Galleries({ user_id }: { user_id: string }) {
  const { data, isLoading, error } = useSWR(
    `/api/profile/${user_id}/gallery/limit?number=3`,
    fetcher
  );

  if (error) {
    <div className="text-neutral-300">Something went wrong</div>;
  }

  if (isLoading) {
    <div className="flex gap-2">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
    </div>;
  }

  const galleries = data as Gallery[];

  return (
    <>
      <div>
        <h1 className="text-md font-medium">Galleries</h1>
        {galleries && galleries.length > 0 ? (
          <div className="flex flex-col gap-1">
            {galleries.map((gallery: Gallery) => (
              <GalleryLink
                href={`/profile/${user_id}/gallery/${gallery.id}`}
                key={gallery.id}
                gallery={gallery}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            This user has no galleries yet.
          </p>
        )}
      </div>
    </>
  );
}
