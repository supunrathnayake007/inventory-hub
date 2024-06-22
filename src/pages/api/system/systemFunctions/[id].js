import systemFunctionController from "../../../../controllers/system/systemFunctionController";
import connectDB from "../../../../config/db";

connectDB();

export default async (req, res) => {
  const systemFunctionId = req.query.id;

  switch (req.method) {
    // case "GET":
    //   await systemFunctionController.get(req, res, categoryId);
    //   break;
    case "PUT":
      await systemFunctionController.updateSystemFunction(
        req,
        res,
        systemFunctionId
      );
      break;
    case "DELETE":
      await systemFunctionController.deleteSystemFunction(
        req,
        res,
        systemFunctionId
      );
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
