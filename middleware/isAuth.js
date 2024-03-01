const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        const error = new Error("Unauthorized User");
        error.statusCode = 401;
        throw error;
    }
    let decodedToken;
    const token = authHeader.split(' ')[1];
    try{
        decodedToken = jwt.verify(token,'secret');
        if(!decodedToken){
            const error = new Error("Unauthorize User.");
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId;
        next();
    }catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        throw error;
    }
}