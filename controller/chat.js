
const Chat = require("../models/chat");

exports.createChat = (req,res,next) => {
    const chat = new Chat({
        members : {$all : [req.body.userId,req.body.senderId]}
    });
    chat.save()
    .then(result => {
        res.send(201).json(chat);
    })
    .catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    })
}


exports.userChats = (req,res,next) => {
    Chat.findOne({members : {$in : [req.params.userId]}})
    .then(chat => {
        res.status(200).json(chat);
    })
    .catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    })
}


exports.findChat = (req,res,next) => {
    Chat.findOne({members : {$in : [req.params.firstId,req.params.secondId]}})
    .then(chat => {
        res.status(200).json(chat);
    })
    .catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    })
}