import Gallery from "@/lib/types/gallery.types";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import GalleryLink from "./gallery-link";
import { useState } from "react";

export default function MobileGallery({ galleries }: { galleries: Gallery[] }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-56" variant="secondary">
            Select gallery
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Your galleries</DialogTitle>
          <DialogDescription>Select a gallery to view images</DialogDescription>
          {galleries.length > 0 ? (
            <div className="flex flex-col">
              {galleries.map((gallery: Gallery) => (
                <GalleryLink
                  href={`/home/${gallery.id}`}
                  onClick={() => setOpen(false)}
                  key={gallery.id}
                  gallery={gallery}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              You have no galleries yet.
            </p>
          )}
          <DialogFooter className="mr-auto">
            <DialogClose>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
