const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const User = require('../models/User');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

/**
 * @desc    Generate and download PDF for an invoice
 * @route   GET /api/invoices/:id/pdf
 * @access  Private
 * 
 * CONCEPT: Streams PDF directly to client without saving files on server
 * This is efficient and secure - no file storage required
 */
const generateInvoicePDFController = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId');
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Verify user owns the invoice
    if (invoice.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this invoice'
      });
    }

    // Get user/business info for PDF header
    const user = await User.findById(req.user.id);
    
    // Generate PDF buffer
    const pdfBuffer = await generateInvoicePDF(invoice, invoice.clientId, user);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF to client
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Preview PDF in browser (inline)
 * @route   GET /api/invoices/:id/preview
 * @access  Private
 * 
 * CONCEPT: Same as download but opens in browser instead of downloading
 * Useful for quick previews before sending to clients
 */
const previewInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId');
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    if (invoice.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.user.id);
    const pdfBuffer = await generateInvoicePDF(invoice, invoice.clientId, user);
    
    // Different header for inline preview vs download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF preview'
    });
  }
};

module.exports = {
  generateInvoicePDFController,
  previewInvoicePDF
};