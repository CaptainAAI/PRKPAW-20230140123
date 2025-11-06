const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

// Protect the route with authentication and admin check
router.get('/daily', authenticateToken, isAdmin, reportController.getDailyReport);

module.exports = router;
