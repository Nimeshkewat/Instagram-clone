import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/:id", isAuthenticated, sendMessage);
router.get("/:id", isAuthenticated, getMessage);

export default router;
