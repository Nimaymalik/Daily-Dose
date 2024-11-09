const MedService = require("../services/MedService.js");
const MedID = require("../models/medID.js");
const User = require("../models/userModel.js");

const createMedication = async (req, res) => {
  try {
    const {
      username,
      medDaily,
      medName,
      medQuantity,
      medType,
      medLink,
      doses,
    } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with username "${username}" not found` });
    }

    if (!medDaily || !medName || !medQuantity || !medType || !medLink) {
      return res.status(400).json({ error: "All medication fields required" });
    }

    const newMedId = new MedID({
      medDaily,
      medName,
      medQuantity,
      medType,
      medLink,
      doses: doses || [],
    });

    await newMedId.save();

    user.MedicineId.push(newMedId._id);

    await user.save();

    return res.status(200).json({
      message: "Medication created successfully and added to user",
      // medication: newMedId,
      // user: user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMedicationsByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const medication = await MedService.getMedicationsByUser(username);
    return res.status(200).json(medication);
  } catch (error) {
    console.error("Error fetching medications:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const editInventory = async (req, res) => {
  const { medicineID, quantity } = req.body;

  try {
    const updatedMedicine = await MedService.edit(medicineID, quantity);

    if (updatedMedicine) {
      return res.status(200).send({
        message: "Inventory updated successfully",
        updatedMedicine,
      });
    } else {
      return res.status(404).send({ message: "Medicine not found" });
    }
  } catch (error) {
    console.error("Error in editing inventory", error);
    return res.status(500).send({
      message: "Internal server error while editing inventory",
      error: error.message,
    });
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
      return res
        .status(400)
        .json({ error: "All fields medicineID, dose, time are required" });
    }

    const updatedMedication = await MedService.deleteDose(
      medicineID,
      dose,
      time
    );

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
  getMedicationsByUser,
  createMedication,
  editInventory,
  deleteDoseFromMedication,
};
