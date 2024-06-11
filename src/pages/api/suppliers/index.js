// pages/api/suppliers/index.js
import * as supplierController from "../../../controllers/supplierController";
import connectDB from "../../../config/db";

connectDB();

export default async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        await supplierController.getAllSuppliers(req, res);
        break;
      case "POST":
        await supplierController.createSupplier(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
