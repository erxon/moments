"use client";

import { signOutAction } from "@/app/actions";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { User2Icon } from "lucide-react";

interface Props {
  avatarImage?: string;
  avatarImageFallback?: string;
}

export default function AvatarDropDown({
  avatarImage,
  avatarImageFallback,
}: Props) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-0">
        <User2Icon size={24} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push("/profile");
          }}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOutAction}>Sign-out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
