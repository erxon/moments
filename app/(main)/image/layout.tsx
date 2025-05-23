import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

  if (error || !user) {
    redirect("/sign-in");
  }

  const { data: profile, error: getProfileError } = await supabase
    .from("profile")
    .select()
    .eq("id", user.id)
    .single();

  if (!profile || getProfileError) {
    redirect("/finalize");
  }

  return (
    <>
      <div>{children}</div>
      <Toaster richColors />
    </>
  );
}
