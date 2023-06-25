const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport')
const config = require('../config/database')
const Stock = require('../models/Stock');

// Add stock route
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { type, name, quantity, purchaseRate, salesRate } = req.body;

  // Create a new stock instance using the Stock model
  const newStock = new Stock({
    type: type,
    name: name,
    quantity: quantity,
    purchaseRate: purchaseRate,
    salesRate: salesRate,
    createdBy: req.user.username
  });

  // Save the new stock to the database
  newStock.save()
    .then(savedStock => {
      res.json({ success: true, message: 'Stock added successfully', stock: savedStock });
    })
    .catch(error => {
      res.status(500).json({ success: false, message: 'Failed to add stock', error: error });
    });
});


// List stocks route
router.get('/list', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Retrieve stocks from the database
    Stock.find({ createdBy: req.user.username })
      .then(stocks => {
        res.json({ success: true, stocks: stocks });
      })
      .catch(error => {
        res.status(500).json({ success: false, message: 'Failed to retrieve stocks', error: error });
      });
  });

module.exports = router;
