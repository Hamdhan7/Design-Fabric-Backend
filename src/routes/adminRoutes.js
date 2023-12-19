// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const promisePool = require('../config/database');
const multer = require('multer');
const path = require('path');

// Define storage for the images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images'); // Assuming you have a 'public/images' folder to store images
    },
    filename: (req, file, cb) => {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

// Admin-related routes
router.post('/products', upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `http://project-design-fabric-f30ca63e31e3.herokuapp.com/images/${req.file.filename}` : null;

    try {
        const [results] = await promisePool.execute('INSERT INTO Product (Name, Description, Price, ImageUrl) VALUES (?, ?, ?, ?)', [name, description, price, imageUrl]);
        res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
    } catch (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/products/:productId', upload.single('image'), async (req, res) => {
    const productId = req.params.productId;
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

    try {
        const [results] = await promisePool.execute('UPDATE Product SET Name = ?, Description = ?, Price = ?, ImageUrl = ? WHERE ProductID = ?', [name, description, price, imageUrl, productId]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.json({ message: 'Product updated successfully' });
        }
    } catch (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/products/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        // Delete associated order items first
        await promisePool.execute('DELETE FROM ProductOrder WHERE ProductID = ?', [productId]);

        // Delete associated product
        const [results] = await promisePool.execute('DELETE FROM Product WHERE ProductID = ?', [productId]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    } catch (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/orders', async (req, res) => {
    const selectQuery = `
      SELECT po.OrderId, po.ProductId, po.CustomerName, po.CustomerEmail, po.CustomerPhoneNumber, po.CustomerAddress,
             p.Name as ProductName
      FROM ProductOrder po
      LEFT JOIN product p ON po.ProductId = p.ProductID
    `;

    try {
        const [results] = await promisePool.execute(selectQuery);
        const orders = results.map((result) => ({
            OrderId: result.OrderId,
            ProductId: result.ProductId,
            CustomerName: result.CustomerName,
            CustomerEmail: result.CustomerEmail,
            CustomerPhoneNumber: result.CustomerPhoneNumber,
            CustomerAddress: result.CustomerAddress,
            ProductName: result.ProductName,
        }));
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error retrieving orders: ', err);
        res.status(500).send('Error retrieving orders');
    }
});

router.delete('/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const [results] = await promisePool.execute('DELETE FROM ProductOrder WHERE OrderId = ?', [orderId]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Order not found' });
        } else {
            res.json({ message: 'Order deleted successfully' });
        }
    } catch (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
