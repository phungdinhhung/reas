const router = require('express').Router();
const favoriteController = require('../controllers/favorite.controller');

router.get('/', favoriteController.getFavoritePage);
router.post('/like/:id', favoriteController.postFavorite);
router.get('/unlike/:id', favoriteController.deleteFavorite);

module.exports = router;
