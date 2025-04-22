import { createClient } from "@/utils/supabase/server";
import User from "../components/user";
import ImageType from "@/lib/types/image.types";
import DisplayImage from "../components/display-image";
import Tags from "../components/tags";
import { TagIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ImageView({ image_id }: { image_id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
    error: errorFetchingUser,
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("image")
    .select()
    .eq("id", image_id)
    .single();

  const image = data as ImageType;
  //check if the user follows the owner of the image

  if (data.visibility === "followers") {
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select()
      .eq("follower", user.id)
      .eq("following", data?.user_id)
      .single();

    if (follows) {
      return (
        <>
          <Image image={image} />
        </>
      );
    }

    if (!follows || followsError) {
      return (
        <>
          <div>Follow the user to view this image.</div>
        </>
      );
    }
  }

  return <Image image={image} />;
}

function Image({ image }: { image: ImageType }) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <User id={image.user_id} />
        <DisplayImage
          image={image.path}
          title={image.title}
          label={image.label}
          description={image.description}
        />
        <Tags image_id={image.id} />
      </div>
    </>
  );
}
