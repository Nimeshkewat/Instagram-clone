export interface PostAuthor {
  _id: string;
  username: string;
  profilePicture?: string;
}

export interface PostItem {
  _id: string;
  image: string;
  imagePublicId?: string;
  caption: string;
  likes?: string[];
  comments?: (string | { _id: string })[];
  author?: PostAuthor | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  post: PostItem;
}

export interface GetPostsResponse {
  success: boolean;
  posts: PostItem[];
}

export interface GetBookmarkPostsResponse {
  success: boolean;
  bookmarks: {
    _id: string;
    bookmarks: (PostItem | null)[];
  }[];
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

export interface LikePostResponse {
  success: boolean;
  message: string;
}

export interface BookmarkPostResponse {
  success: boolean;
  message: string;
}
