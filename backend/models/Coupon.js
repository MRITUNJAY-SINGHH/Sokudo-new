import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Coupon name is required"], trim: true },
    code: { type: String, required: [true, "Coupon code is required"], unique: true, uppercase: true },
    discount: { type: Number, required: [true, "Discount is required"], min: 1, max: 100 },
    expiry: { type: Date, required: [true, "Expiry date is required"] },
    limit: { type: Number, required: [true, "Usage limit is required"], min: 1 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // ✅ Track who created and last updated the coupon
    createdBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String },
      email: { type: String },
    },
    updatedBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
