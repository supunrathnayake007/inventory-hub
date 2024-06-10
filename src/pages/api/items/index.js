import itemController from "../../../controllers/itemController";
import connectDB from "../../../config/db";

// Initialize the database connection
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await itemController.getItems(req, res);
      break;
    case "POST":
      await itemController.createItem(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
