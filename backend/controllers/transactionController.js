import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/transactionModel.js';
import Order from '../models/orderModel.js';
import Customer from '../models/customerModel.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
   try {
      const customerId = req.user.id;

      const { amount, productName, customerName, email, contactNumber,
      model,
      color,
      state,
      city,
      pincode,
      address,landmark, paymentMethod } =
         req.body;

      if (!customerId) {
         return res.status(401).json({ message: 'User not authenticated.' });
      }

      // 1. Create Razorpay Order
      const razorpayOrder = await razorpay.orders.create({
         amount: amount * 100,
         currency: 'INR',
         receipt: `rcpt_${Date.now()}`,
      });

      const newOrder = await Order.create({
         customer: customerId,
         orderId: razorpayOrder.id,
         productName,
         customerName,
         email,
         contactNumber,
      model,
      color,
      state,
      city,
      pincode,
      address,
      landmark,
         amount,
         paymentMethod,
         paymentStatus: 'Pending',
      });

      const newTransaction = await Transaction.create({
         customer: customerId,
         order: newOrder._id,
         razorpay_order_id: razorpayOrder.id,
         amount,
         status: 'Pending',
      });

      newOrder.transaction = newTransaction._id;
      await newOrder.save();

      res.json({
         success: true,
         message: 'Order created successfully.',
         razorpay_order_id: razorpayOrder.id,
         db_order_id: newOrder._id,
         amount: razorpayOrder.amount,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: 'Error creating order.',
      });
   }
};

export const verifyPayment = async (req, res) => {
   try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
         req.body;

      const customerId = req.user.id;

      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
         .update(sign)
         .digest('hex');

      if (expectedSign !== razorpay_signature) {
         return res.status(400).json({ message: 'Invalid Signature' });
      }

      const updatedTransaction = await Transaction.findOneAndUpdate(
         { razorpay_order_id: razorpay_order_id },
         {
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            status: 'Success',
         },
         { new: true }
      );

      if (!updatedTransaction) {
         return res.status(404).json({ message: 'Transaction not found.' });
      }

      const updatedOrder = await Order.findOneAndUpdate(
         { orderId: razorpay_order_id },
         {
            paymentStatus: 'Paid',
         },
         { new: true }
      );

      // 1️⃣ Fetch product by name (ya ideally productId store karo order me)
const product = await Product.findOne({ name: updatedOrder.productName });

if (product) {
  // 2️⃣ Deduct stock (1 item per order example, adjust for quantity if added)
  product.stock -= 1;
  if (product.stock < 0) product.stock = 0; // prevent negative stock
  await product.save();
}

      if (!updatedOrder) {
         return res.status(404).json({ message: 'Order not found.' });
      }



      await Customer.findByIdAndUpdate(customerId, {
         $push: { orders: updatedOrder._id },
      });

      res.json({
         success: true,
         message: 'Payment verified successfully',
         orderId: updatedOrder._id,
         transactionId: updatedTransaction._id,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: 'Payment verification failed.',
      });
   }
};

export const handleFailedPayment = async (req, res) => {
   try {
      const { razorpay_order_id } = req.body;

      const updatedTransaction = await Transaction.findOneAndUpdate(
         { razorpay_order_id: razorpay_order_id },
         { status: 'Failed' },
         { new: true }
      );

      if (!updatedTransaction) {
         return res.status(404).json({ message: 'Transaction not found.' });
      }

      // 2. Find and Update Order
      await Order.findOneAndUpdate(
         { orderId: razorpay_order_id },
         { paymentStatus: 'Failed' }
      );

      res.json({ success: true, message: 'Payment failure logged.' });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: 'Error logging payment failure.',
      });
   }
};






export const getAllTransactions = async (req, res) => {
   try {
      const transactions = await Transaction.find()
         .populate({
            path: 'order',
            select:
               'productName amount paymentStatus model color state city pincode address landmark createdAt',
         })
         .populate({
            path: 'customer',
            select: 'name email phone',
         })
         .sort({ createdAt: -1 });

      res.json({
         success: true,
         count: transactions.length,
         data: transactions,
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         success: false,
         message: 'Error fetching transactions.',
      });
   }
};



export const getTransactionById = async (req, res) => {
   try {
      const { id } = req.params;

      const transaction = await Transaction.findById(id)
         .populate({
            path: 'order',
            select:
               'productName amount paymentStatus model color state city pincode address landmark createdAt',
         })
         .populate({
            path: 'customer',
            select: 'name email phone',
         });

      if (!transaction) {
         return res.status(404).json({ message: 'Transaction not found.' });
      }

      res.json({
         success: true,
         data: transaction,
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         success: false,
         message: 'Error fetching transaction details.',
      });
   }
};
