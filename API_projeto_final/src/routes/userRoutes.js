const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.get('/', verifyToken, checkRole(['TOTAL']), userController.getAllUsers);
router.put('/:id', verifyToken, checkRole(['TOTAL']), userController.updateUser);
router.delete('/:id', verifyToken, checkRole(['TOTAL']), userController.deleteUser);

module.exports = router;