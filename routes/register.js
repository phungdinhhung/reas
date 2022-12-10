const registerController = require('../controllers/register.controller');
const router = require('express').Router();

router.get('/', registerController.renderRegisterPage);
router.post('/', registerController.userRegister);

router.get('/verify', registerController.verifyMail);
module.exports = router;
