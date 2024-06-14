// pages/api/invoices/index.js
import connectDB from "../../../config/db";
import * as invoiceController from "../../../controllers/invoiceController";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await invoiceController.getAllInvoices(req, res);
      break;
    case "POST":
      await invoiceController.createInvoice(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
