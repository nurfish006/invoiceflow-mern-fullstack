// server.js - CLEAN FIXED VERSION
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ✅ Test route - PUT THIS FIRST
app.get('/', (req, res) => {
  console.log('✅ Root route called');
  res.json({ message: 'InvoiceFlow Backend is running!' });
});

// ✅ Simple test route
app.get('/api/test', (req, res) => {
  console.log('✅ Test route called');
  res.json({ message: 'Test route working!' });
});

// ✅ Simple register route (temporary)
app.post('/api/auth/register', (req, res) => {
  console.log('✅ Register route called:', req.body);
  res.json({ 
    success: true, 
    message: 'Registration working!',
    user: req.body 
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ✅ Use port 5000 (consistent with frontend)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Frontend: http://localhost:5173`);
});