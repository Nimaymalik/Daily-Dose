const jwt = require("jsonwebtoken");
const JWT_SECRET = " mySuperSecretKey";

// generating the jwt
const generateJWT = (userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "12h" });
  return token;
};

const verifyJWT = (token) => {
  try {
    const JWTverify = jwt.verify(token, JWT_SECRET);
    return JWTverify;
  } catch (error) {
    console.log("Invalid or expired token");
  }
};

module.exports = {
  generateJWT,
  verifyJWT,
};
