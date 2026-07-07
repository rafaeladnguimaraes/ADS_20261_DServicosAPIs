const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, productController.getAllProducts);
router.post('/', verifyToken, checkRole(['TOTAL']), productController.createProduct);

module.exports = router;