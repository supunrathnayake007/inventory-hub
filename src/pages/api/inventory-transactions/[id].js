import * as inventoryTransactionController from "../../../controllers/inventoryTransactionController";
import connectDB from "../../../config/db";

connectDB();

export default async (req, res) => {
  try {
    const { method } = req;
    switch (method) {
      case "GET":
        await inventoryTransactionController.getInventoryTransactionById(
          req,
          res
        );
        break;
      case "PUT":
        await inventoryTransactionController.updateInventoryTransaction(
          req,
          res
        );
        break;
      case "DELETE":
        await inventoryTransactionController.deleteInventoryTransaction(
          req,
          res
        );
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
