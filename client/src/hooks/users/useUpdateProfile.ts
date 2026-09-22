import { updateProfile } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { ProfileResponse, UpdateProfilePayload } from "@/types/users";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  return useMutation<ProfileResponse, ApiError, UpdateProfilePayload>({
    mutationFn: updateProfile,
  });
};
