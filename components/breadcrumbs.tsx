"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { captilizeFirstLetter } from "@/lib/string.util";
import { usePathname } from "next/navigation";
import React from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter((path) => path !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${path}`}>
                {captilizeFirstLetter(path)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
