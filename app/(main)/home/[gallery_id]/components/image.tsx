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
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";
import DeleteDialog from "./delete-dialog";
import EditDialogForm from "./edit-dialog-form";
import Tags from "./tags";
import AddTag from "./add-tag";

export default function ImageComponent({
  image,
  gallery_id,
}: {
  image: ImageType;
  gallery_id: string;
}) {
  const [isEditDialogFormOpen, setIsEditDialogFormOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<ImageType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<ImageType | null>(null);
  const [addTagDialogOpen, setAddTagDialogOpen] = useState<boolean>(false);
  const [imageToAddTag, setImageToAddTag] = useState<ImageType | null>(null);

  const createdAt = localeDateStringFormatter(
    new Date(image.created_at!).toLocaleDateString()
  );
  const timeCreated = localeTimeStringFormatter(
    new Date(image.created_at!).toLocaleTimeString()
  );

  return (
    <>
      <div className="flex items-start justify-between p-2">
        <div className="mb-4">
          <p className="text-sm font-semibold">{image.title}</p>
          <p className="text-sm text-neutral-500">
            {createdAt} {timeCreated}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisIcon className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <ImageIcon className="w-4 h-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setImageToEdit(image);
                setIsEditDialogFormOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setImageToDelete(image);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setImageToAddTag(image);
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

      {isEditDialogFormOpen && (
        <EditDialogForm
          open={isEditDialogFormOpen}
          setOpenEditDialogForm={setIsEditDialogFormOpen}
          image={imageToEdit!}
          gallery_id={gallery_id}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteDialog
          open={isDeleteDialogOpen}
          setOpenDeleteDialog={setIsDeleteDialogOpen}
          image={imageToDelete!}
        />
      )}
      {addTagDialogOpen && (
        <AddTag
          open={addTagDialogOpen}
          setAddTagDialogOpen={setAddTagDialogOpen}
          image={imageToAddTag!}
        />
      )}
    </>
  );
}
