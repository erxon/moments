"use client";

import { captilizeFirstLetter } from "@/lib/string.util";
import VisibilityIcon from "./visibility-icon";

export default function Visibility({ visibility }: { visibility: string }) {
  return (
    <div className="flex items-center gap-1 text-neutral-500">
      <VisibilityIcon visibility={visibility} />
      <p className="text-sm">{captilizeFirstLetter(visibility)}</p>
    </div>
  );
}
