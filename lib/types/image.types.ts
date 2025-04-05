interface ImageType {
  id: string;
  user_id: string;
  gallery_id: string;
  title: string;
  description: string;
  label: string;
  path: string;
  visibility: "public" | "private" | "followers";
  created_at: string;
  updated_at: string;
}

export default ImageType;
