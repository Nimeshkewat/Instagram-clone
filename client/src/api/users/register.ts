import { api } from "@/lib/axios";
import type { RegisterResponse } from "@/types/users";
import type { RegisterInput } from "@instagram-clone/shared";

export const register = async (
  input: RegisterInput,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/users/register", input);
  return response.data;
};
