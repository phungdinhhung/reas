const authController = require('../controllers/auth.controller');
const router = require('express').Router();
router.get('/', async (req, res) => {
   return res.render('../views/layouts/login', { errors: '' });
});
router.post('/', authController.loginUser);

module.exports = router;
