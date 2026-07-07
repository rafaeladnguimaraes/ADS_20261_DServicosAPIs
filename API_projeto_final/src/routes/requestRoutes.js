const express = require('express');
const router = express.Router();
const requestController = require('../controller/requestController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, checkRole(['PARCIAL']), requestController.createRequest);
router.post('/calculate-recipe', verifyToken, checkRole(['PARCIAL']), requestController.createRequestFromRecipe);
router.put('/:id/status', verifyToken, checkRole(['TOTAL']), requestController.updateStatus);
router.get('/', verifyToken, checkRole(['PARCIAL', 'TOTAL']), requestController.getAllRequests);

module.exports = router;