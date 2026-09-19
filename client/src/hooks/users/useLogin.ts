import { login } from "@/api/users/login";
import type { ApiError } from "@/types/error";
import type { LoginResponse } from "@/types/users";
import type { LoginInput } from "@instagram-clone/shared";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation<LoginResponse, ApiError, LoginInput>({
    mutationFn: login,
  });
};
