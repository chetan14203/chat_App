const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const feedRouter = require('./router/feed');
const userRouter = require('./router/user');
const chatRouter = require('./router/chat');
const messageRouter = require("./router/message");
const user = require('./models/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  }); 

app.use('/feed',feedRouter);
app.use('/user',userRouter);
app.use("/chat",chatRouter);
app.use("/message",messageRouter);

app.use((error,req,res,next) => {
  console.log(error);
    const message = error.message;
    const status = error.statusCode || 500;
    const data = error.data;
    res.status(status).json({message : message,data : data});
})


mongoose.connect(`mongodb+srv://Chetan:Pass12345@cluster0.wd2crgv.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`)
.then(result => {
    const server = app.listen(3000);
    const io = require("socket.io")(server);
    let activeUsers = [];
    io.on("connection",(socket) =>{
      socket.on("new-user-add",(newUserId) => {
        if(!activeUsers.some((user)=> user.UserId === newUserId)){
              activeUsers.push({
                UserId : newUserId,
                socketId : socket.id
              })
        }
        console.log("User connected.",activeUsers);
        io.emit("get-user",activeUsers);
      })
      socket.on("disconnect",() => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User disconnected.",activeUsers);
      })
    })
    console.log(`Server is live.`)
})
.catch(err => {
    console.log('Chetan');
    res.status(500).json({message : err});
})