"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "@radix-ui/themes";
import Profile from "@/lib/types/profile.types";
import { avatarFallbackString } from "@/lib/string.util";

export default function UserAvatar({ user_id }: { user_id: string }) {
  const { data, isLoading, error } = useSWR(`/api/profile`, fetcher);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <Skeleton className="w-[24px] h-[24px] rounded-full" />;
  }

  const profile = data as Profile;

  return (
    <Avatar>
      <AvatarFallback>
        {avatarFallbackString(profile.first_name!, profile.last_name!)}
      </AvatarFallback>
      <AvatarImage className="object-cover" src={profile.avatar} />
    </Avatar>
  );
}
