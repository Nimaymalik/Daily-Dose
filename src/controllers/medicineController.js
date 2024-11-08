const { mongoose } = require("mongoose");
const MedService = require("../services/MedService.js");
const MedID = require("../models/medID.js");

const createMedication = async (req, res) => {
  try {
    const { userId, medDaily, medName, medQuantity, medType, doses } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "userId is invalid" });
    }

    // Validate the rest of the fields
    if (!medDaily || !medName || !medQuantity || !medType) {
      return res.status(400).json({ error: "All medication fields required" });
    }

    const newMedId = new MedID({
      medDaily,
      medName,
      medQuantity,
      medType,
      doses: doses || [],
    });

    await newMedId.save();

    const newMedication = MedService.createMed(userId, newMedId);

    return res.status(201).json({
      medication: newMedication,
      medId: newMedId._id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMedicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const medications = await MedService.getMedicationsByUser(userId);

    return res.status(200).json({ medications });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMedDetails = async (req, res) => {
  try {
    const { medicineID } = req.params;

    const medDetails = await MedService.getMedDetails(medicineID);

    if (!medDetails) {
      return res.status(404).json({ message: "Medication not found" });
    }

    return res.status(200).json({ medDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addDoseToMedication = async (req, res) => {
  try {
    const { medicineID, dose, time } = req.body;

    const updatedMed = await MedService.addDoseToMedication(
      medicineID,
      dose,
      time
    );

    return res.status(200).json({ updatedMed });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteDoseFromMedication = async (req, res) => {
  try {
    const { medicineID, dose, time } = req.body;

    if (!medicineID || !dose || !time) {
      return res.status(400).json({ error: "All fields medicineID, dose, time are required" });
    }

    const updatedMedication = await MedService.deleteDose(medicineID, dose, time);

    return res.status(200).json({
      message: "Dose deleted successfully",
      updatedMedication,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addDoseToMedication,
  getMedDetails,
  getMedicationsByUser,
  createMedication,
  deleteDoseFromMedication
};
