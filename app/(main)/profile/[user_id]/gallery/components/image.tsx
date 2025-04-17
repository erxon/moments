import ImageType from "@/lib/types/image.types";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import Image from "next/image";
import { Ellipsis, ImageIcon, MenuIcon, TagIcon } from "lucide-react";
import Tags from "@/app/(main)/image/components/tags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function ImageLayout({ image }: { image: ImageType }) {
  const router = useRouter();
  const createdAt = localeDateStringFormatter(
    new Date(image.created_at!).toLocaleDateString()
  );
  const timeCreated = localeTimeStringFormatter(
    new Date(image.created_at!).toLocaleTimeString()
  );

  return (
    <>
      <div className="mb-4 break-inside-avoid border rounded-lg">
        <div className="flex items-start justify-between p-2">
          <div className="mb-4">
            <p className="text-sm font-semibold">{image.title}</p>
            <p className="text-sm text-neutral-500">
              {createdAt} {timeCreated}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/image/${image.id}`);
                }}
              >
                <ImageIcon />
                View
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
      </div>
    </>
  );
}
