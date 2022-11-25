const router = require('express').Router();
const apartmentController = require('../controllers/apartment.controller');

router.get('/:id', apartmentController.renderApartmentPage);
router.post('/post/:id', apartmentController.contactApartment);
module.exports = router;
