const registerController = require('../controllers/register.controller');
const router = require('express').Router();

router.get("/", registerController.renderRegisterPage)
router.post("/", registerController.userRegister);

module.exports = router;