import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import {
  createProfile,
  getProfileById,
} from "../(main)/profile/profile-actions";
import { FormMessage, Message } from "@/components/form-message";
import ImageInput from "@/components/image-input";

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
    return redirect("/profile");
  }

  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="h-screen mx-auto flex flex-col items-center my-10">
      <h1 className="text-2xl font-medium text-start mb-10">
        Help us know more about you
      </h1>
      <form>
        <div className="flex flex-col items-center justify-center mb-4">
          <ImageInput name="avatar" />
        </div>
        <div className="mb-3">
          <Textarea
            className="w-[400px] p-2 mt-4 outline outline-1 outline-secondary-foreground rounded-md text-sm resize-none"
            placeholder="Please tell us more about yourself..."
            name="about"
          />
          <FormMessage message={searchParams} />
        </div>
        <SubmitButton
          size="sm"
          pendingText="Saving..."
          formAction={createProfile}
        >
          Done!
        </SubmitButton>
      </form>
    </div>
  );
}
