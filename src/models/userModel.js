const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },

  Allergies: [
    {
      type: String,
    },
  ],

  MedicineId: [
    {
      type: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
