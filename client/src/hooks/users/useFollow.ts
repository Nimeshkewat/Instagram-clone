import { followUser } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { FollowResponse } from "@/types/users";
import { useMutation } from "@tanstack/react-query";

export const useFollowUser = () => {
  return useMutation<FollowResponse, ApiError, string>({
    mutationFn: followUser,
  });
};
