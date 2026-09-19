export type PostType = {
  id: string | number;
  username: string;
  avatar?: string;
  image: string;
  caption: string;
  comments: number;
  likedBy?: string[];
  createdAgo: string;
};
