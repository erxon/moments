"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { User, KeyRound } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="p-3">
      <p className="text-xl font-semibold mb-3 ">Profile Settings</p>
      <div className="flex flex-row lg:flex-col items-start m-1">
        <Link
          className={clsx(
            "w-full p-2 transition hover:bg-blue-400 rounded-sm lg:mb-1 mr-1 flex text-sm",
            pathname === "/profile/update" && "bg-secondary"
          )}
          href="/profile/update"
        >
          <User className="w-4 h-4 mr-2" />
          <p>Profile</p>
        </Link>
        <Link
          className={clsx(
            "w-full p-2 transition hover:bg-blue-300 rounded-sm mb-1 flex text-sm",
            pathname === "/profile/update/password" && "bg-blue-300"
          )}
          href="/profile/update/password"
        >
          <KeyRound className="w-4 h-4 mr-2" />
          <p>Password</p>
        </Link>
      </div>
    </div>
  );
}
