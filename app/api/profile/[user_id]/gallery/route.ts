import { authenticate } from "@/lib/auth.util";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;

    const user = await authenticate();

    const supabase = await createClient();

    const { data: publicGalleries, error: errorQueryPublicGalleries } =
      await supabase
        .from("gallery")
        .select()
        .eq("visibility", "public")
        .eq("user_id", user_id);

    const { data: authUserFollows, error: errorQueryAuthUserFollows } =
      await supabase
        .from("follows")
        .select()
        .eq("follower", user?.id)
        .eq("following", user_id)
        .single();

    if (authUserFollows) {
      //Fetch galleries for followers
      const {
        data: galleriesForFollowers,
        error: errorQueryGalleriesForFollowers,
      } = await supabase
        .from("gallery")
        .select("*")
        .eq("visibility", "followers")
        .eq("user_id", user_id);

      if (errorQueryGalleriesForFollowers) {
        throw new Error(errorQueryGalleriesForFollowers.message);
      }

      const galleries = {
        public: publicGalleries,
        followers: galleriesForFollowers,
      };

      return new Response(JSON.stringify(galleries), { status: 200 });
    } else {
      const galleries = {
        public: publicGalleries,
        followers: [],
      };

      return new Response(JSON.stringify(galleries), { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
