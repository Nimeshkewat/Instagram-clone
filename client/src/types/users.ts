export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  bio?: string;
  gender?: "male" | "female";
  followers?: string[];
  followings?: string[];
  posts?: string[];
  bookmarks?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

export interface SuggestedUsersResponse {
  success: boolean;
  suggestedUsers: UserProfile[];
}

export interface FollowResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  gender?: "male" | "female";
  profilePicture?: File;
}
