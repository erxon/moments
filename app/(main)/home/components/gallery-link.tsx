"use client";

import Link from "next/link";
import { Images, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Gallery from "@/lib/types/gallery.types";
import { SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import clsx from "clsx";

export default function GalleryLink({
  href,
  gallery,
  onClick,
}: {
  href: string;
  gallery: Gallery;
  onClick?: any;
}) {
  const { gallery_id } = useParams<{ gallery_id: string }>();

  return (
    <Link
      onClick={onClick}
      href={href}
      key={gallery.id}
      className={clsx(
        "p-2 hover:bg-secondary border-neutral-100 flex items-center rounded-lg",
        Number(gallery_id) === Number(gallery.id) && "bg-secondary"
      )}
    >
      <Images strokeWidth={1} className="text-neutral-500 mr-2 w-4 h-4" />
      <p className="grow text-sm">{gallery.title}</p>
    </Link>
  );
}
