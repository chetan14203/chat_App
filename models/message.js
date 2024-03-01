
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    chatId : {
        type : String
    },
    senderId : {
        type : String
    },
    text : {
        type : String
    }
},{
    timestamps : true
})

exports.module = mongoose.model("Message",messageSchema);