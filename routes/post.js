const router = require('express').Router();
const postController = require('../controllers/post.controller');

router.get("/", postController.renderPostPage);

module.exports = router;