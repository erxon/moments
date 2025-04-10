"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import Gallery from "@/lib/types/gallery.types";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import { Skeleton } from "@/components/ui/skeleton";
import captilizeFirstLetter from "@/lib/string.util";
import { Globe, Image } from "lucide-react";
import { Lock } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Images from "./images";
import UploadImageButton from "./upload-image-button";

export default function GalleryView({ gallery_id }: { gallery_id: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/gallery/${gallery_id}`,
    fetcher
  );

  if (error) return <div>Something went wrong</div>;
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

  const gallery: Gallery = data[0];

  const createdAt = new Date(gallery.created_at!).toLocaleDateString();
  const updatedAt = new Date(gallery.updated_at!).toLocaleDateString();
  const timeUpdated = new Date(gallery.updated_at!).toLocaleTimeString();
  const visibility = captilizeFirstLetter(gallery.visibility);

  return (
    <>
      <div className="mb-8">
        <div className="mb-4 flex">
          <div className="grow">
            <div className="flex mb-2">
              <h1 className="text-3xl font-medium grow">{gallery.title}</h1>
              <UploadImageButton gallery_id={gallery_id} />
            </div>

            <p className="text-sm text-neutral-500">
              Created at {localeDateStringFormatter(createdAt)}{" "}
            </p>
            <p className="text-sm mb-1 text-neutral-500">
              Last updated {localeDateStringFormatter(updatedAt)}{" "}
              {localeTimeStringFormatter(timeUpdated)}
            </p>

            <div className="flex items-center gap-1 text-sm">
              <VisibilityIcon visibility={gallery.visibility} />
              <p>{visibility}</p>
            </div>
          </div>
        </div>
        <p className="mb-2">{gallery.description}</p>
      </div>
      <Images gallery_id={gallery_id} />
    </>
  );
}

function VisibilityIcon({ visibility }: { visibility: string }) {
  if (visibility === "public") {
    return <Globe className="w-4 h-4" />;
  } else if (visibility === "private") {
    return <Lock className="w-4 h-4" />;
  } else if (visibility === "followers") {
    return <UsersRound className="w-4 h-4" />;
  }
}
