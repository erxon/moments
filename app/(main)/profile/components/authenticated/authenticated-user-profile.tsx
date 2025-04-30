"use client";

import { fetcher } from "@/lib/swr.util";
import useSWR from "swr";
import Profile from "@/lib/types/profile.types";
import Image from "next/image";
import Socials from "../socials";
import AuthenticatedUserFollows from "./authenticated-user-follows";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowDown, ChevronsUpDown, ImageIcon, PencilIcon } from "lucide-react";
import { localeDateStringFormatter } from "@/lib/date.util";
import LoadErrorMessage from "@/components/load-error-message";
import { UsersRoundIcon } from "lucide-react";
import { PenLine } from "lucide-react";
import AuthenticatedUserGalleries from "./authenticated-user-galleries";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
      <div className="lg:grid lg:grid-cols-8 lg:gap-4">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="mb-5 flex flex-col lg:flex-row lg:items-center">
            <h1 className="text-2xl font-semibold grow text-center mb-4 lg:text-start lg:mb-0">
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
          <div className="mb-4 flex flex-col items-center lg:block">
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
            <div className="flex flex-col items-center md:block">
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
          <div className="flex flex-col gap-2 outline outline-1 outline-neutral-200 md:p-4 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4" />
              <p className="font-semibold">Bio</p>
            </div>
            <p className="text-sm">{profile.about}</p>
          </div>
          <div className="flex flex-col gap-2 outline outline-1 outline-neutral-200 md:p-4 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <UsersRoundIcon className="w-4 h-4" />
              <p className="font-medium">Socials</p>
            </div>
            <Socials user_id={profile.id} />
          </div>
          <AuthenticatedUserFollows />
        </div>
        <div className="lg:col-span-3 mt-8">
          <h1 className="text-xl font-medium hidden lg:block">Galleries</h1>
          <div className="hidden lg:block">
            <AuthenticatedUserGalleries />
          </div>
          <div className="lg:hidden">
            <CollapsibleGalleries />
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleGalleries() {
  return (
    <Collapsible>
      <div className="flex items-center justify-between">
        <p className="font-medium text-xl">Galleries</p>
        <CollapsibleTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <ChevronsUpDown className="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <AuthenticatedUserGalleries />
      </CollapsibleContent>
    </Collapsible>
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
