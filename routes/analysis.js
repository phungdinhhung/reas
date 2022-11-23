const router = require('express').Router();
const analysisController = require('../controllers/analysis.controller');

router.post('/:id', analysisController.getAnalysisPage);

module.exports = router;
