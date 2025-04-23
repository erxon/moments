"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import Gallery from "@/lib/types/gallery.types";
import GalleryLink from "../../../../home/components/gallery-link";
import { UsersIcon } from "lucide-react";
import MobileGallery from "@/app/(main)/home/components/mobile-gallery-selection";

interface Galleries {
  public: Gallery[];
  followers: Gallery[];
}

export default function Galleries({ user_id }: { user_id: string }) {
  const { data, isLoading, error } = useSWR(
    `/api/profile/${user_id}/gallery`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div>
        <div className="mb-8 flex flex-col gap-2">
          <Skeleton className="w-56 h-6" />
          <Skeleton className="w-64 h-6" />
          <Skeleton className="w-64 h-6" />
        </div>
      </div>
    );

  const galleries = data as Galleries;

  const mobileGallerySelection = [...galleries.followers, ...galleries.public];

  return (
    <>
      <div className="md:hidden block mt-2 mb-4">
        <MobileGallery
          path={`/profile/${user_id}/gallery`}
          galleries={mobileGallerySelection}
        />
      </div>

      <div className="hidden md:block">
        <div className="mb-4">
          {galleries.public.length > 0 ? (
            <div className="flex flex-col gap-1">
              {galleries.public.map((gallery: Gallery) => (
                <GalleryLink
                  href={`/profile/${user_id}/gallery/${gallery.id}`}
                  key={gallery.id}
                  gallery={gallery}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              This user has now galleries yet
            </p>
          )}
        </div>
        <div>
          {galleries.followers.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <UsersIcon className="w-4 h-4" />
                <h3 className="text-md">For followers</h3>
              </div>
              {galleries.followers.map((gallery: Gallery) => (
                <GalleryLink
                  href={`/profile/${user_id}/gallery/${gallery.id}`}
                  key={gallery.id}
                  gallery={gallery}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
