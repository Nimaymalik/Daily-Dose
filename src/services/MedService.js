const Medication = require("../models/medicineModel.js");
const MedID = require("../models/medID.js");

const createMed = async (userId, medicineID) => {
  try {
    if (!medicineID || !medicineID._id) {
      throw new Error("Invalid medicine data");
    }

    const medication = new Medication({
      userId: userId,
      medicineID: medicineID._id,
    });
    console.log("UserID:", userId);

    return await medication.save();
  } catch (error) {
    throw new Error("Error creating medication: " + error.message);
  }
};

const getMedicationsByUser = async (userId) => {
  try {
    return await Medication.find({ userId }).populate("medicineID");
  } catch (error) {
    throw new Error("Error fetching medications: " + error.message);
  }
};

const getMedDetails = async (medicineID) => {
  try {
    return await MedID.findById(medicineID);
  } catch (error) {
    throw new Error("Error fetching medication details: " + error.message);
  }
};

const addDoseToMedication = async (medicineID, dose, time) => {
  try {
    const med = await MedID.findById(medicineID);

    if (!med) {
      throw new Error("Medication not found");
    }

    med.doses.push({ dose, time });

    return await med.save();
  } catch (error) {
    throw new Error("Error adding dose to medication: " + error.message);
  }
};

const deleteDose = async (medicineID, dose, time) => {
  try {
    const medication = await MedID.findById(medicineID);

    if (!medication) {
      throw new Error("Medication not found");
    }

    const doseIndex = medication.doses.findIndex(
      (d) => d.dose === dose && d.time === time
    );

    if (doseIndex === -1) {
      throw new Error("Dose not found");
    }

    medication.doses.splice(doseIndex, 1);

    await medication.save();

    return medication;
  } catch (error) {
    throw new Error("Error deleting dose: " + error.message);
  }
};

module.exports = {
  addDoseToMedication,
  getMedDetails,
  getMedicationsByUser,
  createMed,
  deleteDose,
};
