const express = require("express");
const router = express.Router();

const batchController = require('../controllers/batchController');
const authMiddleware = require("../middleware/authmiddleware");

router.post('/', authMiddleware, batchController.createBatch);
router.get('/', authMiddleware, batchController.getBatch);
router.get('/:id', authMiddleware, batchController.getBatchById);
router.put('/:id', authMiddleware, batchController.updateBatch);
router.delete('/:id', authMiddleware, batchController.deleteBatch);

module.exports = router;
