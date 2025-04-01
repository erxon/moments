"use client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/swr.util";
import { ChevronRight, Images } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import Gallery from "@/lib/types/gallery.types";
import MobileGallery from "./mobile-gallery-selection";
import GalleryLink from "./gallery-link";

export default function GallerySelection() {
  const { data, error, isLoading } = useSWR("/api/gallery", fetcher);

  if (error) return <div>Failed to load galleries</div>;
  if (isLoading)
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-[25px]" />
        <Skeleton className="w-full h-[25px]" />
        <Skeleton className="w-full h-[25px]" />
      </div>
    );

  const galleries: Gallery[] = data;

  return (
    <div>
      <div className="hidden lg:block">
        {galleries.length > 0 ? (
          <div className="flex flex-col gap-1">
            {galleries.map((gallery: Gallery) => (
              <GalleryLink key={gallery.id} gallery={gallery} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">You have no galleries yet.</p>
        )}
      </div>
      <div className="lg:hidden block">
        <MobileGallery galleries={galleries} />
      </div>
    </div>
  );
}
