"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/swr.util";
import type Socials from "@/lib/types/socials.types";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import LoadErrorMessage from "@/components/load-error-message";
import { SquareArrowOutUpRight } from "lucide-react";

export default function Socials({ user_id }: { user_id?: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/profile/${user_id}/social`,
    fetcher
  );

  if (error)
    return <LoadErrorMessage>No social media accounts yet</LoadErrorMessage>;
  if (isLoading) return <Loading />;

  const socials = data[0] as Socials;

  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col gap-2">
          {socials.facebook && (
            <SocialsContainer>
              <p className="font-medium">Facebook</p>
              <div className="flex gap-1 items-center w-full">
                <p className="grow">
                  {socials.facebook?.replace("https://", "")}
                </p>
                <Link href={socials.facebook ? socials.facebook : "#"}>
                  <SquareArrowOutUpRight className="w-4 h-4" />
                </Link>{" "}
              </div>
            </SocialsContainer>
          )}
          {socials.twitter && (
            <SocialsContainer>
              <p className="font-medium">Twitter</p>
              <div className="flex gap-1 items-center w-full">
                <p className="grow">
                  {socials.twitter?.replace("https://", "")}
                </p>
                <Link href={socials.twitter ? socials.twitter : "#"}>
                  <SquareArrowOutUpRight className="w-4 h-4" />
                </Link>
              </div>
            </SocialsContainer>
          )}
          {socials.instagram && (
            <SocialsContainer>
              <p className="font-medium">Instagram</p>
              <div className="flex gap-1 items-center w-full">
                <p className="grow">
                  {socials.instagram?.replace("https://", "")}
                </p>
                <Link href={socials.instagram ? socials.instagram : "#"}>
                  <SquareArrowOutUpRight className="w-4 h-4" />
                </Link>
              </div>
            </SocialsContainer>
          )}
        </div>
      ) : (
        <LoadErrorMessage>No social media accounts yet</LoadErrorMessage>
      )}
    </>
  );
}

function SocialsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex md:items-center md:flex-row flex-col gap-1 text-sm transition hover:bg-secondary p-2 rounded-lg">
      {children}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-[25px]" />
      <Skeleton className="w-full h-[25px]" />
      <Skeleton className="w-full h-[25px]" />
    </div>
  );
}
