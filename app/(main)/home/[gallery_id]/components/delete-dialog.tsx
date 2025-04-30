import ImageType from "@/lib/types/image.types";
import { useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteDialog({
  open,
  setOpenDeleteDialog,
  image,
}: {
  setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  image: ImageType;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await axios.delete(`/api/image/${image.id}`);
      if (result.status === 200) {
        mutate(`/api/gallery/${image.gallery_id}/images`);
        setOpenDeleteDialog(false);
        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast("Error deleting image");
      }
    } catch (error) {
      if (error instanceof Error) {
        triggerErrorToast(error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpenDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete image</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-1 lg:gap-0">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isLoading}
          >
            {!isLoading ? "Delete" : "Deleting..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
