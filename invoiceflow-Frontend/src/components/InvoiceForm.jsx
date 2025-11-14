import { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { clientsAPI, invoicesAPI } from '../services/api';

const InvoiceForm = ({ onSuccess, editInvoice = null }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    dueDate: '',
    taxRate: 0,
    notes: '',
    items: [{ description: '', quantity: 1, price: 0 }]
  });

  useEffect(() => {
    loadClients();
    if (editInvoice) {
      setFormData({
        clientId: editInvoice.clientId._id || editInvoice.clientId,
        dueDate: editInvoice.dueDate.split('T')[0],
        taxRate: editInvoice.taxRate,
        notes: editInvoice.notes,
        items: editInvoice.items
      });
    }
  }, [editInvoice]);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getClients();
      setClients(response.data.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editInvoice) {
        await invoicesAPI.updateInvoice(editInvoice._id, formData);
      } else {
        await invoicesAPI.createInvoice(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client *
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.email}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Due Date *"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Items *
        </label>
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="flex space-x-3 items-start">
              <Input
                placeholder="Item description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="flex-1"
                required
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="w-20"
                min="1"
                required
              />
              <Input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                className="w-32"
                min="0"
                step="0.01"
                required
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => removeItem(index)}
                disabled={formData.items.length === 1}
                className="mt-1"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" onClick={addItem} className="mt-3">
          + Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Tax Rate (%)"
          type="number"
          value={formData.taxRate}
          onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
          min="0"
          max="100"
          step="0.1"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Totals Display */}
      <Card className="bg-gray-50">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-right">Subtotal:</div>
          <div className="font-medium">${subtotal.toFixed(2)}</div>
          
          <div className="text-right">Tax ({formData.taxRate}%):</div>
          <div className="font-medium">${taxAmount.toFixed(2)}</div>
          
          <div className="text-right border-t pt-2 font-semibold">Total:</div>
          <div className="border-t pt-2 font-semibold text-lg">${total.toFixed(2)}</div>
        </div>
      </Card>

      <div className="flex space-x-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (editInvoice ? 'Update Invoice' : 'Create Invoice')}
        </Button>
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;