import { createClient } from "@/utils/supabase/server";
import CommentField from "./comment-field";
import { MessageSquareText } from "lucide-react";
import DisplayComments from "./display-comments";

export default async function Comments({ image_id }: { image_id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { data: profile, error: errorFetchingProfile } = await supabase
    .from("profile")
    .select()
    .eq("id", user?.id)
    .single();

  if (error || errorFetchingProfile) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <MessageSquareText className="w-4 h-4" strokeWidth={2} />
          <h1 className="font-medium">Comments</h1>
        </div>
        <div className="gap-2">
          <div className="mb-8">
            <CommentField
              user={{
                id: profile.id,
                avatar: profile.avatar,
                first_name: profile.first_name,
                last_name: profile.last_name,
              }}
              image_id={image_id}
            />
          </div>
          <DisplayComments image_id={image_id} auth_user={profile} />
        </div>
      </div>
    </>
  );
}
