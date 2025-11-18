import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const clientsAPI = {
  getClients: () => api.get('/clients'),
  createClient: (clientData) => api.post('/clients', clientData),
  updateClient: (id, clientData) => api.put(`/clients/${id}`, clientData),
  deleteClient: (id) => api.delete(`/clients/${id}`)
};

export const invoicesAPI = {
  getInvoices: () => api.get('/invoices'),
  getInvoice: (id) => api.get(`/invoices/${id}`),
  createInvoice: (invoiceData) => api.post('/invoices', invoiceData),
  updateInvoice: (id, invoiceData) => api.put(`/invoices/${id}`, invoiceData),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`),
  downloadPDF: (id) => 
    api.get(`/invoices/${id}/pdf`, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    }),
  
  previewPDF: (id) => 
    api.get(`/invoices/${id}/preview`, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    }),

  sendInvoiceEmail: (invoiceId, data) => 
    api.post(`/invoices/${invoiceId}/send-email`, data),   
};
export const emailAPI = {
  verifyConfiguration: () => api.get('/email/verify'),
};
export default api;