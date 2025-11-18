const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const User = require('../models/User');
const { sendInvoiceEmail, verifyEmailSetup } = require('../services/emailService');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

/**
 * @desc    Send invoice to client via email
 * @route   POST /api/invoices/:id/send-email
 * @access  Private
 * 
 * WORKFLOW CONCEPT:
 * 1. Validate invoice exists and user has permission
 * 2. Generate PDF invoice
 * 3. Send email with PDF attachment
 * 4. Update invoice status if needed
 * 5. Return results to frontend
 */
const sendInvoiceEmailController = async (req, res) => {
  try {
    const { customMessage } = req.body;
    
    // Step 1: Fetch and validate invoice
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

    // Step 2: Check if client has email
    if (!invoice.clientId.email) {
      return res.status(400).json({
        success: false,
        message: 'Client does not have an email address'
      });
    }

    // Step 3: Get business info for email personalization
    const user = await User.findById(req.user.id);
    
    // Step 4: Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice, invoice.clientId, user);

    // Step 5: Send email
    const emailResult = await sendInvoiceEmail({
      to: invoice.clientId.email,
      clientName: invoice.clientId.name,
      invoiceNumber: invoice.invoiceNumber,
      pdfBuffer: pdfBuffer,
      businessName: user.companyName || 'InvoiceFlow',
      from: process.env.EMAIL_FROM || 'invoices@yourdomain.com'
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error,
        details: emailResult.details
      });
    }

    // Step 6: Update invoice status to "sent"
    invoice.status = 'sent';
    await invoice.save();

    // Step 7: Return success response
    res.json({
      success: true,
      message: 'Invoice sent successfully',
      data: {
        clientEmail: invoice.clientId.email,
        messageId: emailResult.messageId,
        invoiceStatus: invoice.status
      }
    });

  } catch (error) {
    console.error('Send invoice email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invoice email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Check email service configuration
 * @route   GET /api/email/verify
 * @access  Private
 * 
 * CONCEPT: Helps users verify their email setup before sending
 * Prevents frustration from failed email sends due to configuration issues
 */
const verifyEmailConfiguration = async (req, res) => {
  try {
    const verification = await verifyEmailSetup();
    
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: 'Email service not configured properly',
        error: verification.error
      });
    }

    res.json({
      success: true,
      message: 'Email service is properly configured',
      data: {
        service: 'Resend',
        status: 'Ready'
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email configuration'
    });
  }
};

module.exports = {
  sendInvoiceEmailController,
  verifyEmailConfiguration
};