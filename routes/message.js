const router = require('express').Router();
const messageController = require('../controllers/message.controller');

router.post('/', messageController.postMessage);

module.exports = router;
