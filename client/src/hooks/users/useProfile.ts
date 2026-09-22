import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/users/profile";
import type { ApiError } from "@/types/error";
import type { ProfileResponse } from "@/types/users";

export const useProfile = () => {
  return useQuery<ProfileResponse, ApiError>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};
