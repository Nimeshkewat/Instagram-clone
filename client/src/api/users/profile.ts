import { api } from "@/lib/axios";
import type {
  ProfileResponse,
  SuggestedUsersResponse,
  FollowResponse,
  UpdateProfilePayload,
} from "@/types/users";

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>("/users/profile");
  return response.data;
};

export const checkAuth = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>("/users/check-auth");
  return response.data;
};

export const getSuggestedUsers = async (): Promise<SuggestedUsersResponse> => {
  const response = await api.get<SuggestedUsersResponse>("/users/suggested");
  return response.data;
};

export const followUser = async (userId: string): Promise<FollowResponse> => {
  const response = await api.post<FollowResponse>(`/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId: string): Promise<FollowResponse> => {
  const response = await api.post<FollowResponse>(`/users/${userId}/unfollow`);
  return response.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> => {
  const formData = new FormData();

  if (payload.username) formData.append("username", payload.username);
  if (payload.bio) formData.append("bio", payload.bio);
  if (payload.gender) formData.append("gender", payload.gender);
  if (payload.profilePicture) {
    formData.append("profilePicture", payload.profilePicture);
  }

  const response = await api.patch<ProfileResponse>(
    "/users/update-profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
