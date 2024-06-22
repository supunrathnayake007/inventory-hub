import connectDB from "../../../../config/db";
import {
  getUser,
  updateUser,
} from "../../../../controllers/system/userController";

connectDB();

export default async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      await getUser(req, res);
      break;
    case "POST":
      await updateUser(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
