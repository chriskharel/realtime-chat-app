import { getUserByEmail, createUser } from '../models/user.model.js';
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";


/// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const user = await createUser(name, email, password);
    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
// LOGIN USER   
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
