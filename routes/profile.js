const router = require('express').Router();
const profileController = require('../controllers/profile.controller');

router.get("/", profileController.userInformation)

module.exports = router;