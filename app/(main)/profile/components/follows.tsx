"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetcher } from "@/lib/swr.util";
import Profile from "@/lib/types/profile.types";
import useSWR from "swr";
import ProfilePicturePlaceholder from "@/lib/assets/profile-picture-placeholder.png";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Follows({ user_id }: { user_id?: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/profile/${user_id}/follows`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-[25px]" />
          <Skeleton className="w-full h-[25px]" />
          <Skeleton className="w-full h-[25px]" />
        </div>
      </>
    );

  const { followers, following } = data;

  return (
    <>
      <Tabs defaultValue="followers">
        <TabsList className="w-full md:w-fit">
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="followers">
          <Followers followers={followers} />
        </TabsContent>
        <TabsContent value="following">
          <Following following={following} />
        </TabsContent>
      </Tabs>
    </>
  );
}

interface Follower {
  follower: Profile;
}

interface Following {
  following: Profile;
}
function Followers({ followers }: { followers: Follower[] }) {
  return (
    <>
      {" "}
      {followers.length > 0 ? (
        <div className="flex flex-col gap-2">
          {followers.map((item: Follower) => (
            <DisplayProfile profile={item.follower} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription>No data to display</CardDescription>
          </CardHeader>
        </Card>
      )}{" "}
    </>
  );
}

function Following({ following }: { following: Following[] }) {
  return (
    <>
      {following.length > 0 ? (
        <div className="flex flex-col gap-2">
          {following.map((item) => (
            <DisplayProfile profile={item.following} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription>No data to display</CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  );
}

function DisplayProfile({ profile }: { profile: Profile }) {
  return (
    <>
      <div className="flex items-center gap-3 p-2 rounded-md">
        <Avatar>
          <AvatarFallback>
            {profile.first_name
              ?.charAt(0)
              .concat(profile.last_name!.charAt(0))
              .toUpperCase()}
          </AvatarFallback>
          <AvatarImage className="object-cover" src={profile.avatar} />
        </Avatar>
        <div className="text-sm">
          <p className="font-medium">
            {profile.first_name}{" "}
            {profile.middle_name ? profile.middle_name : ""} {profile.last_name}
          </p>
          <p className="text-neutral-500">{profile.email}</p>
        </div>
      </div>
    </>
  );
}
