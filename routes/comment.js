const router = require('express').Router();
const commentController = require('../controllers/comment.controller');

router.post('/post/:id', commentController.newComment);
router.post('/delete/:apartmentId/:id', commentController.deleteComment);
module.exports = router;
