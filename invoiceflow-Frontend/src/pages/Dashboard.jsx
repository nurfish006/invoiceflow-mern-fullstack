// src/pages/Dashboard.jsx - UPDATED
import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { invoicesAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    outstanding: 0,
    paidThisMonth: 0,
    overdue: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await invoicesAPI.getInvoices();
      const invoices = response.data.data;
      
      calculateStats(invoices);
      setRecentInvoices(invoices.slice(0, 3)); // Show 3 most recent
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (invoices) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const stats = {
      totalInvoices: invoices.length,
      outstanding: 0,
      paidThisMonth: 0,
      overdue: 0
    };

    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        const paidDate = new Date(invoice.updatedAt);
        if (paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear) {
          stats.paidThisMonth += invoice.total;
        }
      } else if (invoice.status === 'overdue') {
        stats.overdue += invoice.total;
      } else if (['sent', 'viewed', 'draft'].includes(invoice.status)) {
        stats.outstanding += invoice.total;
      }
    });

    setStats(stats);
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

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading dashboard...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your business today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-yellow-600">${stats.outstanding.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                <p className="text-2xl font-bold text-green-600">${stats.paidThisMonth.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">${stats.overdue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions & Recent Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start"
                onClick={() => window.location.href = '/invoices?create=new'}
              >
                ➕ Create New Invoice
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/clients'}
              >
                👥 Manage Clients
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/invoices'}
              >
                📊 View All Invoices
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <div key={invoice._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">
                      {invoice.clientId?.name} • ${invoice.total}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              ))}
              
              {recentInvoices.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">
                  No invoices yet. <a href="/invoices" className="text-primary-600 hover:underline">Create your first invoice!</a>
                </p>
              )}

              {recentInvoices.length > 0 && (
                <div className="text-center pt-2">
                  <a href="/invoices" className="text-primary-600 hover:underline text-sm">
                    View all invoices →
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;