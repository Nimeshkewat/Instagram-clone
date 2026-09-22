import { unfollowUser } from "@/api/users/profile";
import type { ApiError } from "@/types/error";
import type { FollowResponse } from "@/types/users";
import { useMutation } from "@tanstack/react-query";

export const useUnfollowUser = () => {
  return useMutation<FollowResponse, ApiError, string>({
    mutationFn: unfollowUser,
  });
};
