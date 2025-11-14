const express = require('express');
const { 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient 
} = require('../controllers/clientController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Make sure these are proper function references
router.route('/')
  .get(protect, getClients)
  .post(protect, createClient);

router.route('/:id')
  .put(protect, updateClient)
  .delete(protect, deleteClient);

module.exports = router;