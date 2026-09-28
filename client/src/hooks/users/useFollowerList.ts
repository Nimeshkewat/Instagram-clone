import { useQuery } from "@tanstack/react-query";
import { followerOrFollowingList } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { FollowListResponse, FollowListType } from "@/types/users";

export const useFollowerList = (type: FollowListType) => {
  return useQuery<FollowListResponse, ApiError>({
    queryKey: ["follow-list", type],
    queryFn: () => followerOrFollowingList(type),
  });
};
