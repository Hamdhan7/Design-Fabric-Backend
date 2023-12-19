// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const promisePool = require('../config/database');

// Get all products with image URLs
router.get('/products', async (req, res) => {
  try {
    const [results, fields] = await promisePool.execute('SELECT ProductID, Name, Description, Price, ImageURL FROM Product');
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Place orders
router.post('/orders', async (req, res) => {
  const { ProductId, CustomerName, CustomerEmail, CustomerPhoneNumber, CustomerAddress } = req.body;

  const insertQuery = `
    INSERT INTO ProductOrder (ProductId, CustomerName, CustomerEmail, CustomerPhoneNumber, CustomerAddress)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [results] = await promisePool.execute(insertQuery, [ProductId, CustomerName, CustomerEmail, CustomerPhoneNumber, CustomerAddress]);
    res.status(201).json({ message: 'Order created successfully', orderId: results.insertId });
  } catch (err) {
    console.error('Error creating order: ', err);
    res.status(500).send('Error creating order');
  }
});

module.exports = router;
