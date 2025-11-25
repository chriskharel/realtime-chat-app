import { getUserById, updateUserAvatar, updateUserOnlineStatus } from "../models/user.model.js";
import pool from "../config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send sensitive information
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    // Update name if provided
    if (name) {
      await pool.query("UPDATE users SET name = ? WHERE id = ?", [name, userId]);
    }

    const updatedUser = await getUserById(userId);
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload avatar
export const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Get current user to check for existing avatar
    const currentUser = await getUserById(userId);
    
    // Delete old avatar file if exists
    if (currentUser.avatar) {
      const oldAvatarPath = path.join(__dirname, "..", currentUser.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user avatar in database
    const success = await updateUserAvatar(userId, avatarPath);
    
    if (!success) {
      return res.status(500).json({ message: "Failed to update avatar" });
    }

    res.json({ 
      message: "Avatar uploaded successfully", 
      avatar: avatarPath 
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete avatar
export const deleteUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);

    if (user.avatar) {
      // Delete file from filesystem
      const avatarPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

      // Remove avatar from database
      await updateUserAvatar(userId, null);
    }

    res.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    res.status(500).json({ message: "Server error" });
  }
};
