import { removeFollower, unfollowUser } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { FollowResponse, RemoveFollowerResponse } from "@/types/users";
import { useMutation } from "@tanstack/react-query";

export const useUnfollowUser = () => {
  return useMutation<FollowResponse, ApiError, string>({
    mutationFn: unfollowUser,
  });
};

export const useRemoveFollower = () => {
  return useMutation<RemoveFollowerResponse, ApiError, string>({
    mutationFn: removeFollower,
  });
};
