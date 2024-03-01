const Post = require('../models/feed');
const User = require('../models/user');
const upload = require('../middleware/upload');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');


exports.getPosts = (req,res,next) => {
    let page = req.body.page;
    if(!page){
        page = 1;
    }
    const perPage = 2;
    Post.find().skip((page-1)*perPage).limit(perPage)
    .then(posts => {
            if(!posts){
                const error = new Error("No post is available.");
            }
            res.status(200).json({post : posts});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.postPost = (req,res,next) => {
    upload(req,res,function(err) {
        if(err instanceof multer.MulterError){
            return next(err);
        }else if(err) {
            return next(err);
        }
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error("Validation failed.");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
           const title = req.body.title;
           const content = req.body.content;
           const imageUrl = req.file.path;
           const creator = req.userId;
           const post = new Post({
              title : title,
              content : content,
              imageUrl : imageUrl,
              creator : creator
            });
            post.save().then(result =>{
              return User.findById(creator);
            }).then(user => {
              user.posts.push(post);
              return user.save();
            }).then(result => {
              res.status(201).json({message : "Post is Created."});
            })
            .catch(err => {
             if(!err.statusCode){
                 err.statusCode = 500;
            }
              next(err);
            });
     });    
}


exports.updatePost = (req,res,next) => {
    upload(req,res,function(err) {
        if(err instanceof multer.MulterError){
            return next(err);
    }else if(err) {
            return next(err);
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path;
    }
    Post.findById(req.params.postId)
    .then(post => {
        if(!post){
            const error = new Error("No post is found.");
            error.statusCode = 404;
            throw error;
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Unauthorized user.");
            error.statusCode = 401;
            throw error;
        }
        if(post.imageUrl !== imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    })
    .then(result => {
        res.status(200).json({message : "Post is updated."});
    })
    .catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    })
  })
}


exports.deletePost = (req,res,next) => {
    Post.findById(req.params.postId)
    .then(post => {
        if(!post){
            const error = new Error("No post is found.");
            error.statusCode = 404;
            throw error;
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Unauthorized User.");
            error.statusCode = 401;
            throw error;
        }
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(req.params.postId);
    })
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        user.posts.pull(req.params.postId);
        return user.save();
    })
    .then(result => {
        res.status(201).json({message : "Post is deleted."});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


const clearImage = filePath => {
    filePath = path.join(__dirname,'..',filePath);
    fs.unlink(filePath,error => {
        console.log(error);
    })
}