import { ImagesIcon } from "lucide-react";

export default function Page() {
  return (
    <div>
      <h1 className="text-lg font-medium">Your gallery</h1>
      <div className="flex items-center gap-2">
        <ImagesIcon className="w-4 h-4 text-neutral-500" />
        <p className="text-neutral-500">Select a gallery to view your images</p>
      </div>
    </div>
  );
}
