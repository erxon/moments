"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import ImageType from "@/lib/types/image.types";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { TagIcon } from "lucide-react";
import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";
import Tags from "./tags";
import { useRouter } from "next/navigation";
import { set } from "react-hook-form";
import EditDialogForm from "./edit-dialog-form";
import DeleteDialog from "./delete-dialog";
import AddTag from "./add-tag";
import { captilizeFirstLetter } from "@/lib/string.util";
import VisibilityIcon from "@/components/visibility-icon";
import Visibility from "@/components/visibility";

export default function ImageComponent({
  image,
  gallery_id,
}: {
  image: ImageType;
  gallery_id: string;
}) {
  const router = useRouter();
  const [imageToManipulate, setImageToManipulate] = useState<ImageType | null>(
    null
  );
  const [isEditDialogFormOpen, setIsEditDialogFormOpen] =
    useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [addTagDialogOpen, setAddTagDialogOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const createdAt = localeDateStringFormatter(
    new Date(image.created_at!).toLocaleDateString()
  );
  const timeCreated = localeTimeStringFormatter(
    new Date(image.created_at!).toLocaleTimeString()
  );

  return (
    <>
      {imageToManipulate && (
        <>
          <EditDialogForm
            open={isEditDialogFormOpen}
            setOpenEditDialogForm={setIsEditDialogFormOpen}
            image={imageToManipulate}
            gallery_id={gallery_id}
          />
          <DeleteDialog
            open={isDeleteDialogOpen}
            setOpenDeleteDialog={setIsDeleteDialogOpen}
            image={imageToManipulate}
          />
          <AddTag
            open={addTagDialogOpen}
            setAddTagDialogOpen={setAddTagDialogOpen}
            image={imageToManipulate}
          />
        </>
      )}
      <div className="flex items-start justify-between p-2">
        <div className="mb-4">
          <p className="text-sm font-semibold">{image.title}</p>
          <p className="text-sm text-neutral-500">
            {createdAt} {timeCreated}
          </p>
          <Visibility visibility={image.visibility} />
        </div>
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger>
            <EllipsisIcon className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/image/${image.id}`);
              }}
            >
              <ImageIcon className="w-4 h-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenDropdown(false);
                setImageToManipulate(image);
                setIsEditDialogFormOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenDropdown(false);
                setImageToManipulate(image);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenDropdown(false);
                setImageToManipulate(image);
                setAddTagDialogOpen(true);
              }}
            >
              <TagIcon className="w-4 h-4" />
              Tags
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        alt={image.title}
        width={1000}
        height={1000}
        className="h-auto max-w-full object-full"
        src={image.path}
      />
      <div className="p-2">
        <div className="flex items-center gap-1 mb-4">
          <TagIcon className="w-4 h-4" />
          <p className="text-sm">{image.label}</p>
        </div>
        {/* Tags */}
        <Tags image_id={image.id} />
      </div>
    </>
  );
}
