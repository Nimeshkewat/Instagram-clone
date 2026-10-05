import { z } from "zod";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters");

const emailSchema = z.email("Invalid email address").trim().toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(20, "Password must be less than 20 characters");

const bioSchema = z
  .string()
  .min(0)
  .max(100, "Bio must be less than 50 characters");

const genderSchema = z.enum(["male", "female"]);

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
