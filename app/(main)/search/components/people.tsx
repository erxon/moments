import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import type Profile from "@/lib/types/profile.types";
import { localeDateStringFormatter } from "@/lib/date.util";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import { useState } from "react";

export default function People({ query }: { query: string | null }) {
  const [loadAfterFollow, setLoadAfterFollow] = useState<boolean>(false);

  const router = useRouter();
  //useSWR to fetch profiles
  const { data, error, isLoading } = useSWR(
    `/api/profile/search?query=${query}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="flex gap-2 items-center">
        <Skeleton className="w-[50px] h-[50px] rounded-full" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="w-full h-[25px]" />
          <Skeleton className="w-full h-[25px]" />
        </div>
      </div>
    );
  //display profiles
  const profiles = data as Profile[];

  const handleFollow = async (id?: string) => {
    setLoadAfterFollow(true);
    try {
      const result = await axios.post("/api/profile/follows", {
        following: id,
      });

      if (result.status === 200) {
        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
    setLoadAfterFollow(false);
  };

  return (
    <>
      {profiles.map((profile) => {
        return <Profile key={profile.id} profile={profile} />;
      })}
    </>
  );
}

function Profile({ profile }: { profile: Profile }) {
  const router = useRouter();
  const joined = localeDateStringFormatter(
    new Date(profile.created_at!).toLocaleDateString()
  );

  return (
    <div className="flex gap-4 items-start p-2">
      <div>
        <Avatar>
          <AvatarFallback>
            {profile.first_name
              ?.charAt(0)
              .concat(profile.last_name!.charAt(0))
              .toUpperCase()}
          </AvatarFallback>
          <AvatarImage className="object-cover" src={profile.avatar} />
        </Avatar>
      </div>
      <div className="w-full md:w-[200px]">
        <p className="text-sm font-medium">
          {profile.first_name} {profile.middle_name} {profile.last_name}
        </p>
        <p className="text-sm text-neutral-500">{profile.email}</p>
        <p className="text-sm text-neutral-500 mb-2">Joined at {joined}</p>
        <div className="w-full flex gap-2">
          <Button
            onClick={() => router.push(`/profile/${profile.id}`)}
            variant="outline"
            size={"sm"}
            className="flex-auto"
          >
            View
          </Button>
          <FollowButton className="flex-auto" id={profile.id!} />
        </div>
      </div>
    </div>
  );
}

function FollowButton({ id, className }: { id: string; className?: string }) {
  const [loadAfterFollow, setLoadAfterFollow] = useState<boolean>(false);

  const { data, isLoading, error } = useSWR(`/api/follows?id=${id}`, fetcher);

  if (error) return <div>Failed to load data</div>;
  if (isLoading) return <Skeleton className="w-full" />;

  const result = data as boolean;

  const handleFollowClick = async (id?: string) => {
    setLoadAfterFollow(true);

    if (!result) {
      await handleFollow(id);
    } else {
      await handleUnfollow(id);
    }

    setLoadAfterFollow(false);
  };

  const handleFollow = async (id?: string) => {
    try {
      const result = await axios.post("/api/profile/follows", {
        following: id,
      });

      if (result.status === 200) {
        mutate(`/api/follows?id=${id}`);
        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
  };

  const handleUnfollow = async (id?: string) => {
    try {
      const result = await axios.delete("/api/profile/follows", {
        data: { following: id },
      });

      if (result.status === 200) {
        mutate(`/api/follows?id=${id}`);
        triggerSuccessToast("You unfollowed a user");
      } else {
        triggerErrorToast("Something went wrong.");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => handleFollowClick(id)}
        disabled={loadAfterFollow}
        size={"sm"}
        className={className}
      >
        {result
          ? loadAfterFollow
            ? "Following"
            : "Unfollow"
          : loadAfterFollow
            ? "Following"
            : "Follow"}
      </Button>
    </>
  );
}
