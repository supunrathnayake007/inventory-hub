import userGroupController from "../../../../controllers/system/userGroupController";
import connectDB from "../../../../config/db";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await userGroupController.getUserGroups(req, res);
      break;
    case "POST":
      await userGroupController.createUserGroup(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
