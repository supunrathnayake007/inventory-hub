import * as inventoryTransactionController from "../../../controllers/inventoryTransactionController";
import connectDB from "../../../config/db";

connectDB();

export default async (req, res) => {
  try {
    const { method } = req;
    switch (method) {
      case "GET":
        await inventoryTransactionController.getInventoryTransactions(req, res);
        break;
      case "POST":
        await inventoryTransactionController.createInventoryTransaction(
          req,
          res
        );
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
