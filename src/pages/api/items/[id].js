import itemController from "../../../controllers/itemController";
import connectDB from "../../../config/db";

// Initialize the database connection
connectDB();
export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await itemController.getItemById(req, res);
      break;
    case "PUT":
      await itemController.updateItem(req, res);
      break;
    case "DELETE":
      await itemController.deleteItem(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
