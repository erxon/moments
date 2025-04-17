"use client";

import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/swr.util";
import Profile from "@/lib/types/profile.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFallbackString } from "@/lib/string.util";

export default function User({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR(`/api/profile/${id}`, fetcher);

  if (error) {
    return <div>Something went wrong.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[230px] h-4" />
        </div>
      </div>
    );
  }

  const user = data[0] as Profile;

  return (
    <>
      <div className="flex gap-2">
        <div>
          <Avatar>
            <AvatarFallback>
              {avatarFallbackString(user.first_name!, user.last_name!)}
            </AvatarFallback>
            <AvatarImage src={user.avatar} className="object-cover" />
          </Avatar>
        </div>
        <div className="text-sm">
          <p className="font-medium">
            {user.first_name} {user.middle_name} {user.last_name}
          </p>
          <p className="text-neutral-500">{user.email}</p>
        </div>
      </div>
    </>
  );
}
