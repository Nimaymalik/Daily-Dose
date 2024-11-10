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

const deleteDose = async (medicineID) => {
  try {
    const medication = await MedID.findOne(medicineID);

    if (!medication) {
      throw new Error("Medication not found or Dose not found in medication");
    }

    console.log("Doses array before deletion: ", medication.doses);
    console.log("MedicineID provided (dose ID): ", medicineID);

    // Find the index of the dose to be deleted in the doses array
    const doseIndex = medication.doses.findIndex(
      (dose) => dose._id.toString() === medicineID.toString()
    );

    if (doseIndex === -1) {
      throw new Error("Dose not found in medication");
    }

    // Remove the dose from the doses array
    medication.doses.splice(doseIndex, 1);

    console.log("Updated Doses array: ", medication.doses);

    // Save the updated medication document
    await medication.save();

    return medication;
  } catch (error) {
    console.error("Error in deleteDose: ", error.message);
    throw new Error("Error deleting dose: " + error.message);
  }
};

// const updateMedicine = async (medName, updateData) => {
//   console.log(medName,updateData);
//   try {
//     const updatedMedicine = await Medicine.findOneAndUpdate(
//       { med_name: medName },
//       { $set: updateData },
//       { new: true }
//     );
//     return updatedMedicine;
//   } catch (error) {
//     throw new Error("Failed to update medicine: " + error.message);
//   }
// };

module.exports = {
  addDoseToMedication,
  getMedicationsByUser,
  createMed,
  deleteDose,
  // updateMedicine,
  edit,
};
