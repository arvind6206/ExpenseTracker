import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
