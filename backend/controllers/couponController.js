import Coupon from "../models/Coupon.js";

//  Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const { name, code, discount, expiry, limit } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existing = await Coupon.findOne({ code });
    if (existing)
      return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      name,
      code,
      discount,
      expiry,
      limit,
      createdBy: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      updatedBy: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error(error); // ✅ log for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//  Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Get single coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    Object.assign(coupon, req.body);

    // Track last updater
    coupon.updatedBy = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    };

    await coupon.save();
    res.json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
