import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    outstanding: 0,
    paidThisMonth: 0,
    overdue: 0
  });

  // Mock data for now - we'll connect to backend later
  useEffect(() => {
    setStats({
      totalInvoices: 12,
      outstanding: 2450.00,
      paidThisMonth: 1800.00,
      overdue: 750.00
    });
  }, []);

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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start">
                ➕ Create New Invoice
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                👥 Add New Client
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                📊 View Reports
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Invoice #001</p>
                  <p className="text-sm text-gray-600">Client: John Doe</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Pending</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Invoice #002</p>
                  <p className="text-sm text-gray-600">Client: Jane Smith</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Paid</span>
              </div>

              <p className="text-center text-gray-500 text-sm">
                No recent invoices. <a href="#" className="text-primary-600 hover:underline">Create your first invoice!</a>
              </p>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;