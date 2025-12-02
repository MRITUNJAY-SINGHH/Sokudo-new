import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
// Generate JWT token
const generateToken = (id) =>
   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//  REGISTER
export const registerUser = async (req, res) => {
   const { name, email, password } = req.body;

   const existingUser = await User.findOne({ email });
   if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

   const user = await User.create({ name, email, password }); // Password will be automatically hashed by model

   res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
   });
};

// LOGIN
export const loginUser = async (req, res) => {
   const { email, password } = req.body;

   const user = await User.findOne({ email });
   if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

   const isPasswordCorrect = await user.matchPassword(password);
   if (!isPasswordCorrect)
      return res.status(401).json({ message: 'Invalid email or password' });

   res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
   });
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
   const { email } = req.body;
   const user = await User.findOne({ email });
   if (!user) return res.status(404).json({ message: 'User not found' });

   // Generate 6-digit OTP
   const otp = Math.floor(100000 + Math.random() * 900000).toString();
   user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
   user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
   await user.save();

   const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
   });

   const message = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP to reset password is: ${otp}. It will expire in 10 minutes.`,
   };

   try {
      await transporter.sendMail(message);
      res.status(200).json({ message: 'OTP sent to email' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send OTP' });
   }
};


//verify otp
export const verifyOtp = async (req, res) => {
   const { email, otp } = req.body;

   const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

   const user = await User.findOne({
      email,
      resetPasswordToken: hashedOtp,
      resetPasswordExpire: { $gt: Date.now() },
   });

   if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

   res.status(200).json({ message: 'OTP verified successfully' });
};



//RESET PASSWORD
export const resetPassword = async (req, res) => {
   const { email, newPassword } = req.body;

const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'User not found' });

user.password = newPassword;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

res.status(200).json({ message: 'Password reset successfully' });

};



export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};



export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    user.password = newPassword; // automatically hashed by pre-save hook
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};