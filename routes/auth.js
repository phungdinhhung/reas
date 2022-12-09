const authController = require('../controllers/auth.controller');
const router = require('express').Router();
router.get('/', async (req, res) => {
   res.render('../views/layouts/login', { title: 'Login page', alert: req.flash('success'), fail: req.flash('fail') });
});
router.post('/', authController.loginUser);

module.exports = router;
