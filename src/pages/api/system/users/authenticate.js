// pages/api/system/users/authenticate.js

import connectDB from "../../../../config/db";
import { verifyToken } from "../../../../middleware/authMiddleware"; // Replace with your token verification utility
import User from "../../../../models/system/User"; // Adjust the path as per your project structure

connectDB();

export default async function authenticate(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const token = req.body.token; // Extract token from request body
        if (!token) {
          return res
            .status(401)
            .json({ error: "Authorization header missing" });
        }
        // Verify and decode the token
        const decoded = await verifyToken(token);

        // Check if user exists in the database
        console.log("decoded.id", decoded.id);
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Authentication successful
        res.status(200).json({ message: "Authentication successful", user });
      } catch (error) {
        res.status(401).json({ error: "Invalid token" });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
