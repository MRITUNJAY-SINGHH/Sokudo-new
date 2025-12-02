import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  cv: { type: String, required: true },
}, { timestamps: true });
 
export default mongoose.model("Career", careerSchema);
