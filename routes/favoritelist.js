const router = require('express').Router();
const favoriteController = require('../controllers/favorite.controller');

router.get('/', favoriteController.getFavoritePage);

module.exports = router;
