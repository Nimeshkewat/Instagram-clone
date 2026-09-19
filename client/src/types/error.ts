import { AxiosError } from "axios";

interface ZodErrorTree {
  errors: string[];
  properties: {
    [key: string]: ZodErrorTree;
  };
  items?: ZodErrorTree[];
}

interface BackendErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  isOperational: boolean;
  errors?: ZodErrorTree;
}

export type ApiError = AxiosError<BackendErrorResponse>;
