import { api } from "@/lib/axios";
import type { LoginResponse } from "@/types/users";
import { type LoginInput } from "@instagram-clone/shared";

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/users/login", input);
  return response.data;
};
