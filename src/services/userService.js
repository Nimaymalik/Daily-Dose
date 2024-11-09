const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");

const createUser = async (userData) => {
  try {
    const { name, username, password, pinCode, Allergies } = userData;

    const userExist = await User.findOne({ username });
    
    if (userExist) {
      throw new Error(`Username "${username}" already exists`);
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      password: hashpassword,
      pinCode,
      Allergies,
    });

    console.log("Created User", user);
    return user;
  } catch (error) {
    throw new Error(`Error creating User: ${error.message}`);
  }
};

const findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found with id:", userId);
    }
  } catch (error) {
    throw new Error("User Id not found", error.message);
  }
};
module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};
