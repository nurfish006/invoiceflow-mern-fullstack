import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import InvoiceForm from '../components/InvoiceForm';
import { invoicesAPI } from '../services/api';
import { downloadPDF, previewPDF } from '../utils/pdfDownload';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await invoicesAPI.getInvoices();
      setInvoices(response.data.data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingInvoice(null);
    loadInvoices();
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.draft;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading invoices...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }
// Download PDF
  const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
    try {
      // Show loading state
      setLoading(true);
      
      const response = await invoicesAPI.downloadPDF(invoiceId);
      downloadPDF(response.data, `invoice-${invoiceNumber}.pdf`);
      
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };
//Preview PDF in browser
  const handlePreviewPDF = async (invoiceId) => {
    try {
      setLoading(true);
      const response = await invoicesAPI.previewPDF(invoiceId);
      previewPDF(response.data);
    } catch (error) {
      console.error('PDF preview error:', error);
      alert('Error generating PDF preview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">Manage and track your invoices</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            + Create Invoice
          </Button>
        </div> 

        {showForm && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h3>
            <InvoiceForm 
              onSuccess={handleSuccess} 
              editInvoice={editingInvoice}
            />
          </Card>
        )}

        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice._id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Client:</strong> {invoice.clientId?.name || 'Unknown Client'}
                    </div>
                    <div>
                      <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Total:</strong> {formatCurrency(invoice.total)}
                    </div>
                  </div>

                  {invoice.notes && (
                    <p className="text-sm text-gray-500 mt-2">{invoice.notes}</p>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {/* PDF ACTIONS */}
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handlePreviewPDF(invoice._id)}
              title="Preview PDF"
            >
              👁️ Preview
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleDownloadPDF(invoice._id, invoice.invoiceNumber)}
              title="Download PDF"
            >
              📥 Download
            </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      setEditingInvoice(invoice);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this invoice?')) {
                        try {
                          await invoicesAPI.deleteInvoice(invoice._id);
                          loadInvoices();
                        } catch (error) {
                          console.error('Error deleting invoice:', error);
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {invoices.length === 0 && !showForm && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-4">Create your first invoice to get started</p>
            <Button onClick={() => setShowForm(true)}>
              Create Your First Invoice
            </Button>
          </Card>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Invoices;