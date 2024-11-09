const jwt = require("jsonwebtoken");
const JWT_SECRET = " mySuperSecretKey";

// generating the jwt
const generateJWT = (userId) => {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "48h" });
    return token;
  } catch (error) {
    console.error("Token generation error", error);
    throw error;
  }
};

const verifyJWT = (token) => {
  try {
    const JWTverify = jwt.verify(token, JWT_SECRET);
    return JWTverify.userId;
  } catch (error) {
    console.error("Invalid or expired token",error);
    throw error;
  }
};

module.exports = {
  generateJWT,
  verifyJWT,
};
