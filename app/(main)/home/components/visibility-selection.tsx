import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { GlobeIcon, Lock, UsersRound } from "lucide-react";

export default function VisibilitySelection({ name }: { name: string }) {
  return (
    <Select name={name} defaultValue="public">
      <SelectTrigger>
        <SelectValue placeholder="Select visibility" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">
          <div className="flex gap-1 items-center">
            <GlobeIcon className="w-4 h-4" />
            <p>Public</p>
          </div>
        </SelectItem>
        <SelectItem value="private">
          <div className="flex gap-1 items-center">
            <Lock className="w-4 h-4" />
            <p>Private</p>
          </div>
        </SelectItem>
        <SelectItem value="followers">
          <div className="flex gap-1 items-center">
            <UsersRound className="w-4 h-4" />
            <p>Followers</p>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
