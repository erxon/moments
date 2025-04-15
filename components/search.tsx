"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/search?query=${search}`);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            className="md:w-[500px] pl-10 rounded-full"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        </div>
        <Button onClick={handleSubmit} variant={"secondary"} size={"icon"}>
          <SearchIcon className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
}
