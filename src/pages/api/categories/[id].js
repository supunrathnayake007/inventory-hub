// pages/api/categories/[id].js

import categoryController from "../../../controllers/categoryController";
import connectDB from "../../../config/db";

// Initialize the database connection
connectDB();

export default async (req, res) => {
  const categoryId = req.query.id;

  switch (req.method) {
    case "GET":
      await categoryController.getCategoryById(req, res, categoryId);
      break;
    case "PUT":
      await categoryController.updateCategory(req, res, categoryId);
      break;
    case "DELETE":
      await categoryController.deleteCategory(req, res, categoryId);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
