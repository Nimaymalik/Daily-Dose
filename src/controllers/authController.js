const userService = require("../services/userService.js");
const jwtProvider = require("../JWTvalidator/jwtProvider.js");
const bcrypt = require("bcrypt");

const SignUp = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    const jwt = jwtProvider.generateJWT(user._id);

    return res.status(200).send({ jwt, message: "SignUp Success" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userService.findUserByUsername(username);
    if (!user) {
      return res.status(404).send({ message: `${username} not found` });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: "Invalid Password" });
    }

    const jwt = jwtProvider.generateJWT(user._id);
    return res.status(200).send({
      message: "Login successful",
      jwt,
      name: user.name,
      username: user.username,
      Allergies: user.Allergies,
      pinCode: user.pinCode,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
module.exports = { SignUp, login };
