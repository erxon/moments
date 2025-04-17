import { createClient } from "@/utils/supabase/server";
import User from "../components/user";
import ImageType from "@/lib/types/image.types";
import DisplayImage from "../components/display-image";
import Tags from "../components/tags";
import { TagIcon } from "lucide-react";

export default async function ImageView({ image_id }: { image_id: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("image")
    .select()
    .eq("id", image_id)
    .single();

  const image = data as ImageType;

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
