import Images from "../components/images";

export default async function Page({
  params,
}: {
  params: Promise<{ gallery_id: string; user_id: string }>;
}) {
  const { gallery_id, user_id } = await params;

  return (
    <div>
      <Images user_id={user_id} gallery_id={gallery_id} />
    </div>
  );
}
