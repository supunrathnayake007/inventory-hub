// middleware/authMiddleware.js

import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export const verifyToken = (token) => {
  try {
    //console.log("token", token);
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
