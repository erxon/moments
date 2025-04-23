import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { getProfileById } from "../profile/components/profile-actions";
import GallerySelection from "./components/gallery-selection";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateGallery from "./components/new-gallery";
import { Toaster } from "@/components/ui/sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const profile = await getProfileById(user.id);

  if (!profile) {
    redirect("/finalize");
  }

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-3 mb-4">
          <div className="flex items-center mb-3">
            <h1 className="text-2xl grow font-medium">Gallery</h1>
            <CreateGallery />
          </div>
          <GallerySelection />
        </div>
        <div className="lg:col-span-9">{children}</div>
        <Toaster richColors />
      </div>
    </>
  );
}
