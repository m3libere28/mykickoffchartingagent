const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// POST /api/generate-summary
// Expects { "adimeData": { ... } } in the body
router.post('/', summaryController.generatePatientSummary);

module.exports = router;
