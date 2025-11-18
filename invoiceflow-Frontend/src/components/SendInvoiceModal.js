import { useState } from 'react';
import { invoicesAPI } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

const SendInvoiceModal = ({ invoice, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [result, setResult] = useState(null);

  /**
   * EMAIL SENDING WORKFLOW:
   * 1. Show loading state
   * 2. Call API to send email
   * 3. Handle success/error responses
   * 4. Update parent component on success
   */
  const handleSendEmail = async () => {
    if (!invoice?.clientId?.email) {
      alert('Client email is required');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await invoicesAPI.sendInvoiceEmail(invoice._id, {
        customMessage: customMessage || undefined
      });

      setResult({
        success: true,
        message: `Invoice sent successfully to ${invoice.clientId.email}`
      });

      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Email sending error:', error);
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to send email'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Send Invoice via Email</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p><strong>Invoice:</strong> {invoice?.invoiceNumber}</p>
          <p><strong>Client:</strong> {invoice?.clientId?.name}</p>
          <p><strong>Email:</strong> {invoice?.clientId?.email}</p>
          <p><strong>Total:</strong> ${invoice?.total?.toFixed(2)}</p>
        </div>

        {/* Custom Message */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Message (Optional)
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add a personal message to your client..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Result Message */}
        {result && (
          <div className={`p-3 rounded mb-4 ${
            result.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {result.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button 
            onClick={handleSendEmail}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Sending...' : 'Send Invoice'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-3">
          The invoice PDF will be attached automatically. 
          Client will receive a professional email with your business information.
        </p>
      </Card>
    </div>
  );
};

export default SendInvoiceModal;