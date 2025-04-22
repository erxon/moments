import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import type ImageType from "@/lib/types/image.types";
import { EllipsisIcon } from "lucide-react";

export default function Menu({ image }: { image: ImageType }) {
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/image/${image.id}`);
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/profile/${image.user_id}/gallery`);
            }}
          >
            Gallery
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
