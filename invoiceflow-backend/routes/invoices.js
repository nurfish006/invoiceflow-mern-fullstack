const express = require('express');
const { 
  getInvoices, 
  getInvoice,
  createInvoice, 
  updateInvoice, 
  deleteInvoice 
} = require('../controllers/invoiceController');
const { 
  generateInvoicePDFController, 
  previewInvoicePDF 
} = require('../controllers/pdfController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getInvoices)
  .post(protect, createInvoice);

router.route('/:id')
  .get(protect, getInvoice)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

router.route('/:id/pdf')
  .get(protect, generateInvoicePDFController);

router.route('/:id/preview')  
  .get(protect, previewInvoicePDF);

module.exports = router;