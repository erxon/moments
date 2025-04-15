"use client";

import { fetcher } from "@/lib/swr.util";
import useSWR from "swr";
import Profile from "@/lib/types/profile.types";
import Image from "next/image";
import Socials from "./socials";
import AuthenticatedUserFollows from "./authenticated-user-follows";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageIcon, PencilIcon } from "lucide-react";
import { localeDateStringFormatter } from "@/lib/date.util";
import LoadErrorMessage from "@/components/load-error-message";
import { UsersRoundIcon } from "lucide-react";
import { PenLine } from "lucide-react";

/*
TODO:
[ ] Add followers in the basic info
*/

export default function AuthenticatedUserProfile() {
  const { data, error, isLoading } = useSWR("/api/profile", fetcher);
  const router = useRouter();

  if (error) return <LoadErrorMessage>Failed to load profile</LoadErrorMessage>;
  if (isLoading) return <Loading />;

  const profile = data as Profile;
  const joined = new Date(profile.created_at!);

  return (
    <div className="p-3">
      <div className="grid lg:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="mb-5 flex items-center">
            <h1 className="text-xl font-semibold grow">
              Hi {profile.first_name}!
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push("/profile/update");
              }}
              className="gap-2"
            >
              Edit
              <PencilIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="mb-4">
            <div className="aspect-square w-[120px] h-[120px] mb-3">
              {data.avatar ? (
                <Image
                  src={data.avatar}
                  alt="Profile Picture"
                  className="w-full h-full object-cover rounded-lg"
                  width={1200}
                  height={1200}
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-neutral-200 flex flex-col items-center justify-center">
                  {" "}
                  <ImageIcon className="text-neutral-500 mb-2" />{" "}
                  <p className="text-sm text-neutral-500">Profile Photo</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-medium">
                {profile.first_name}{" "}
                {profile.middle_name ? profile.middle_name : ""}{" "}
                {profile.last_name}
              </p>
              <p className="text-neutral-500 text-sm">{profile.email}</p>
              <p className="text-neutral-500 text-sm">
                Joined on{" "}
                {localeDateStringFormatter(joined.toLocaleDateString())}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 outline outline-1 outline-neutral-200 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4" />
              <p className="font-semibold">Bio</p>
            </div>
            <p className="text-sm">{profile.about}</p>
          </div>
          <div className="flex flex-col gap-2 outline outline-1 outline-neutral-200 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <UsersRoundIcon className="w-4 h-4" />
              <p className="font-medium">Socials</p>
            </div>
            <Socials user_id={profile.id} />
          </div>
          <AuthenticatedUserFollows />
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="p-3 grid lg:grid-cols-4">
      <div className="col-span-2 flex flex-col gap-4">
        <Skeleton className="w-[120px] h-[120px] object-cover rounded-full mb-3" />
        <Skeleton className="w-[200px] h-[25px]" />
        <Skeleton className="w-[300px] h-[25px]" />

        <Skeleton className="w-full h-[170px]" />
        <Skeleton className="w-full h-[170px]" />
      </div>
    </div>
  );
}
