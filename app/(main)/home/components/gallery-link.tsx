import Link from "next/link";
import { Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Gallery from "@/lib/types/gallery.types";
import { SetStateAction } from "react";

export default function GalleryLink({
  gallery,
  onClick,
}: {
  gallery: Gallery;
  onClick?: any;
}) {
  return (
    <Link
      onClick={onClick}
      href={`/home/${gallery.id}`}
      key={gallery.id}
      className="p-2 hover:bg-neutral-100 border-neutral-100 flex items-center rounded-lg"
    >
      <Images strokeWidth={1} className="text-neutral-500 mr-2 w-4 h-4" />
      <p className="grow text-sm">{gallery.title}</p>
      <Badge variant="secondary">0</Badge>
    </Link>
  );
}
