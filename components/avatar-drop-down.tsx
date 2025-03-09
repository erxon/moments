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

interface Props {
  avatarImage?: string;
  avatarImageFallback?: string;
}

export default function AvatarDropDown({
  avatarImage,
  avatarImageFallback,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-0">
        <Avatar>
          <AvatarImage src={avatarImage} className="object-cover" />
          <AvatarFallback>{avatarImageFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={signOutAction}>Sign-out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
