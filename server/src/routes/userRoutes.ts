import express from "express";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "@instagram-clone/shared";
import {
  checkAuth,
  follow,
  login,
  logout,
  profile,
  refresh,
  register,
  suggestedUsers,
  unfollow,
  updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);

router.get("/profile", isAuthenticated, profile);
router.get("/check-auth", isAuthenticated, checkAuth);
router.patch(
  "/update-profile",
  isAuthenticated,
  upload.single("profilePicture"),
  updateProfile,
);

router.get("/suggested", isAuthenticated, suggestedUsers);
router.post("/:id/follow", isAuthenticated, follow);
router.post("/:id/unfollow", isAuthenticated, unfollow);

export default router;
