import TestRide from "../models/TestRide.js";

/* ------------------------------------------------
   CREATE SIMPLE TEST RIDE (NO PAYMENT)
--------------------------------------------------*/
export const createTestRide = async (req, res) => {
  try {
    const {
      name,
      phone,
      pincode,
      date,
      time,
      city,
      cityLabel,
      modelId,
      modelName,
    } = req.body;

    if (
      !name ||
      !phone ||
      !pincode ||
      !date ||
      !time ||
      !city ||
      !cityLabel ||
      !modelId ||
      !modelName
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are missing",
      });
    }

    const testRide = await TestRide.create({
      customer: req.user._id, // from protect middleware
      name,
      phone,
      pincode,
      date,
      time,
      city,
      cityLabel,
      modelId,
      modelName,
    });

    res.status(201).json({
      success: true,
      message: "Test ride booked successfully",
      testRide,
    });
  } catch (error) {
    console.error("Create test ride error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create test ride",
    });
  }
};

/* ------------------------------------------------
   GET LOGGED-IN CUSTOMER TEST RIDES
--------------------------------------------------*/
export const getMyTestRides = async (req, res) => {
  try {
    const rides = await TestRide.find({
      customer: req.user._id,
    })
      .populate("modelId", "name images")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rides,
    });
  } catch (error) {
    console.error("Get my test rides error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch test rides",
    });
  }
};



/* ------------------------------------------------
   GET ALL TEST RIDES (ADMIN)
--------------------------------------------------*/
export const getAllTestRides = async (req, res) => {
  try {
    const rides = await TestRide.find()
      .populate("customer", "name email phone")
      .populate("modelId", "name images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Get all test rides error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch test ride bookings",
    });
  }
};
