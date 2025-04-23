"use client";

import type Profile from "@/lib/types/profile.types";
import Image from "next/image";
import Socials from "./socials";
import Follows from "./follows";
import { useRouter } from "next/navigation";
import { ImageIcon, PencilIcon, PlusIcon, UserMinus } from "lucide-react";
import { localeDateStringFormatter } from "@/lib/date.util";
import { UsersRoundIcon } from "lucide-react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import { useState } from "react";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import Galleries from "./galleries";

export default function Profile({ user_id }: { user_id: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useSWR(`/api/profile/${user_id}`, fetcher);

  if (isLoading) {
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

  if (error) {
    return <div>Failed to load profile</div>;
  }

  const profile = data[0] as Profile;

  const joined = new Date(profile.created_at!);

  return (
    <div className="p-3">
      <div className="md:grid lg:grid-cols-8 gap-4">
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="mb-4">
            <div className="flex flex-col md:flex-row items-center md:justify-between md:items-start">
              <div className="aspect-square w-[120px] h-[120px] mb-3">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
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
              <FollowButton profile={profile} />
            </div>
            <div className="flex flex-col items-center md:block mt-4 md:mt-0">
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
          <Follows user_id={profile.id} />
        </div>
        <div className="md:col-span-3 mt-4 md:mt-0">
          <Galleries user_id={profile.id!} />
        </div>
      </div>
    </div>
  );
}

function FollowButton({ profile }: { profile: Profile }) {
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const { data, isLoading, error } = useSWR(
    `/api/follows?id=${profile.id}`,
    fetcher
  );

  if (error) {
    <div className="text-neutral-500">Something went wrong</div>;
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-[100px] h-8" />
      </div>
    );
  }

  const handleFollow = async () => {
    setIsButtonLoading(true);
    try {
      const result = await axios.post("/api/profile/follows", {
        following: profile.id,
      });

      if (result.status === 200) {
        mutate(`/api/follows?id=${profile.id}`);
        mutate(`/api/profile/${profile.id}/follows`);

        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
    setIsButtonLoading(false);
  };

  const handleUnfollow = async () => {
    setIsButtonLoading(true);
    try {
      const result = await axios.delete("/api/profile/follows", {
        data: { following: profile.id },
      });

      if (result.status === 200) {
        mutate(`/api/follows?id=${profile.id}`);
        mutate(`/api/profile/${profile.id}/follows`);

        triggerSuccessToast("User unfollowed");
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
    setIsButtonLoading(false);
  };

  const isAlreadyFollowed = data as boolean;

  return (
    <>
      {!isAlreadyFollowed ? (
        <Button
          disabled={isButtonLoading}
          onClick={handleFollow}
          className=""
          size={"sm"}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {!isButtonLoading ? "Follow" : "Following..."}
        </Button>
      ) : (
        <Button
          onClick={handleUnfollow}
          className=""
          variant={"secondary"}
          size={"sm"}
          disabled={isButtonLoading}
        >
          <UserMinus className="w-4 h-4 mr-2" />
          {!isButtonLoading ? "Unfollow" : "Unfollowing..."}
        </Button>
      )}
    </>
  );
}
