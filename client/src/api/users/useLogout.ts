import { api } from "@/lib/axios";
import type { LogoutResponse } from "@/types/users";

export const logout = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("/users/logout");
  return response.data;
};
