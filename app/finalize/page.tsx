import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

import { SubmitButton } from "@/components/submit-button";
import {
  createProfile,
  getProfileById,
} from "../(main)/profile/profile-actions";
import { FormMessage, Message } from "@/components/form-message";
import FinishSignup from "./finish-signup";

export default async function Page(props: { searchParams: Promise<Message> }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const profile = await getProfileById(user.id);

  if (profile) {
    return redirect("/home");
  }

  return (
    <div className="min-h-screen grid content-center">
      <div className="flex flex-col items-center mx-auto p-4">
        <h1 className="text-2xl font-medium text-start mb-8">
          Finishing sign-up
        </h1>
        <FinishSignup />
      </div>
    </div>
  );
}
