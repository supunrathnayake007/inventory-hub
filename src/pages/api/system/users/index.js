import connectDB from "../../../../config/db";
import { register, login } from "../../../../controllers/system/userController";

connectDB();

export default async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      if (req.body.action === "register") {
        await register(req, res);
      } else if (req.body.action === "login") {
        await login(req, res);
      } else {
        res.status(400).json({ error: "Invalid action" });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
