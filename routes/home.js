const router = require('express').Router();
const homeController = require('../controllers/home.controller');

router.get('/', homeController.getHomePage);
router.get('/search', homeController.getSearchPage);
module.exports = router;
