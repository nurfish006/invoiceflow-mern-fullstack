const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - software that runs between request and response
//app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Understand JSON data
// Add to server.js after require statements
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

  app.use('/api/auth', require('./routes/auth'));
// Basic route - test if server works
app.get('/', (req, res) => {
  res.json({ message: 'InvoiceFlow Backend is running!' });
});
app.post('/api/auth/register', (req, res) => {
  console.log('Registration attempt:', req.body);
  res.json({ 
    success: true, 
    message: 'Registration would work here!',
    user: req.body 
  });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});