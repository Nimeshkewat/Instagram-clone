import { login } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { LoginResponse } from "@/types/users";
import type { LoginInput } from "@/schema/user";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation<LoginResponse, ApiError, LoginInput>({
    mutationFn: login,
  });
};
