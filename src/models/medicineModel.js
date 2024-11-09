const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  medicineID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedId",
    required: true,
  },
});

const Medication = mongoose.model("Medication", medicationSchema);
module.exports = Medication;
