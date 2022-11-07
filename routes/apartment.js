const router = require("express").Router();
const apartmentController = require("../controllers/apartment.controller");

router.get("/:id", apartmentController.renderApartmentPage);


module.exports = router;
