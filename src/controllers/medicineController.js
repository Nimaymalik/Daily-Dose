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

async function deleteDoseFromMedication(req, res) {
  const { medicineID } = req.params;
  try {
    const deletedCount = await MedService.deleteDose(medicineID);

    if (deletedCount > 0) {
      res.status(200).json({
        message: `Successfully deleted ${deletedCount} record(s) with medicineID: ${medicineID}`,
      });
    } else {
      res
        .status(404)
        .json({ message: "No records found with the given medicineID." });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error occurred while deleting data.",
      error: err.message,
    });
  }
}

// const updateMedicine = async (req, res) => {
//   const medName = req.params.med_name;

//   const updateData = {
//     drug: req.body.drug,
//     super_food: req.body.super_food || [],
//     bad_food: req.body.bad_food || [],
//     common_symptom: req.body.common_symptom || [],
//     serious_symptom: req.body.serious_symptom || [],
//     treatment: req.body.treatment || [],
//   };
//   console.log("updated",updateData);
  
//   try {
//     const updatedMedicine = await MedService.updateMedicine(
//       medName,
//       updateData
//     );
//     console.log("updatedMedicine",updatedMedicine);

//     if (!updatedMedicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }
//     res.status(200).json({
//       message: "Medicine updated successfully",
//       data: updatedMedicine,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update medicine",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  addDoseToMedication,
  getMedicationsByUser,
  createMedication,
  editInventory,
  // updateMedicine,
  deleteDoseFromMedication,
};
