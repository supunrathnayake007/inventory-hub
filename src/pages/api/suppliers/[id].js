// pages/api/suppliers/[id].js
import * as supplierController from "../../../controllers/supplierController";
import connectDB from "../../../config/db";

connectDB();

export default async (req, res) => {
  try {
    const { method } = req;
    switch (method) {
      case "GET":
        await supplierController.getSupplierById(req, res);
        break;
      case "PUT":
        await supplierController.updateSupplier(req, res);
        break;
      case "DELETE":
        await supplierController.deleteSupplier(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
