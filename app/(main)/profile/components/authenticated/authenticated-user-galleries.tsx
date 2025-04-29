"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import { fetcher } from "@/lib/swr.util";
import type Gallery from "@/lib/types/gallery.types";
import { Globe, ImagesIcon, Lock, Pencil, Trash, Users } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import EditGalleryDialog from "./gallery/edit-gallery-dialog";
import visibilityDescription from "@/app/(main)/home/components/visibility-description";
import { captilizeFirstLetter } from "@/lib/string.util";

export default function AuthenticatedUserGalleries() {
  const { data, isLoading, error } = useSWR("/api/gallery", fetcher);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="lg:h-screen h-[350px]">
        <div className="flex flex-col gap-2">
          {data.map((gallery: Gallery) => (
            <Gallery key={gallery.id} gallery={gallery} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}

function Gallery({ gallery }: { gallery: Gallery }) {
  //Edit dialog
  //Delete dialog
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [galleryToModify, setGalleryToModify] = useState<Gallery>(gallery);

  const date = new Date(
    gallery.updated_at ? gallery.updated_at : gallery.created_at!
  );
  const dateString = localeDateStringFormatter(date.toLocaleDateString());
  const timeString = localeTimeStringFormatter(date.toLocaleTimeString());

  const handleEditClick = () => {
    setOpenEditDialog(true);
    setGalleryToModify(gallery);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    setGalleryToModify(gallery);
  };

  return (
    <>
      <div className="hover:bg-secondary rounded-lg p-2 px-4">
        <div className="flex gap-2">
          <div className="flex gap-2 grow items-center">
            <ImagesIcon className="w-4 h-4" />
            <p>{gallery.title}</p>
          </div>
          <div>
            <Button
              name="edit"
              onClick={handleEditClick}
              className="mr-1"
              size={"icon"}
              variant={"outline"}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              name="delete"
              onClick={handleDeleteClick}
              size={"icon"}
              variant={"outline"}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-500">
            {gallery.description.length > 60
              ? `${gallery.description.substring(0, 60)}...`
              : gallery.description}
          </p>
          <div className="flex gap-1 text-neutral-500 items-center">
            {gallery.visibility === "public" && <Globe className="w-4 h-4" />}
            {gallery.visibility === "private" && <Lock className="w-4 h-4" />}
            {gallery.visibility === "followers" && (
              <Users className="w-4 h-4" />
            )}
            <p className="text-sm text-neutral-500">
              {captilizeFirstLetter(gallery.visibility)}
            </p>
          </div>

          <p className="text-sm text-neutral-500">
            {gallery.updated_at
              ? `Last update ${dateString} ${timeString}`
              : `Created ${dateString} ${timeString}`}
          </p>
        </div>
      </div>

      {galleryToModify && (
        <>
          <EditGalleryDialog
            gallery={galleryToModify}
            open={openEditDialog}
            setOpen={setOpenEditDialog}
          />
        </>
      )}
    </>
  );
}
