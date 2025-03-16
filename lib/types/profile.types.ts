interface Profile {
  id?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  avatar?: string;
  about?: string;
  social?: null | {
    id?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export default Profile;
