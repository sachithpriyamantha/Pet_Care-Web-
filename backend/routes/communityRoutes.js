
const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/posts', communityController.upload.single('image'), communityController.createPost);
router.get('/posts', communityController.getPosts);

router.post('/replies', communityController.createReply);
router.get('/replies/:postId', communityController.getRepliesForPost);


router.put('/posts/:postId', communityController.upload.single('image'), communityController.editPost);
router.delete('/posts/:postId', communityController.deletePost);


module.exports = router;