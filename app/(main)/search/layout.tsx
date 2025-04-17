import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { getProfileById } from "../profile/components/profile-actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //Verify user
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/sign-in");
  }

  const profile = await getProfileById(user.id);

  if (!profile) {
    redirect("/finalize");
  }

  return (
    <div className="h-screen">
      {children}
      <Toaster />
    </div>
  );
}
