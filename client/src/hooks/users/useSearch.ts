import { searchUsers } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { SearchUsersResponse } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

export const useSearch = (search: string) => {
  return useQuery<SearchUsersResponse, ApiError>({
    queryKey: ["search", search],
    queryFn: () => searchUsers(search),
    retry: false,
    enabled: search.trim().length > 0,
  });
};
