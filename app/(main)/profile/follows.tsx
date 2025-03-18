"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import Image from "next/image";
import ProfilePicturePlaceholder from "@/lib/assets/profile-picture-placeholder.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Follows() {
  const { data, error, isLoading } = useSWR("/api/profile/follows", fetcher);
  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[50px]" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    );

  return (
    <Tabs defaultValue="following">
      <TabsList>
        <TabsTrigger className="gap-2" value="following">
          Following{" "}
          {data.following.length > 0 && (
            <Badge>{data.following.length}</Badge>
          )}{" "}
        </TabsTrigger>
        <TabsTrigger value="followers">
          Followers{" "}
          {data.follower.length > 0 && (
            <Badge>{data.follower.length}</Badge>
          )}{" "}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="following">
        <Following following={data.following} />
      </TabsContent>
      <TabsContent value="followers">
        <Followers follower={data.follower} />
      </TabsContent>
    </Tabs>
  );
}

interface FollowingProps {
  following: {
    id?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
  };
}

interface FollowerProps {
  follower: {
    id?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    avatar?: string;
  };
}

function Following({ following }: { following: FollowingProps[] }) {
  return (
    <>
      {following.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Following</CardTitle>
          </CardHeader>
          <CardContent>
            {following.map((item) => (
              <DisplayUser user={item.following} type="following" />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription>No followers yet</CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  );
}

function Followers({ follower }: { follower: FollowerProps[] }) {
  return (
    <>
      {follower.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            {follower.map((item) => (
              <DisplayUser user={item.follower} type="following" />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription>No followers yet</CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  );
}
function DisplayUser({
  user,
  type,
}: {
  user: {
    id?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    avatar?: string;
  };
  type: string;
}) {
  return (
    <div className="flex items-center gap-3 outline outline-1 outline-neutral-300 p-2 rounded-md">
      <Image
        src={user.avatar ? user.avatar : ProfilePicturePlaceholder}
        alt="Profile picture"
        width={1000}
        height={1000}
        className="w-[56px] h-[56px] rounded-full object-cover"
      />
      <p className="grow">
        {user.first_name} {user.middle_name ? user.middle_name : ""}{" "}
        {user.last_name}
      </p>
      {type === "following" && (
        <Button size="sm" variant="destructive">
          Unfollow
        </Button>
      )}
    </div>
  );
}
