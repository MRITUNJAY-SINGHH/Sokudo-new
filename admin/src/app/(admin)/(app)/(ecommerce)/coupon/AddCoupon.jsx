import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuTicket, LuSparkles } from "react-icons/lu";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const schema = yup.object().shape({
  name: yup.string().required("Coupon name is required"),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .min(1, "Min 1% discount required")
    .max(100, "Max 100% allowed")
    .required("Discount is required"),
  expiry: yup.date().required("Expiry date is required"),
  limit: yup
    .number()
    .typeError("Limit must be a number")
    .min(1, "Limit must be at least 1")
    .required("Usage limit is required"),
});

const AddCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponCode(code);
    toast.success("Coupon code generated!");
  };

  const onSubmit = async (data) => {
    if (!couponCode) {
      toast.error("Please generate a coupon code before submitting");
      return;
    }
    data.code = couponCode;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coupons`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Coupon added successfully!");
      reset();
      setCouponCode("");
    } catch (error) {
      console.error("Error creating coupon:", error.response?.data || error.message);
      toast.error("Failed to create coupon. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-gray-200 w-full max-w-3xl mx-auto my-6">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="p-4 bg-card flex items-center gap-2 border-b border-gray-200 rounded-t-lg">
        <LuTicket className="text-2xl text-gray-700" />
        <h2 className="text-lg font-semibold text-default-800">Add New Coupon</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 gap-4">
        {/* Name */}
        <div>
          <label className="font-medium text-default-700">Coupon Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Enter coupon name"
            className="form-input w-full rounded-lg border-gray-300 focus:ring-gray-900 text-default-700 focus:border-gray-900"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Coupon Code */}
        <div>
          <label className="font-medium text-default-700">Coupon Code</label>
          <div className="flex gap-2">
            <input
              {...register("code")}
              value={couponCode}
              readOnly
              placeholder="Generate coupon code"
              className="form-input flex-1 rounded-lg border-gray-300 focus:ring-gray-900 focus:border-gray-900 uppercase"
            />
            <button
              type="button"
              onClick={generateCouponCode}
              className="bg-card text-default-700 px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <LuSparkles /> Generate
            </button>
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="font-medium text-default-700">Discount (%)</label>
          <input
            {...register("discount")}
            type="number"
            min="1"
            max="100"
            placeholder="Enter discount percentage"
            className="form-input w-full rounded-lg border-gray-300 focus:ring-gray-900 focus:border-gray-900"
          />
          {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>}
        </div>

        {/* Expiry */}
        <div>
          <label className="font-medium text-default-700">Expiry Date</label>
          <input
            {...register("expiry")}
            type="date"
            className="form-input w-full rounded-lg border-gray-300 focus:ring-gray-900 focus:border-gray-900"
          />
          {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>}
        </div>

        {/* Limit */}
        <div>
          <label className="font-medium text-default-700">Usage Limit</label>
          <input
            {...register("limit")}
            type="number"
            min="1"
            placeholder="Max uses allowed"
            className="form-input w-full rounded-lg border-gray-300 focus:ring-gray-900 focus:border-gray-900"
          />
          {errors.limit && <p className="text-red-500 text-sm mt-1">{errors.limit.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-default-500  text-default-800 py-3 rounded-lg  mt-4 transition-all duration-200"
        >
          {loading ? "Submitting..." : "Add Coupon"}
        </button>
      </form>
    </div>
  );
};

export default AddCoupon;
