import { register } from "@/api/users/user";
import type { ApiError } from "@/types/error";
import type { RegisterResponse } from "@/types/users";
import type { RegisterInput } from "@instagram-clone/shared";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation<RegisterResponse, ApiError, RegisterInput>({
    mutationFn: register,
  });
};
