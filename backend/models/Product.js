import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // 🔹 Basic Details
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, default: 0 },
    netExShowroomPrice: { type: Number, required: true },
    rto: { type: Number, required: true },
    handlingCharge: { type: Number, required: true },
    Insurance: { type: Number, required: true },
    onRoadePrice: { type: Number, required: true },

    

    // 🔹 Dynamic Sections (Grouped)
    sections: {
      engineAndTransmission: [sectionSchema],
      dimensionsAndCapacity: [sectionSchema],
      electricals: [sectionSchema],
      tyresAndBrakes: [sectionSchema],
    },

    // 🔹 Multiple Image URLs
    // images: [{ type: String, required: true }],
    colors: [colorSchema],

    // 🔹 Created & Updated By
    createdBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      email: String,
    },
    lastUpdatedBy: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      email: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
