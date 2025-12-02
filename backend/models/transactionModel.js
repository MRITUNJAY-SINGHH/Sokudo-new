import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
   {
      order: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Order',
      },

      customer: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Customer',
      },

      razorpay_order_id: { type: String, required: true },
      razorpay_payment_id: String,
      razorpay_signature: String,

      amount: { type: Number, required: true },

      status: {
         type: String,
         enum: ['Pending', 'Success', 'Failed'],
         default: 'Pending',
      },
   },
   { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
