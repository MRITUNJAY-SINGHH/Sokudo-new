import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      googleId: { type: String },
      provider: { type: String },
      avatar: { type: String },
      isVerify: { type: Boolean, default: false },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      otp: String,
      otpExpire: Date,
      orders: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
         },
      ],
   },
   { timestamps: true }
);

// Compare password
customerSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before save
customerSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
