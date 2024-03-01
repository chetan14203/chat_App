const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads/');
    },
    filename : (req,file,cb) => {
        cb(null,Date.now().toString()+'-'+file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

module.exports = multer({storage:fileStorage,fileFilter:fileFilter}).single('image');