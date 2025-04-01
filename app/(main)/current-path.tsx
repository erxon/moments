"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CurrentPath() {
  const path = usePathname();
  const locations = path.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {locations.map((location) => (
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${location}`}>{location}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
