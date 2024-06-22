import systemFunctionController from "../../../../controllers/system/systemFunctionController";
import connectDB from "../../../../config/db";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await systemFunctionController.getSystemFunctions(req, res);
      break;
    case "POST":
      await systemFunctionController.createSystemFunction(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
