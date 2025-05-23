"use client";

import { Image as ImageIcon } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import ImageType from "@/lib/types/image.types";
import { Skeleton } from "@/components/ui/skeleton";
import ImageComponent from "./image";
import EditDialogForm from "./edit-dialog-form";
import DeleteDialog from "./delete-dialog";
import AddTag from "./add-tag";
import { useState } from "react";

function LoadImages({ gallery_id }: { gallery_id: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/gallery/${gallery_id}/images`,
    fetcher
  );

  if (error) return <NoImages />;
  if (isLoading) {
    return (
      <div className="columns-1 md:columns-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] max-w-full object-full" />
        ))}
      </div>
    );
  }

  const images = data as ImageType[];

  return (
    <>
      <div className="columns-1 md:columns-3 gap-4">
        {images.map((image) => {
          return (
            <div
              key={image.id}
              className="mb-4 break-inside-avoid border rounded-lg"
            >
              <ImageComponent image={image} gallery_id={gallery_id} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function GalleryImages({ gallery_id }: { gallery_id: string }) {
  return <LoadImages gallery_id={gallery_id} />;
}

function NoImages() {
  return (
    <div className="flex items-center gap-2">
      <ImageIcon className="w-4 h-4 text-neutral-500" />
      <p className="text-neutral-500 text-sm">No images yet</p>
    </div>
  );
}
