import { createClient } from "@/utils/supabase/server";
import GalleryView from "./components/gallery-view";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ gallery_id: string }>;
}) {
  const { gallery_id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  return (
    <>
      <GalleryView user_id={user.id} gallery_id={gallery_id} />
    </>
  );
}
