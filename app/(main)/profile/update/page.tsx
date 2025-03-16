import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfileById, getSocialsById } from "../profile-actions";
import BasicProfileInfo from "@/app/(main)/profile/forms/basic-profile-info";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const profile = await getProfileById(user.id);
  const socials = await getSocialsById(user.id);

  if (!profile) {
    return redirect("/protected");
  }

  return (
    <>
      <div className="p-3">
        <BasicProfileInfo profile={profile} socials={socials} />
      </div>
    </>
  );
}
