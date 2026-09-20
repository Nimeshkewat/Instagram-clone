import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkAuth,
  followUser,
  getProfile,
  getSuggestedUsers,
  unfollowUser,
  updateProfile,
} from "@/api/users/profile";
import type { ApiError } from "@/types/error";
import type {
  FollowResponse,
  ProfileResponse,
  SuggestedUsersResponse,
  UpdateProfilePayload,
} from "@/types/users";

export const useProfile = () => {
  return useQuery<ProfileResponse, ApiError>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useCheckAuth = () => {
  return useQuery<ProfileResponse, ApiError>({
    queryKey: ["check-auth"],
    queryFn: checkAuth,
  });
};

export const useSuggestedUsers = () => {
  return useQuery<SuggestedUsersResponse, ApiError>({
    queryKey: ["suggested-users"],
    queryFn: getSuggestedUsers,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, ApiError, UpdateProfilePayload>({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<FollowResponse, ApiError, string>({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-users"] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<FollowResponse, ApiError, string>({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-users"] });
    },
  });
};
