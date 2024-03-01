
const Message = require('../models/message');

exports.addMessage = (req,res,next) => {
    const chatId = req.body.chatId;
    const senderId = req.body.senderId;
    const text = req.body.text;

    const message = new Message({
        chatId,
        senderId,
        text
    });
    message.save()
    .then(result => {
        res.status(201).json(result);
    })
    .catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    })
}

exports.getMessages = (req,res,next) => {
    const chatId = req.params.chatId;
    Message.findOne({chatId})
    .then(message => {
        res.status(200).json(message);
    })
    .catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    })
}