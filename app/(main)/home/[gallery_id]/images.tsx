import {
  EllipsisIcon,
  Image as ImageIcon,
  MenuIcon,
  TagIcon,
} from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import ImageType from "@/lib/types/image.types";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Images({ gallery_id }: { gallery_id: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/gallery/${gallery_id}/images`,
    fetcher
  );

  if (error) return <div>Something went wrong</div>;
  if (isLoading) return <div>Loading...</div>;

  const images = data as ImageType[];

  return (
    <>
      <div className="flex items-center gap-1">
        {data.length > 0 ? (
          <div className="columns-1 md:columns-3 gap-4">
            {data.map((image: ImageType) => {
              const createdAt = localeDateStringFormatter(
                new Date(image.created_at!).toLocaleDateString()
              );
              const timeCreated = localeTimeStringFormatter(
                new Date(image.created_at!).toLocaleTimeString()
              );

              return (
                <div
                  key={image.id}
                  className="mb-4 break-inside-avoid border rounded-lg"
                >
                  <div className="flex items-start justify-between p-2">
                    <div className="mb-4">
                      <p className="text-sm font-semibold">{image.title}</p>
                      <p className="text-sm text-neutral-500">
                        {createdAt} {timeCreated}
                      </p>
                    </div>
                    <Button variant="ghost" size={"sm"}>
                      <EllipsisIcon />
                    </Button>
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
                    <div className="font-medium p-1 px-2 rounded-full bg-blue-500 text-white text-xs w-fit">
                      Item tag
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <ImageIcon className="w-4 h-4 text-neutral-500" />
            <p className="text-neutral-500 text-sm">
              You have no images yet in this gallery
            </p>
          </div>
        )}
      </div>
    </>
  );
}
