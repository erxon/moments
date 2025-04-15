import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Profile from "../components/profile";

export default async function Page({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user_id === user?.id) {
    redirect("/profile");
  }

  if (error || !user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profile")
    .select()
    .eq("id", user_id);

  if (!profile || profile.length === 0) {
    redirect("/not-found");
  }

  return (
    <>
      <div>
        <Profile profile={profile[0]} />
      </div>
    </>
  );
}
