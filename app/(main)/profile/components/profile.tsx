"use client";

import type Profile from "@/lib/types/profile.types";
import Image from "next/image";
import Socials from "./socials";
import Follows from "./follows";
import { useRouter } from "next/navigation";
import { ImageIcon, PencilIcon } from "lucide-react";
import { localeDateStringFormatter } from "@/lib/date.util";
import { UsersRoundIcon } from "lucide-react";
import { PenLine } from "lucide-react";

export default function Profile({ profile }: { profile: Profile }) {
  const router = useRouter();
  const joined = new Date(profile.created_at!);

  return (
    <div className="p-3">
      <div className="grid lg:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="mb-4">
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
          <Follows user_id={profile.id} />
        </div>
      </div>
    </div>
  );
}
