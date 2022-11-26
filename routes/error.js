const router = require('express').Router();
const adminController = require('../controllers/admin.controller');

router.get('/', async (req, res) => {
   res.render('layouts/error');
});

module.exports = router;
