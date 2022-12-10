const router = require('express').Router();

router.get('/', async (req, res) => {
   res.render('layouts/verify', { alert: req.flash('success'), fail: req.flash('fail') });
});

module.exports = router;
