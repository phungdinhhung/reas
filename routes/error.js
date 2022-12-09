const router = require('express').Router();

router.get('/', async (req, res) => {
   res.render('layouts/error', { alert: req.flash('success'), fail: req.flash('fail') });
});

module.exports = router;
