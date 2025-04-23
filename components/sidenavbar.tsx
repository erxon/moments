"use client";

import {
  ChevronsUpDown,
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { avatarFallbackString } from "@/lib/string.util";
import Link from "next/link";
import { useState } from "react";

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
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ProfileOverview profile={profile} />
      </SidebarFooter>
    </Sidebar>
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="relative shrink-0 overflow-hidden h-8 w-8 rounded-lg">
                <AvatarFallback>
                  {avatarFallbackString(
                    profile.first_name!,
                    profile.last_name!
                  )}
                </AvatarFallback>
                <AvatarImage className="object-cover" src={profile.avatar} />
              </Avatar>
              <p className="font-semibold truncate">
                {profile.first_name} {profile.last_name}
              </p>
              <ChevronsUpDown className="ml-auto" />
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
  );
}
