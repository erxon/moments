import { Toaster } from "sonner";
import GalleryView from "./components/gallery-view";

export default async function Page({
  params,
}: {
  params: Promise<{ gallery_id: string }>;
}) {
  const { gallery_id } = await params;

  return (
    <>
      <GalleryView gallery_id={gallery_id} />
    </>
  );
}
