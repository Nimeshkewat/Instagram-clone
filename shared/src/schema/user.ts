import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters");

export const emailSchema = z
  .email("Invalid email address")
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(20, "Password must be less than 20 characters");

export const bioSchema = z
  .string()
  .max(100, "Bio must be less than 50 characters");

export const genderSchema = z.enum(["male", "female"]);

//
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const profileSchema = z.object({
  username: usernameSchema,
  bio: bioSchema,
  gender: genderSchema,
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
