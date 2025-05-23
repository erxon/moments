"use client";

import triggerErrorToast from "@/components/toast/trigger-error-toast";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Gallery from "@/lib/types/gallery.types";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { mutate } from "swr";

export default function DeleteGalleryDialog({
  open,
  setOpen,
  gallery,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gallery: Gallery;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await axios.delete(`/api/gallery/${gallery.id}`);

      if (result.status === 200) {
        setOpen(false);
        mutate(`/api/gallery`);
        triggerSuccessToast(result.data.message);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error && error instanceof AxiosError) {
        triggerErrorToast(error.response!.data);
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this gallery?
          </DialogTitle>
          <DialogDescription>
            {`You will delete "${gallery.title}" gallery. This action cannot be
            undone`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-1 lg:gap-0">
          <DialogClose asChild>
            <Button variant={"secondary"} size={"sm"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"sm"}
            onClick={handleConfirm}
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
