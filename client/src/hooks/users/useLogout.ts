import { logout } from "@/api/users/useLogout";
import type { ApiError } from "@/types/error";
import type { LogoutResponse } from "@/types/users";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  return useMutation<LogoutResponse, ApiError, null>({
    mutationFn: logout,
  });
};
