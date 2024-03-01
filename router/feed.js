const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed');
const isAuth = require('../middleware/isAuth');
const {check} = require('express-validator');


router.get('/posts',feedController.getPosts);
router.post('/post',isAuth,[
    check('title').trim().isLength({min : 5}),
    check('content').trim().isLength({min : 5})
],feedController.postPost);
router.put('/updatepost/:postId',isAuth,[
    check('title').trim().isLength({min : 5}),
    check('content').trim().isLength({min : 5})
],feedController.updatePost);
router.delete('/deletepost/:postId',isAuth,feedController.deletePost);


module.exports = router;