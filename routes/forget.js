const router = require('express').Router();
const authController = require('../controllers/auth.controller');
router.post('/', authController.forgetPassword);

module.exports = router;
