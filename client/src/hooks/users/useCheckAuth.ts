import { checkAuth } from "@/api/users/profile";
import type { ApiError } from "@/types/error";
import type { ProfileResponse } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

export const useCheckAuth = () => {
  return useQuery<ProfileResponse, ApiError>({
    queryKey: ["check-auth"],
    queryFn: checkAuth,
  });
};
