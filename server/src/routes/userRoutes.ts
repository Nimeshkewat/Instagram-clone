import express from "express";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../schema/user.js";
import {
  checkAuth,
  follow,
  followersOrFollwingList,
  login,
  logout,
  profile,
  refresh,
  removeFollower,
  register,
  suggestedUsers,
  unfollow,
  updateProfile,
  searchUsers,
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
router.delete("/:id/follower", isAuthenticated, removeFollower);
router.get("/:type/list", isAuthenticated, followersOrFollwingList);
router.get("/", isAuthenticated, searchUsers);

export default router;
