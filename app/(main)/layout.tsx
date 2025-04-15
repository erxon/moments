import { SidebarProvider } from "@/components/ui/sidebar";
import SideNavBar from "../../components/sidenavbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfileById } from "./profile/components/profile-actions";
import TopNavigation from "@/components/top-navigation";

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
      <SideNavBar profile={profile} />
      <main className="min-h-screen w-full mx-2 lg:mx-6">
        <div className="mb-10">
          <TopNavigation />
        </div>
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
