"use client";

import { Globe, Image, Lock, UsersRound } from "lucide-react";

export default function VisibilityIcon({ visibility }: { visibility: string }) {
  if (visibility === "public") {
    return <Globe className="w-4 h-4" />;
  } else if (visibility === "private") {
    return <Lock className="w-4 h-4" />;
  } else if (visibility === "followers") {
    return <UsersRound className="w-4 h-4" />;
  }
  return <Image className="w-4 h-4" />;
}
