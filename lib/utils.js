const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("../lib/db");

async function signToken(user) {
  const secret = Buffer.from(process.env.JWT_SECRET, "base64");

  return jwt.sign({ email: user.email, id: user.id, roles: ["USER"] }, secret, {
    expiresIn: 3600 // expires in 1hr
  });
}

async function getUserFromToken(token) {
  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const decoded = jwt.verify(token.replace("Bearer ", ""), secret);

  return decoded;
}

async function login(args) {
  try {
    const user = await getUserByEmail(args.email);
    if (user) {
      const isValidPassword = await comparePassword(
        args.password,
        user.passwordHash
      );
  
      if (isValidPassword) {
        const token = await signToken(user);
        return Promise.resolve({ auth: true, token: token, status: "SUCCESS" });
      } else {
        return Promise.resolve({ statusCode: 401, message: "incorrect password"});
      }
    } else {
      return Promise.resolve({ statusCode: 401, message: "user not found"});
    }
  } catch (err) {
    console.error("Error login", err);
    return Promise.reject(new Error(err));
  }
}

function comparePassword(eventPassword, userPassword) {
  return bcrypt.compare(eventPassword, userPassword);
}

module.exports = {
  signToken,
  getUserFromToken,
  login
};
