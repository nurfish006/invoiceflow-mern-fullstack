const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an invoice to a client via email
 * @param {Object} options - Email options
 * @param {string} options.to - Client email address
 * @param {string} options.clientName - Client name for personalization
 * @param {string} options.invoiceNumber - Invoice identifier
 * @param {Buffer} options.pdfBuffer - PDF invoice file
 * @param {string} options.businessName - Sender business name
 * @param {string} options.from - Sender email (must be verified in Resend)
 * @returns {Promise<Object>} - Email sending result
 */
const sendInvoiceEmail = async ({
  to,
  clientName,
  invoiceNumber,
  pdfBuffer,
  businessName = 'InvoiceFlow',
  from = 'invoices@yourdomain.com' // Must be verified in Resend dashboard
}) => {
  try {
    /**
     * EMAIL TEMPLATE CONCEPT:
     * - Professional business communication
     * - Personalization with client name
     * - Clear call-to-action to view invoice
     * - PDF attachment for official records
     */
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${businessName}</h1>
        </div>
        <div class="content">
            <h2>Invoice #${invoiceNumber}</h2>
            <p>Dear ${clientName},</p>
            <p>Please find your invoice #${invoiceNumber} attached to this email.</p>
            <p>This invoice includes all items and services provided, along with payment terms and due date.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">View Invoice Details</a>
            </div>
            
            <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
            <p>Thank you for your business!</p>
        </div>
        <div class="footer">
            <p>This is an automated email from ${businessName}. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
    `;

    const emailData = {
      from: `${businessName} <${from}>`,
      to: [to],
      subject: `Invoice #${invoiceNumber} from ${businessName}`,
      html: emailTemplate,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    console.log(`Sending invoice email to: ${to}`);
    const result = await resend.emails.send(emailData);
    
    console.log('Email sent successfully:', result);
    return {
      success: true,
      messageId: result.data?.id,
      clientEmail: to
    };

  } catch (error) {
    console.error('Email sending error:', error);
    
    /**
     * ERROR HANDLING CONCEPT:
     * - Differentiate between validation errors and service errors
     * - Provide user-friendly error messages
     * - Log detailed errors for debugging
     */
    let userMessage = 'Failed to send email';
    
    if (error.message?.includes('validation')) {
      userMessage = 'Invalid email address or missing required fields';
    } else if (error.message?.includes('rate limit')) {
      userMessage = 'Email rate limit exceeded. Please try again later.';
    }
    
    return {
      success: false,
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

/**
 * WHY SEPARATE FUNCTION FOR VERIFICATION:
 * - Email domain verification is a prerequisite for sending
 * - Helps users troubleshoot setup issues
 * - Provides clear feedback during development
 */
const verifyEmailSetup = async () => {
  if (!process.env.RESEND_API_KEY) {
    return {
      valid: false,
      error: 'RESEND_API_KEY environment variable is required'
    };
  }

  // In a real implementation, you might check domain verification status
  // For now, we'll just validate the API key format
  const apiKeyRegex = /^re_[a-zA-Z0-9]{40}$/;
  if (!apiKeyRegex.test(process.env.RESEND_API_KEY)) {
    return {
      valid: false,
      error: 'Invalid Resend API key format'
    };
  }

  return { valid: true };
};

module.exports = {
  sendInvoiceEmail,
  verifyEmailSetup
};