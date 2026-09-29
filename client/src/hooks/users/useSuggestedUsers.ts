import { getSuggestedUsers } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { SuggestedUsersResponse } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

export const useSuggestedUsers = (enabled = true) => {
  return useQuery<SuggestedUsersResponse, ApiError>({
    queryKey: ["suggested-users"],
    queryFn: getSuggestedUsers,
    enabled,
  });
};
