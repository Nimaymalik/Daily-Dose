const mongoose = require("mongoose");

const doseSchema = new mongoose.Schema({
  dose: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },
});

const MedIDSchema = new mongoose.Schema({
  medDaily: {
    type: Number,
    required: true,
  },

  medName: {
    type: String,
    required: true,
  },
  medQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  medType: {
    type: String,
    required: true,
  },
  doses: [doseSchema],
});

const MedID = mongoose.model("MedId", MedIDSchema);
module.exports = MedID;
