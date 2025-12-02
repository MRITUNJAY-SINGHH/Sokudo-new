// filepath: [customerController.js](http://_vscodecontentref_/1)
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Customer from '../models/customerModel.js';

export const generateToken = (id) =>
   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// 🧾 Register
export const registerCustomer = async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer)
         return res.status(400).json({ message: 'Customer already exists' });

      const customer = await Customer.create({ name, email, password });

      res.status(201).json({
         _id: customer._id,
         name: customer.name,
         email: customer.email,
         token: generateToken(customer._id),
      });
   } catch (error) {
      console.error('Register Error:', error);
      res.status(500).json({ message: 'Server error during registration' });
   }
};

export const loginCustomer = async (req, res) => {
   const { email, password } = req.body;

   try {
      const customer = await Customer.findOne({ email });
      if (!customer)
         return res.status(401).json({ message: 'Invalid email or password' });

      const isPasswordCorrect = await customer.matchPassword(password);
      if (!isPasswordCorrect)
         return res.status(401).json({ message: 'Invalid email or password' });

      res.json({
         _id: customer._id,
         name: customer.name,
         email: customer.email,
         token: generateToken(customer._id),
      });
   } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server error during login' });
   }
};

export const sendOtpCustomer = async (req, res) => {
   const { email } = req.body;

   try {
      const customer = await Customer.findOne({ email });
      if (!customer)
         return res.status(404).json({ message: 'Customer not found' });

      // 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      customer.otp = otp;
      customer.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min expiry

      await customer.save();

      const transporter = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });

      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: email,
         subject: 'Customer Password Reset OTP',
         text: `Your OTP to reset password is: ${otp} (valid for 5 minutes)`,
      });

      res.status(200).json({ message: 'OTP sent successfully' });
   } catch (error) {
      console.error('Send OTP Error:', error);
      res.status(500).json({ message: 'Failed to send OTP' });
   }
};

export const verifyOtpCustomer = async (req, res) => {
   const { email, otp } = req.body;

   try {
      const customer = await Customer.findOne({
         email,
         otp,
         otpExpire: { $gt: Date.now() },
      });

      if (!customer)
         return res.status(400).json({ message: 'Invalid or expired OTP' });

      res.status(200).json({ message: 'OTP verified successfully' });
   } catch (error) {
      console.error('Verify OTP Error:', error);
      res.status(500).json({ message: 'Error verifying OTP' });
   }
};

export const resetPasswordWithOtpCustomer = async (req, res) => {
   const { email, otp, newPassword } = req.body;

   try {
      const customer = await Customer.findOne({
         email,
         otp,
         otpExpire: { $gt: Date.now() },
      });

      if (!customer)
         return res.status(400).json({ message: 'Invalid or expired OTP' });

      customer.password = newPassword;
      customer.otp = undefined;
      customer.otpExpire = undefined;

      await customer.save();

      res.status(200).json({ message: 'Password reset successful' });
   } catch (error) {
      console.error('Reset Password OTP Error:', error);
      res.status(500).json({ message: 'Error resetting password' });
   }
};

export const getAllCustomers = async (req, res) => {
   try {
      const customers = await Customer.aggregate([
         {
            $lookup: {
               from: 'orders',
               localField: '_id',
               foreignField: 'customer',
               as: 'orders',
            },
         },
         {
            $addFields: {
               totalOrders: { $size: '$orders' },
            },
         },
         {
            $project: {
               name: 1,
               email: 1,
               isVerify: 1,
               totalOrders: 1,
               createdAt: 1,
            },
         },
      ]);

      res.status(200).json({
         success: true,
         count: customers.length,
         customers,
      });
   } catch (error) {
      console.error('Get Customers Error:', error);
      res.status(500).json({ message: 'Server error fetching customers' });
   }
};


export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Server error while deleting customer' });
  }
};