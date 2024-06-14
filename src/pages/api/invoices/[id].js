// pages/api/invoices/[id].js
import connectDB from "../../../config/db";
import * as invoiceController from "../../../controllers/invoiceController";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await invoiceController.getInvoiceById(req, res);
      break;
    case "PUT":
      await invoiceController.updateInvoice(req, res);
      break;
    case "DELETE":
      await invoiceController.deleteInvoice(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
