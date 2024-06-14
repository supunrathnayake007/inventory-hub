// controllers/invoiceController.js
const invoiceService = require("../services/invoiceService");
const { ObjectId } = require("mongodb");

exports.createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const invoice = await invoiceService.getInvoiceById(objectId);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const updatedInvoice = await invoiceService.updateInvoice(
      objectId,
      req.body
    );
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    await invoiceService.deleteInvoice(objectId);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
