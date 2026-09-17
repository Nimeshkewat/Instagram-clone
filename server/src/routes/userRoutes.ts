import express from "express";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "@instagram-clone/shared";
import {
  login,
  logout,
  profile,
  register,
  updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { profileSchema } from "../../../shared/src/schema/user.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.get("/profile", isAuthenticated, profile);
router.patch(
  "/update-profile",
  isAuthenticated,
  validate(profileSchema),
  updateProfile,
);

export default router;
