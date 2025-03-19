"use client";

import { fetcher } from "@/lib/swr.util";
import useSWR from "swr";
import Profile from "@/lib/types/profile.types";
import Image from "next/image";
import Socials from "./socials";
import Follows from "./components/follows";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { Toaster } from "sonner";

export default function MainProfile() {
  const { data, error, isLoading } = useSWR("/api/profile", fetcher);
  const router = useRouter();

  if (error) return <div>failed to load</div>;
  if (isLoading)
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

  const profile = data as Profile;

  return (
    <div className="p-3">
      <div className="mb-5 flex items-center">
        <h1 className="text-xl font-semibold mb-3 grow">
          Hi {profile.first_name}!
        </h1>
        <Button
          variant="secondary"
          onClick={() => {
            router.push("/profile/update");
          }}
          className="gap-2"
        >
          Edit
          <PencilIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid lg:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="mb-4">
            <Image
              src={data.avatar}
              alt="Profile Picture"
              className="w-[120px] h-[120px] object-cover rounded-full mb-3"
              width={1200}
              height={1200}
            />
            <p>
              {profile.first_name}{" "}
              {profile.middle_name ? profile.middle_name : ""}{" "}
              {profile.last_name}
            </p>
            <p className="text-neutral-500">{profile.email}</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{profile.about}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Socials</CardTitle>
            </CardHeader>
            <CardContent>
              <Socials />
            </CardContent>
          </Card>
          <Follows />
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
