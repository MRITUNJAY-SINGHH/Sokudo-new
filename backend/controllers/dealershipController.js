import Dealership from "../models/Dealership.js";

// 🔹 Add Dealership Form
export const addDealership = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      age,
      qualification,
      presentBusiness,
      address,
      years,
      turnover,
      investment,
      comments,
    } = req.body;

    if (
      !name ||
      !email ||
      !contact ||
      !age ||
      !qualification ||
      !presentBusiness ||
      !address ||
      !years ||
      !turnover ||
      !investment ||
      !comments
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }

    const dealership = await Dealership.create({
      name,
      email,
      contact,
      age,
      qualification,
      presentBusiness,
      address,
      years,
      turnover,
      investment,
      comments,
    });

    res.status(201).json({
      success: true,
      message: "Dealership application submitted successfully",
      dealership,
    });
  } catch (error) {
    console.error("Error adding dealership:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get All Dealership Applications
export const getDealerships = async (req, res) => {
  try {
    const dealerships = await Dealership.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, dealerships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get Dealership by ID
export const getDealershipById = async (req, res) => {
  try {
    const dealership = await Dealership.findById(req.params.id);
    if (!dealership)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    res.status(200).json({ success: true, dealership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Delete Dealership Application
export const deleteDealership = async (req, res) => {
  try {
    const dealership = await Dealership.findById(req.params.id);
    if (!dealership)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    await Dealership.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Dealership application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
