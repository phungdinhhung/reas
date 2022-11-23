const router = require('express').Router();
const commentController = require('../controllers/comment.controller');

router.post('/post/:id', commentController.newComment);

module.exports = router;
