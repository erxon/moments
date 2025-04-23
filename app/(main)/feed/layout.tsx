import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfileById } from "../profile/components/profile-actions";
import { Toaster } from "sonner";

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
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-3">{/* */}</div>
        <div className="lg:col-span-6 lg:gap-4">{children}</div>
        <div className="lg:col-span-3"></div>
        <Toaster richColors />
      </div>
    </>
  );
}
