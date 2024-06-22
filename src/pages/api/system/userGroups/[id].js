import userGroupController from "../../../../controllers/system/userGroupController";
import connectDB from "../../../../config/db";

connectDB();

export default async (req, res) => {
  const userGroupId = req.query.id;

  switch (req.method) {
    case "GET":
      await userGroupController.getUserGroupById(req, res, userGroupId);
      break;
    case "PUT":
      await userGroupController.updateUserGroup(req, res, userGroupId);
      break;
    case "DELETE":
      await userGroupController.deleteUserGroup(req, res, userGroupId);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
