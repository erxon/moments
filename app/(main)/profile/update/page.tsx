import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfileById } from "../profile-actions";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const profile = await getProfileById(user.id);
  if (profile) {
    return redirect("/profile/new");
  }

  return (
    <>
      <div>New </div>
    </>
  );
}
