import { api } from "@/lib/axios";
import type {
  ProfileResponse,
  SuggestedUsersResponse,
  FollowResponse,
  UpdateProfilePayload,
  RegisterResponse,
  LoginResponse,
  LogoutResponse,
  FollowListResponse,
  FollowListType,
  RemoveFollowerResponse,
  SearchUsersResponse,
} from "@/types/users";
import type { LoginInput, RegisterInput } from "@/schema/user";

export const register = async (
  input: RegisterInput,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/users/register", input);
  return response.data;
};

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/users/login", input);
  return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("/users/logout");
  return response.data;
};

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

export const removeFollower = async (
  followerId: string,
): Promise<RemoveFollowerResponse> => {
  const response = await api.delete<RemoveFollowerResponse>(
    `/users/${followerId}/follower`,
  );
  return response.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload | FormData,
): Promise<ProfileResponse> => {
  const formData =
    payload instanceof FormData
      ? payload
      : (() => {
          const nextFormData = new FormData();
          if (payload.username)
            nextFormData.append("username", payload.username);
          if (payload.bio) nextFormData.append("bio", payload.bio);
          if (payload.gender) nextFormData.append("gender", payload.gender);
          if (payload.profilePicture) {
            nextFormData.append("profilePicture", payload.profilePicture);
          }
          return nextFormData;
        })();

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

export const followerOrFollowingList = async (
  type: FollowListType,
): Promise<FollowListResponse> => {
  const response = await api.get<FollowListResponse>(`/users/${type}/list`);
  return response.data;
};

export const searchUsers = async (
  search: string,
): Promise<SearchUsersResponse> => {
  const response = await api.get<SearchUsersResponse>(
    `/users?search=${search}`,
  );
  return response.data;
};
