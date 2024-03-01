const express = require("express");

const router = express.Router();
const chatController = require("../controller/chat");


router.post("/",chatController.createChat);
router.get("/:userId",chatController.userChats);
router.get("/:firstId/:secondId",chatController.findChat);


module.exports = router;