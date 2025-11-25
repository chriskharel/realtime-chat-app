import express from "express";
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadUserAvatar, 
  deleteUserAvatar 
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadAvatar, handleUploadError } from "../middleware/upload.middleware.js";

const router = express.Router();

// Get user profile (own or by ID)
router.get("/profile", authMiddleware, getUserProfile);
router.get("/profile/:userId", authMiddleware, getUserProfile);

// Update user profile
router.put("/profile", authMiddleware, updateUserProfile);

// Upload avatar
router.post("/avatar", authMiddleware, uploadAvatar.single('avatar'), handleUploadError, uploadUserAvatar);

// Delete avatar
router.delete("/avatar", authMiddleware, deleteUserAvatar);

export default router;
