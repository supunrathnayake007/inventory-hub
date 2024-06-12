import purchaseOrderController from "../../../controllers/purchaseOrderController";
import connectDB from "../../../config/db";

connectDB();

export default async (req, res) => {
  try {
    const { method } = req;
    switch (method) {
      case "GET":
        await purchaseOrderController.getPurchaseOrderById(req, res);
        break;
      case "PUT":
        await purchaseOrderController.updatePurchaseOrder(req, res);
        break;
      case "DELETE":
        await purchaseOrderController.deletePurchaseOrder(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
