import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

export const getAllOrders = async (req, res) => {
   try {
      const orders = await Order.find()
         .populate('customer', 'name email')
         .populate('transaction', 'status razorpay_payment_id')
         .sort({ createdAt: -1 });
      res.json(orders);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: 'Error fetching orders.',
      });
   }
};

export const getMyOrders = async (req, res) => {
   try {
      const customerId = req.user.id;

      const orders = await Order.find({ customer: customerId })
         .populate('transaction', 'status amount')
         .sort({ createdAt: -1 });

      if (!orders) {
         return res.json([]);
      }

      res.json(orders);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: 'Error fetching your orders.',
      });
   }
};

export const updateOrderStatus = async (req, res) => {
   const { id } = req.params;
   const { deliveryStatus } = req.body;

   const order = await Order.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true }
   );
   res.json(order);
};


export const getOrderStats = async (req, res) => {
   try {
      //  Total orders
      const totalOrders = await Order.countDocuments();

      //  Pending orders (payment not done)
      const pendingOrders = await Order.countDocuments({ paymentStatus: 'Pending' });

      //  Shipping orders (in progress)
      const shippingOrders = await Order.countDocuments({ deliveryStatus: 'Shipping' });

      //  Delivered orders (successfully completed)
      const deliveredOrders = await Order.countDocuments({ deliveryStatus: 'Delivered' });

      //  Cancelled orders
      const cancelledOrders = await Order.countDocuments({ deliveryStatus: 'Cancelled' });

      //  New orders (created within last 7 days)
      const newOrders = await Order.countDocuments({
         createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
         },
      });

      res.status(200).json({
         totalOrders,
         pendingOrders,
         shippingOrders,
         deliveredOrders,
         cancelledOrders,
         newOrders,
      });
   } catch (err) {
      console.log(' Error fetching order stats:', err);
      res.status(500).json({
         success: false,
         message: 'Error fetching order statistics.',
      });
   }
};


//  Monthly Orders Overview
export const getOrdersOverview = async (req, res) => {
   try {
      const currentYear = new Date().getFullYear();

      // Aggregate orders grouped by month
      const monthlyOrders = await Order.aggregate([
         {
            $match: {
               createdAt: {
                  $gte: new Date(`${currentYear}-01-01`),
                  $lte: new Date(`${currentYear}-12-31`),
               },
            },
         },
         {
            $group: {
               _id: { $month: "$createdAt" },
               totalOrders: { $sum: 1 },
            },
         },
         { $sort: { "_id": 1 } },
      ]);

      // Map data into [Jan–Dec] array
      const months = [
         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const monthlyData = new Array(12).fill(0);
      monthlyOrders.forEach((item) => {
         monthlyData[item._id - 1] = item.totalOrders;
      });

      res.json({
         months,
         series: [
            {
               name: "Orders",
               data: monthlyData,
            },
         ],
      });
   } catch (error) {
      console.error(" Error generating orders overview:", error);
      res.status(500).json({
         success: false,
         message: "Error generating monthly order data.",
      });
   }
};






// ✅ Get Single Order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('customer', 'name email contact address')
      .populate('transaction', 'status amount razorpay_payment_id')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details.',
    });
  }
};

// ✅ Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.findByIdAndDelete(id);

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order.',
    });
  }
};



