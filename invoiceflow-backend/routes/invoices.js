const express = require('express');
const { 
  getInvoices, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice,
  getInvoice 
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getInvoices)
  .post(protect, createInvoice);

router.route('/:id')
  .get(protect, getInvoice)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

module.exports = router;