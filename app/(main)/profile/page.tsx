import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AuthenticatedUserProfile from "./components/authenticated/authenticated-user-profile";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <AuthenticatedUserProfile />;
}
