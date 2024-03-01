const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../util/sendEmail');

exports.signUp = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    User.findOne({email:email})
    .then(result => {
        if(result){
            const error = new Error("Email already exist.");
            error.statusCode = 403;
            throw error;
        }
        return bcrypt.hash(password,12);
    }).then(hashedPw => {
        const user = new User({
            name : name,
            password : hashedPw,
            email : email
        });
        return user.save();
    }).then(result => {
        const to = email;
        const subject = "Sign Up.";
        const text = "User signed up successfully.";
        sendEmail(to,subject,text);
        res.status(201).json({message : "User signed Up successfully."});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.login = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    var token;
    User.findOne({email:email})
    .then(user => {
        if(!user){
            const error = new Error("Email is not registered.");
            error.statusCode = 403;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password,user.password);
    }).then(isMatch => {
        if(!isMatch){
            const error = new Error('Unauthorize User.');
            error.statusCode = 401;
            throw error;
        }
        token = jwt.sign({userId : loadedUser._id.toString(),email:loadedUser.email},'secret',{expiresIn:'1h'});
        res.status(200).json({token:token,email:loadedUser.email,userId:loadedUser._id.toString()});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.sendReset = (req,res,next) => {
    const email = req.body.email;
    User.findOne({email:email})
    .then(user => {
        if(!user){
            const error = new Error("No User is found.");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({userId:user._id,email:user.email},'secret',{expiresIn:900});
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 900000;
        return user.save()
        .then(result => {
            const to = email;
            const subject = "Password Reset.";
            const text = `<p>You requested password reset.</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a></p>`
            sendEmail(to,subject,text);
            res.status(200).json({message : "Email is sent."})
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.passwordReset =(req,res,next) => {
    const token = req.params.token;
    const password = req.body.password;
    let resetUser;
    User.findOne({resetToken : token.toString(),resetTokenExpiry : {$gt : Date.now()}})
    .then(user => {
        if(!user){
            const error = new Error("No user found.");
            error.statusCode = 404;
            throw error;
        }
        resetUser = user;
        return bcrypt.hash(password,12);
    })
    .then(hashedPw => {
        resetUser.password = hashedPw;
        resetUser.resetToken = null;
        resetUser.resetTokenExpiry = null;
        return resetUser.save();
    })
    .then(result => {
        const to = resetUser.email;
        const subject = "Password confirmation";
        const text = "Password is changed.";
        sendEmail(to,subject,text);
        res.status(200).json({message : "Password is changed."});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        console.log("Chetan");
        next(err);
    });
}
