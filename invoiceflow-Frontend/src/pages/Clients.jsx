import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { clientsAPI } from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getClients();
      setClients(response.data.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientsAPI.createClient(formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: { street: '', city: '', state: '', zipCode: '', country: '' }
      });
      loadClients();
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading clients...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600">Manage your clients and their information</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            + Add Client
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Client</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Client Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Address (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Street"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, street: e.target.value}
                    })}
                  />
                  <Input
                    label="City"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, city: e.target.value}
                    })}
                  />
                  <Input
                    label="State"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, state: e.target.value}
                    })}
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, zipCode: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button type="submit">Save Client</Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client._id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{client.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Client
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 {client.email}</p>
                {client.phone && <p>📞 {client.phone}</p>}
                {client.address?.city && (
                  <p>📍 {client.address.city}, {client.address.state}</p>
                )}
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button variant="secondary" size="sm">Edit</Button>
                <Button variant="secondary" size="sm">View Invoices</Button>
              </div>
            </Card>
          ))}
        </div>

        {clients.length === 0 && !showForm && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
            <p className="text-gray-600 mb-4">Add your first client to start creating invoices</p>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Client
            </Button>
          </Card>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Clients;