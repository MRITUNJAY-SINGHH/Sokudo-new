import mongoose from "mongoose";

const dealershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    age: { type: Number, required: true },
    qualification: { type: String, required: true },
    presentBusiness: { type: String, required: true },
    address: { type: String, required: true },
    years: { type: String, required: true },
    turnover: { type: String, required: true },
    investment: { type: String, required: true },
    comments: { type: String, required: true },
  },
  { timestamps: true }
);

const Dealership = mongoose.model("Dealership", dealershipSchema);
export default Dealership;
