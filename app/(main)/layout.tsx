import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideNavBar from "../../components/sidenavbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfileById } from "./profile/profile-actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const profile = await getProfileById(user.id);

  if (!profile) {
    return redirect("/finalize");
  }

  return (
    <SidebarProvider>
      <SideNavBar />
      <main className="min-h-screen w-full py-5">{children}</main>
    </SidebarProvider>
  );
}
