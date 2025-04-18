"use client";

import {
  ChevronUp,
  House,
  LogOut,
  Newspaper,
  UserIcon,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Profile from "@/lib/types/profile.types";
import ProfilePicturePlaceholder from "@/lib/assets/profile-picture-placeholder.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { signOutAction } from "@/app/actions";
import { useRouter } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: House,
  },
  {
    title: "Feed",
    url: "/feed",
    icon: Newspaper,
  },
];

export default function SideNavBar({ profile }: { profile: Profile }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Moments</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <PlusIcon /> <span className="sr-only">Upload Image</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <ProfileOverview profile={profile} />
    </Sidebar>
  );
}

function UploadNewImage() {
  return (
    <>
      <Button size="sm" className="flex gap-2 my-4">
        <PlusIcon />
        Upload
      </Button>
    </>
  );
}

function ProfileOverview({
  profile,
  className,
}: {
  profile: Profile;
  className?: string;
}) {
  const router = useRouter();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <span className="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg">
                  <Image
                    src={
                      profile.avatar
                        ? profile.avatar
                        : ProfilePicturePlaceholder
                    }
                    className="aspect-square h-full w-full object-cover"
                    alt="Profile Picture"
                    width={1000}
                    height={1000}
                  />
                </span>
                <p className="font-semibold truncate">
                  {profile.first_name} {profile.last_name}
                </p>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <UserIcon className="" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOutAction}>
                <LogOut />
                Sign-out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
