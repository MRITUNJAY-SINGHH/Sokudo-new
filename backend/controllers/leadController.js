import Lead from '../models/Lead.js';

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const { name, pincode, phone, productInterested } = req.body;

    if (!name || !pincode || !phone || !productInterested) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newLead = await Lead.create({ name, pincode, phone, productInterested });

    res.status(201).json({
      success: true,
      data: newLead,
      message: 'Lead created successfully',
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
