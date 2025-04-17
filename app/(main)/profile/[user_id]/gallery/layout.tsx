import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import Galleries from "./components/galleries";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ user_id: string }>;
  children: React.ReactNode;
}) {
  const { user_id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && user.id === user_id) {
    redirect("/home");
  }

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-3">
          <h1 className="text-2xl grow font-medium">Gallery</h1>
          <Galleries user_id={user_id} />
        </div>
        <div className="lg:col-span-9">{children}</div>
        <Toaster richColors />
      </div>
    </>
  );
}
