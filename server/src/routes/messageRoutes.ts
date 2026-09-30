import express from "express";
import {
  deleteMessage,
  getMessage,
  sendMessage,
} from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/:id", isAuthenticated, sendMessage);
router.get("/:id", isAuthenticated, getMessage);
router.delete("/:messageId", isAuthenticated, deleteMessage);

export default router;
