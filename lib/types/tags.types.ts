interface Tag {
  id: string;
  name: string;
  created_at: string;
}

interface ImageTags {
  user_id: string;
  image_id: string;
  tag_id: Tag;
  created_at: string;
}

export type { Tag, ImageTags };
