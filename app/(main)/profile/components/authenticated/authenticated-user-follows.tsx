"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR, { mutate } from "swr";
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
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function AuthenticatedUserFollows() {
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
      <TabsList className="w-full sm:w-fit">
        <TabsTrigger className="gap-2" value="following">
          Following{" "}
          {data.following.length > 0 && (
            <Badge className="ml-2">{data.following.length}</Badge>
          )}{" "}
        </TabsTrigger>
        <TabsTrigger value="followers">
          Followers{" "}
          {data.follower.length > 0 && (
            <Badge className="ml-2">{data.follower.length}</Badge>
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

function Following({ following }: { following: FollowingProps[] }) {
  return (
    <>
      {following.length > 0 ? (
        <div className="flex flex-col gap-2">
          {following.map((item) => (
            <DisplayUser
              key={item.following.id}
              user={item.following}
              type="following"
            />
          ))}
        </div>
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
        <div className="flex flex-col gap-2">
          {follower.map((item) => (
            <DisplayUser user={item.follower} type="follower" />
          ))}
        </div>
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
    email?: string;
    avatar?: string;
  };
  type: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleUnfollow(id?: string) {
    try {
      setIsLoading(true);

      const result = await axios.delete("/api/profile/follows", {
        data: { following: id },
      });

      if (result.status === 200) {
        mutate("/api/profile/follows");

        toast.success(result.data, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
          duration: 5000,
        });
      } else {
        toast.error(result.data, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
          description: "Please try again",
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
        description: "Please try again",
        duration: 5000,
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="flex md:items-center items-start gap-3 p-2 rounded-md">
      <Avatar>
        <AvatarFallback>
          {user.first_name
            ?.charAt(0)
            .concat(user.last_name!.charAt(0))
            .toUpperCase()}
        </AvatarFallback>
        <AvatarImage className="object-cover" src={user.avatar} />
      </Avatar>
      <div className="flex flex-col gap-2 w-full md:flex-row">
        <div className="grow text-sm">
          <p className="font-medium">
            {user.first_name} {user.middle_name ? user.middle_name : ""}{" "}
            {user.last_name}
          </p>
          <p className="text-neutral-500 text-xs md:text-sm">{user.email}</p>
        </div>
        {type === "following" && (
          <Button
            onClick={() => {
              handleUnfollow(user.id);
            }}
            disabled={isLoading}
            size="sm"
            variant="secondary"
          >
            {!isLoading ? "Unfollow" : "Unfollowing..."}
          </Button>
        )}
      </div>
    </div>
  );
}
