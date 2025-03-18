"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import type Socials from "@/lib/types/socials.types";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Socials() {
  const { data, error, isLoading } = useSWR("/api/profile/social", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[25px]" />
        <Skeleton className="w-full h-[25px]" />
        <Skeleton className="w-full h-[25px]" />
      </div>
    );

  const socials = data as Socials;

  return (
    <>
      <Link
        className="text-blue-500"
        href={socials.facebook ? socials.facebook : "#"}
      >
        <p>{socials.facebook?.replace("https://", "")}</p>
      </Link>{" "}
      <Link
        className="text-blue-500"
        href={socials.twitter ? socials.twitter : "#"}
      >
        <p>{socials.twitter?.replace("https://", "")}</p>
      </Link>{" "}
      <Link
        className="text-blue-500"
        href={socials.instagram ? socials.instagram : "#"}
      >
        <p>{socials.instagram?.replace("https://", "")}</p>
      </Link>{" "}
    </>
  );
}
