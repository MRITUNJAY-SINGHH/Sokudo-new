import mongoose from "mongoose";

const testRideSchema = new mongoose.Schema(
  {
    // CUSTOMER REF
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },

    city: { type: String, required: true },
    cityLabel: { type: String, required: true },

    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    modelName: { type: String, required: true },

    // Optional: simple status field
    status: {
      type: String,
      enum: ["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "REQUESTED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TestRide", testRideSchema);
