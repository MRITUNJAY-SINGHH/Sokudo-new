import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
   {
      customer: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Customer',
      },

      transaction: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Transaction',
      },

      orderId: { type: String, required: true },
      productName: { type: String, required: true },
      // productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

      customerName: { type: String, required: true },
      email: { type: String, required: true },

      model: { type: String, required: true },
    color: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    address: { type: String },
    landmark:{type:String},

      amount: { type: Number, required: true },
      paymentMethod: { type: String, required: true },
      paymentStatus: {
         type: String,
         enum: ['Pending', 'Paid', 'Failed'],
         default: 'Pending',
      },

      deliveryStatus: { type: String, default: 'Pending' },
   },
   { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
