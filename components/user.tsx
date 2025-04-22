"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { avatarFallbackString } from "@/lib/string.util";
import Profile from "@/lib/types/profile.types";

export default function User({
  user_id,
  className,
}: {
  user_id: string;
  className?: string;
}) {
  const { data, isLoading, error } = useSWR(`/api/profile/${user_id}`, fetcher);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-[42px] h-[42px] rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[120px] h-4" />
        </div>
      </div>
    );
  }

  const profile = data[0] as Profile;

  return (
    <>
      <div className={className}>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {avatarFallbackString(profile.first_name!, profile.last_name!)}
            </AvatarFallback>
            <AvatarImage className="object-cover" src={profile.avatar} />
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-sm ">{profile.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}
