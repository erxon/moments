"use client";

import Gallery from "@/lib/types/gallery.types";
import { Check, ChevronsUpDown, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import GalleryLink from "./gallery-link";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";

export default function MobileGallery({
  galleries,
  path,
}: {
  galleries: Gallery[];
  path?: string;
}) {
  const router = useRouter();
  const { gallery_id } = useParams<{ gallery_id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  console.log(value === gallery_id, value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {!gallery_id
            ? value
              ? galleries.find(
                  (gallery) => Number(gallery.id) === Number(value)
                )?.title
              : "Select gallery"
            : galleries.find(
                (gallery) => Number(gallery.id) === Number(gallery_id)
              )?.title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search gallery..." />
          <CommandList>
            <CommandEmpty>Gallery not found</CommandEmpty>
            <CommandGroup>
              {galleries.map((gallery) => (
                <CommandItem
                  key={gallery.id}
                  value={gallery.id}
                  onSelect={(currentValue) => {
                    router.push(`${path}/${gallery.id}`);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      value === gallery.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Images
                    strokeWidth={1}
                    className="text-neutral-500 mr-2 w-4 h-4"
                  />
                  {gallery.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
