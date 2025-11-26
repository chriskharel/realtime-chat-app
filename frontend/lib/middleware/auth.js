import jwt from "jsonwebtoken";
import { getUserById } from "../database/user.model.js";

export async function authMiddleware(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized" });
      return null;
    }

    const token = authHeader.split(" ")[1];

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await getUserById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return null;
    }

    return user;
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: "Invalid token" });
    return null;
  }
}
