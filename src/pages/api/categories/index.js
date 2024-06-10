// pages/api/categories/index.js

import categoryController from "../../../controllers/categoryController";
import connectDB from "../../../config/db";

// Initialize the database connection
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await categoryController.getCategories(req, res);
      break;
    case "POST":
      await categoryController.createCategory(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
