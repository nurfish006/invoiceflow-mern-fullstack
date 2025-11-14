// src/components/layout/DashboardLayout.jsx - UPDATE NAVIGATION
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">InvoiceFlow</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {user?.name}
          </p>
          {user?.companyName && (
            <p className="text-xs text-gray-500 mt-1">{user.companyName}</p>
          )}
        </div>
        
        <nav className="mt-6">
          <Link to="/" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">
            📊 Dashboard
          </Link>
          <Link to="/invoices" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">
            📄 Invoices
          </Link>
          <Link to="/clients" className="block py-2 px-6 text-gray-700 hover:bg-gray-100">
            👥 Clients
          </Link>
          <button 
            onClick={logout}
            className="block w-full text-left py-2 px-6 text-gray-700 hover:bg-gray-100 mt-4"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <div className="text-sm text-gray-600">
              {user?.email}
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;