import { Image } from "lucide-react";

export default function Images() {
  return (
    <>
      <div className="flex items-center gap-1">
        <Image className="w-4 h-4 text-neutral-500" />
        <p className="text-neutral-500 text-sm">
          You have no images yet in this gallery
        </p>
      </div>
    </>
  );
}
