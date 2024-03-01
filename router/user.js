const express = require('express');
const router = express.Router();
const userController = require('../controller/user');


router.post('/signup',userController.signUp);
router.post('/login',userController.login);
router.post('/reset',userController.sendReset);
router.post('/passwordreset/:token',userController.passwordReset);


module.exports = router;