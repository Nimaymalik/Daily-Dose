const Medication = require("../models/medicineModel.js");
const MedID = require("../models/medID.js");
const User = require("../models/userModel.js");

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

const getMedicationsByUser = async (username) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const medicineDetails = await Promise.all(
      user.MedicineId.map(async (id) => {
        const medicine = await MedID.findOne({ _id: id });

        if (!medicine) {
          return null;
        }
        const doses = medicine.doses.map((dose) => ({
          dose: dose.dose,
          time: dose.time,
        }));
        console.log(medicine.medLink);
        return {
          _id: medicine._id,
          medDaily: medicine.medDaily,
          medName: medicine.medName,
          medQuantity: medicine.medQuantity,
          medType: medicine.medType,
          medLink: medicine.medLink,
          dose: doses,
        };
      })
    );

    console.log(medicineDetails);
    return {
      medicineDetails,
    };
  } catch (error) {
    throw new Error("Error fetching medications: " + error.message);
  }
};

const edit = async (medicineID, quantity) => {
  try {
  
    const medicine = await MedID.findById(medicineID);

    if (!medicine) {
      throw new Error("Medicine not found");
    }
    if (quantity !== undefined) {
      medicine.medQuantity = quantity;
    }

    const updatedMedicine = await medicine.save();

    return updatedMedicine;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating medicine in the inventory");
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
  getMedicationsByUser,
  createMed,
  deleteDose,
  edit,
};
